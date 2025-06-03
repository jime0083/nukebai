<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useSubscriptionStore } from '../stores/subscription'

const router = useRouter()
const userStore = useUserStore()
const subscriptionStore = useSubscriptionStore()

const usePoints = ref(0)
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const isLoggedIn = computed(() => !!userStore.user)
const isPremium = computed(() => userStore.subscriptionStatus === 'premium')
const userPoints = computed(() => userStore.points || 0)
const maxPointsToUse = computed(() => Math.min(1000, userPoints.value))
const remainingPrice = computed(() => 1000 - usePoints.value)

onMounted(async () => {
  if (userStore.user) {
    await subscriptionStore.fetchSubscription()
  }
})

function handlePointsChange(event) {
  const value = parseInt(event.target.value)
  usePoints.value = Math.min(maxPointsToUse.value, Math.max(0, value))
}

async function handleUpgrade() {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    // This would normally involve Stripe integration
    const result = await subscriptionStore.upgradeSubscription({
      usePoints: usePoints.value
    })
    
    if (result) {
      success.value = true
    } else {
      error.value = subscriptionStore.error || '決済処理中にエラーが発生しました。'
    }
  } catch (err) {
    console.error('Subscription error:', err)
    error.value = '予期せぬエラーが発生しました。'
  } finally {
    loading.value = false
  }
}

function validateForm() {
  if (!cardNumber.value || !cardExpiry.value || !cardCvc.value) {
    error.value = 'すべての支払い情報を入力してください。'
    return false
  }
  
  // Very basic validation
  if (!/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ''))) {
    error.value = 'カード番号が無効です。'
    return false
  }
  
  if (!/^\d{2}\/\d{2}$/.test(cardExpiry.value)) {
    error.value = '有効期限が無効です。'
    return false
  }
  
  if (!/^\d{3,4}$/.test(cardCvc.value)) {
    error.value = 'セキュリティコードが無効です。'
    return false
  }
  
  return true
}
</script>

<template>
  <div class="subscription-page">
    <div class="container">
      <div v-if="!isLoggedIn" class="login-prompt">
        <h2>プレミアム会員になるにはログインしてください</h2>
        <div class="prompt-actions">
          <router-link to="/login" class="primary">ログイン</router-link>
          <router-link to="/register">新規登録</router-link>
        </div>
      </div>
      
      <div v-else-if="success" class="success-container">
        <div class="success-message">
          <div class="success-icon">✓</div>
          <h2>プレミアム会員登録が完了しました！</h2>
          <p>サブスクリプションが正常に処理されました。すべての機能をお楽しみください。</p>
          <div class="success-actions">
            <router-link to="/" class="primary">トップページへ</router-link>
            <router-link to="/profile">マイページへ</router-link>
          </div>
        </div>
      </div>
      
      <div v-else-if="isPremium" class="premium-status">
        <h2>プレミアム会員です</h2>
        <div class="premium-status-content">
          <div class="premium-badge">プレミアム会員</div>
          <p>あなたは既にプレミアム会員です。すべての機能をご利用いただけます。</p>
          <div class="subscription-details">
            <p v-if="subscriptionStore.subscriptionData">
              <span class="label">次回更新日:</span>
              <span class="value">{{ new Date(subscriptionStore.subscriptionData.currentPeriodEnd).toLocaleDateString('ja-JP') }}</span>
            </p>
            <p>
              <span class="label">現在のポイント:</span>
              <span class="value points">{{ userPoints }}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div v-else class="subscription-container">
        <h2>プレミアム会員にアップグレード</h2>
        
        <div class="subscription-content">
          <div class="plans-comparison">
            <div class="plan free-plan">
              <h3>無料会員</h3>
              <div class="plan-price">¥0</div>
              <ul class="plan-features">
                <li>レビュー閲覧（制限あり）</li>
                <li>3回まで詳細閲覧可能</li>
                <li>レビュー投稿（ポイント獲得）</li>
                <li class="disabled">詳細な理由表示</li>
                <li class="disabled">画像の表示</li>
                <li class="disabled">無制限の検索</li>
              </ul>
              <div class="plan-action">
                <span>現在のプラン</span>
              </div>
            </div>
            
            <div class="plan premium-plan">
              <div class="recommended">おすすめ</div>
              <h3>プレミアム会員</h3>
              <div class="plan-price">¥1,000<span>/月</span></div>
              <ul class="plan-features">
                <li>レビュー閲覧（無制限）</li>
                <li>詳細閲覧（無制限）</li>
                <li>レビュー投稿（ポイント獲得）</li>
                <li>詳細な理由表示</li>
                <li>画像の表示</li>
                <li>無制限の検索</li>
              </ul>
              <div class="plan-action">
                <span>選択中</span>
              </div>
            </div>
          </div>
          
          <div class="payment-section">
            <h3>支払い情報</h3>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <form @submit.prevent="handleUpgrade">
              <div v-if="userPoints > 0" class="points-usage">
                <h4>ポイントを使用する</h4>
                <p>現在の保有ポイント: <span class="points">{{ userPoints }}</span></p>
                
                <div class="points-slider-container">
                  <input 
                    type="range" 
                    min="0" 
                    :max="maxPointsToUse" 
                    v-model.number="usePoints"
                    @input="handlePointsChange"
                    class="points-slider"
                  />
                  <div class="points-values">
                    <span>0</span>
                    <span>{{ maxPointsToUse }}</span>
                  </div>
                </div>
                
                <div class="points-summary">
                  <p>使用ポイント: <span class="points">{{ usePoints }}</span> ({{ usePoints }}円分)</p>
                  <p>お支払い金額: <span class="price">{{ remainingPrice }}円</span></p>
                </div>
              </div>
              
              <div class="card-details">
                <div class="form-group">
                  <label for="cardNumber">カード番号</label>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    v-model="cardNumber" 
                    placeholder="1234 5678 9012 3456"
                    maxlength="19"
                    required
                  />
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="cardExpiry">有効期限</label>
                    <input 
                      type="text" 
                      id="cardExpiry" 
                      v-model="cardExpiry" 
                      placeholder="MM/YY"
                      maxlength="5"
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="cardCvc">セキュリティコード</label>
                    <input 
                      type="text" 
                      id="cardCvc" 
                      v-model="cardCvc" 
                      placeholder="123"
                      maxlength="4"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-group payment-terms">
                <p>
                  支払いは毎月自動的に更新されます。いつでもキャンセル可能です。
                  決済にはStripeを使用しています。
                </p>
              </div>
              
              <div class="form-actions">
                <button type="submit" class="primary subscribe-button" :disabled="loading">
                  <span v-if="loading">処理中...</span>
                  <span v-else>{{ remainingPrice }}円で登録する</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subscription-page {
  min-height: calc(100vh - 200px);
}

.subscription-container,
.premium-status,
.login-prompt,
.success-container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-xl) 0;
}

h2 {
  margin-bottom: var(--space-xl);
  position: relative;
  display: inline-block;
}

h2:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--color-primary);
}

.login-prompt {
  text-align: center;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xxl);
  margin-top: var(--space-xxl);
}

.login-prompt h2 {
  margin-bottom: var(--space-xl);
  display: block;
}

.login-prompt h2:after {
  left: 50%;
  transform: translateX(-50%);
}

.prompt-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
}

.prompt-actions a {
  min-width: 150px;
  text-align: center;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  font-weight: 500;
}

.prompt-actions a:not(.primary) {
  border: 1px solid var(--color-on-surface-variant);
  color: var(--color-on-surface-variant);
}

.prompt-actions a:not(.primary):hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.subscription-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

.plans-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.plan {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform var(--transition-duration) ease,
              box-shadow var(--transition-duration) ease;
}

.plan:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.premium-plan {
  border: 2px solid var(--color-primary);
}

.recommended {
  position: absolute;
  top: -15px;
  right: 20px;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--border-radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
}

.plan h3 {
  text-align: center;
  margin-bottom: var(--space-md);
  font-size: 1.5rem;
}

.plan-price {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: var(--space-lg);
}

.plan-price span {
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-on-surface-variant);
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-xl) 0;
}

.plan-features li {
  padding: var(--space-sm) 0;
  position: relative;
  padding-left: 30px;
}

.plan-features li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-success);
}

.plan-features li.disabled {
  color: var(--color-on-surface-variant);
}

.plan-features li.disabled:before {
  content: '×';
  color: var(--color-on-surface-variant);
}

.plan-action {
  text-align: center;
}

.plan-action span {
  display: inline-block;
  padding: var(--space-sm) var(--space-lg);
  font-weight: 500;
}

.premium-plan .plan-action span {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--border-radius-sm);
}

.payment-section {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xl);
}

.payment-section h3 {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-surface-variant);
}

.points-usage {
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-surface-variant);
}

.points-usage h4 {
  margin-bottom: var(--space-md);
}

.points {
  font-weight: 700;
  color: var(--color-primary);
}

.points-slider-container {
  margin: var(--space-lg) 0;
}

.points-slider {
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  background: var(--color-surface-variant);
  border-radius: 4px;
  outline: none;
}

.points-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.points-values {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-xs);
  color: var(--color-on-surface-variant);
}

.points-summary {
  background-color: var(--color-surface-variant);
  padding: var(--space-md);
  border-radius: var(--border-radius-sm);
}

.price {
  font-weight: 700;
  font-size: 1.2rem;
}

.card-details {
  margin-bottom: var(--space-xl);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.payment-terms {
  margin-bottom: var(--space-lg);
}

.payment-terms p {
  font-size: 0.9rem;
  color: var(--color-on-surface-variant);
}

.subscribe-button {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
}

.error-message {
  background-color: rgba(211, 47, 47, 0.1);
  color: var(--color-error);
  padding: var(--space-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-lg);
}

.premium-status-content {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xl);
  text-align: center;
}

.premium-badge {
  display: inline-block;
  background-color: var(--color-accent);
  color: var(--color-on-accent);
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  margin-bottom: var(--space-lg);
}

.subscription-details {
  margin-top: var(--space-xl);
  padding: var(--space-lg);
  background-color: var(--color-surface-variant);
  border-radius: var(--border-radius-sm);
  text-align: left;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.subscription-details p {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.label {
  color: var(--color-on-surface-variant);
}

.success-container {
  text-align: center;
}

.success-message {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xxl);
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: var(--color-success);
  color: white;
  font-size: 2rem;
  border-radius: 50%;
  margin: 0 auto var(--space-xl);
}

.success-message h2 {
  display: block;
  margin-bottom: var(--space-lg);
}

.success-message h2:after {
  left: 50%;
  transform: translateX(-50%);
}

.success-message p {
  margin-bottom: var(--space-xl);
}

.success-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
}

.success-actions a {
  min-width: 150px;
  text-align: center;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius-sm);
  text-decoration: none;
  font-weight: 500;
}

.success-actions a:not(.primary) {
  border: 1px solid var(--color-on-surface-variant);
  color: var(--color-on-surface-variant);
}

.success-actions a:not(.primary):hover {
  background-color: rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
  .payment-section {
    padding: var(--space-lg);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .success-actions, .prompt-actions {
    flex-direction: column;
  }
}
</style>