<template>
  <div class="contract-management">
    <h1>契約内容の変更</h1>
    
    <div v-if="loading" class="loading-container">
      <p>読み込み中...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <p>エラーが発生しました: {{ error }}</p>
      <button @click="loadSubscriptionData" class="btn btn-primary">再読込</button>
    </div>
    
    <div v-else class="subscription-details">
      <div class="current-plan">
        <h2>現在のプラン</h2>
        <div class="plan-info">
          <p><strong>プラン名:</strong> {{ userStore.isPaidUser ? 'プレミアム会員' : '無料会員' }}</p>
          <p><strong>ステータス:</strong> {{ subscriptionStatusText }}</p>
          <p><strong>次回更新日:</strong> {{ nextBillingDateFormatted }}</p>
          <p><strong>月額:</strong> {{ formattedPrice }}</p>
          <p v-if="appliedCoupon"><strong>適用中の割引:</strong> {{ appliedCoupon }}</p>
        </div>
      </div>
      
      <!-- クーポンコード適用セクション -->
      <div v-if="isActivePlan && !isCancelledPlan" class="coupon-section">
        <h2>クーポンコードを適用する</h2>
        <p>クーポンコードをお持ちの場合、下記から入力して次回請求時に割引を適用できます。</p>
        
        <div class="coupon-form">
          <div class="input-group">
            <input 
              type="text" 
              v-model="couponCode" 
              placeholder="クーポンコード" 
              class="form-control"
              :disabled="couponLoading || couponSuccess"
            />
            <button 
              @click="validateAndApplyCoupon" 
              class="btn btn-primary" 
              :disabled="couponLoading || !couponCode || couponSuccess">
              {{ couponSuccess ? '適用済み' : '適用する' }}
            </button>
          </div>
          
          <div v-if="couponLoading" class="coupon-loading">
            <p>クーポンコードを検証中...</p>
          </div>
          
          <div v-if="couponError" class="coupon-error">
            <p>{{ couponError }}</p>
          </div>
          
          <div v-if="couponSuccess" class="coupon-success">
            <p>クーポンが正常に適用されました。次回の請求時から割引が適用されます。</p>
            <p>{{ couponDetails }}</p>
          </div>
        </div>
      </div>
      
      <div class="cancellation-section">
        <h2>解約手続き</h2>
        <p class="warning">
          解約すると、期間終了時にプレミアム会員の特典が使用できなくなります。
          期間終了まではプレミアム機能を引き続きご利用いただけます。
        </p>
        
        <div v-if="!showConfirmation && isActivePlan">
          <button @click="showConfirmation = true" class="btn btn-danger">解約手続きを始める</button>
        </div>
        
        <div v-if="showConfirmation" class="confirmation-box">
          <h3>解約確認</h3>
          <p>本当に解約しますか？</p>
          <p>解約すると、<strong>{{ nextBillingDateFormatted }}</strong> 以降はプレミアム機能が使用できなくなります。</p>
          
          <div v-if="cancellationLoading">
            <p>処理中...</p>
          </div>
          
          <div v-else-if="cancellationError" class="error-message">
            <p>エラーが発生しました: {{ cancellationError }}</p>
          </div>
          
          <div class="action-buttons">
            <button @click="cancelSubscription" class="btn btn-danger" :disabled="cancellationLoading">解約する</button>
            <button @click="showConfirmation = false" class="btn btn-secondary" :disabled="cancellationLoading">キャンセル</button>
          </div>
        </div>
        
        <div v-if="isCancelledPlan" class="already-cancelled">
          <p>
            解約手続きが完了しています。<strong>{{ nextBillingDateFormatted }}</strong> までプレミアム機能をご利用いただけます。
          </p>
          <button @click="reactivateSubscription" class="btn btn-primary" :disabled="reactivationLoading">
            解約をキャンセルする
          </button>
          <div v-if="reactivationError" class="error-message">
            <p>エラーが発生しました: {{ reactivationError }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

export default {
  name: 'ContractManagement',
  setup() {
    const userStore = useUserStore();
    const auth = getAuth();
    const functions = getFunctions();
    
    // 状態管理
    const loading = ref(true);
    const error = ref(null);
    const subscriptionData = ref(null);
    const showConfirmation = ref(false);
    const cancellationLoading = ref(false);
    const cancellationError = ref(null);
    const reactivationLoading = ref(false);
    const reactivationError = ref(null);
    
    // クーポン関連の状態
    const couponCode = ref('');
    const couponLoading = ref(false);
    const couponError = ref(null);
    const couponSuccess = ref(false);
    const couponDetails = ref('');
    const appliedCoupon = ref(null);
    
    // サブスク情報の取得
    const loadSubscriptionData = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const getSubscriptionDetails = httpsCallable(functions, 'getSubscriptionDetails');
        const result = await getSubscriptionDetails();
        subscriptionData.value = result.data;
      } catch (err) {
        console.error('サブスクリプション情報の取得に失敗しました', err);
        error.value = err.message || '情報の取得に失敗しました';
      } finally {
        loading.value = false;
      }
    };
    
    // 解約処理
    const cancelSubscription = async () => {
      cancellationLoading.value = true;
      cancellationError.value = null;
      
      try {
        const cancelSubscriptionFunc = httpsCallable(functions, 'cancelSubscription');
        await cancelSubscriptionFunc();
        // 成功したら情報を再取得
        await loadSubscriptionData();
        showConfirmation.value = false;
      } catch (err) {
        console.error('解約処理に失敗しました', err);
        cancellationError.value = err.message || '解約処理に失敗しました';
      } finally {
        cancellationLoading.value = false;
      }
    };
    
    // 解約キャンセル処理
    const reactivateSubscription = async () => {
      reactivationLoading.value = true;
      reactivationError.value = null;
      
      try {
        const reactivateSubscriptionFunc = httpsCallable(functions, 'reactivateSubscription');
        await reactivateSubscriptionFunc();
        // 成功したら情報を再取得
        await loadSubscriptionData();
      } catch (err) {
        console.error('解約のキャンセル処理に失敗しました', err);
        reactivationError.value = err.message || '解約のキャンセル処理に失敗しました';
      } finally {
        reactivationLoading.value = false;
      }
    };
    
    // 計算プロパティ
    const isActivePlan = computed(() => {
      if (!subscriptionData.value) return false;
      return subscriptionData.value.status === 'active' && !subscriptionData.value.cancelAtPeriodEnd;
    });
    
    const isCancelledPlan = computed(() => {
      if (!subscriptionData.value) return false;
      return subscriptionData.value.status === 'active' && subscriptionData.value.cancelAtPeriodEnd;
    });
    
    const subscriptionStatusText = computed(() => {
      if (!subscriptionData.value) return 'N/A';
      
      if (subscriptionData.value.status === 'active') {
        if (subscriptionData.value.cancelAtPeriodEnd) {
          return '解約手続き済み（期間終了まで有効）';
        }
        return '有効';
      } else if (subscriptionData.value.status === 'canceled') {
        return '解約済み';
      } else if (subscriptionData.value.status === 'past_due') {
        return '支払期限切れ';
      } else {
        return subscriptionData.value.status;
      }
    });
    
    const nextBillingDateFormatted = computed(() => {
      if (!subscriptionData.value || !subscriptionData.value.currentPeriodEnd) {
        return 'N/A';
      }
      
      const date = new Date(subscriptionData.value.currentPeriodEnd * 1000);
      
      // JavaScriptのDateオブジェクトで日付フォーマットを行う
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      // 曜日の配列
      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      const weekday = weekdays[date.getDay()];
      
      return `${year}年${month}月${day}日（${weekday}）`;
    });
    
    const formattedPrice = computed(() => {
      if (!subscriptionData.value || !subscriptionData.value.plan) {
        return 'N/A';
      }
      
      let amount = subscriptionData.value.plan.amount / 100; // Stripeは額を最小単位（銭）で保存
      
      // クーポン割引の適用
      if (appliedCoupon.value) {
        if (appliedCoupon.value.percent_off) {
          // パーセント割引の場合
          const discountRate = appliedCoupon.value.percent_off / 100;
          amount = amount * (1 - discountRate);
        } else if (appliedCoupon.value.amount_off) {
          // 固定額割引の場合
          const discountAmount = appliedCoupon.value.amount_off / 100;
          amount = Math.max(0, amount - discountAmount);
        }
      }
      
      // 小数点以下を切り捨て
      amount = Math.floor(amount);
      return `${amount.toLocaleString()}円 / 月`;
    });
    
    // クーポンを検証して適用する
    const validateAndApplyCoupon = async () => {
      if (!couponCode.value) return;
      
      couponLoading.value = true;
      couponError.value = null;
      couponSuccess.value = false;
      
      // まずクーポンコードをHTTPリクエストで送信して有効性を確認
      try {
        // Cloud FunctionsのURLを取得
        const region = 'asia-northeast1';
        const projectId = process.env.VUE_APP_FIREBASE_PROJECT_ID || 'nukebai';
        const validateCouponUrl = `https://${region}-${projectId}.cloudfunctions.net/validateCoupon`;
        
        // クーポン検証リクエストを実行
        const validateResponse = await fetch(validateCouponUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            couponCode: couponCode.value
          })
        });
        
        const validateResult = await validateResponse.json();
        
        // クーポンが有効な場合、サブスクリプションに適用
        if (validateResult.valid) {
          // 有効なクーポンが返ってきた場合はサブスクリプションに適用する
          const applyCouponToSubscription = httpsCallable(functions, 'applyCouponToSubscription');
          const result = await applyCouponToSubscription({
            couponCode: couponCode.value
          });
          
          if (result.data.success) {
            couponSuccess.value = true;
            couponDetails.value = result.data.discount;
            appliedCoupon.value = result.data.discount;
          } else {
            couponError.value = result.data.message || 'クーポンの適用に失敗しました';
          }
        } else {
          // 無効なクーポンの場合
          couponError.value = validateResult.message || '無効なクーポンコードです';
        }
      } catch (err) {
        console.error('クーポン適用エラー:', err);
        couponError.value = err.message || 'クーポン処理中にエラーが発生しました';
      } finally {
        couponLoading.value = false;
      }
    };
    
    onMounted(() => {
      if (userStore.isLoggedIn && userStore.isPaidUser) {
        loadSubscriptionData();
      } else {
        loading.value = false;
      }
    });
    
    return {
      loading,
      error,
      subscriptionData,
      showConfirmation,
      cancellationLoading,
      cancellationError,
      reactivationLoading,
      reactivationError,
      loadSubscriptionData,
      cancelSubscription,
      reactivateSubscription,
      subscriptionStatusText,
      formattedPrice,
      nextBillingDateFormatted,
      isActivePlan,
      isCancelledPlan,
      userStore,
      // クーポン関連
      couponCode,
      couponLoading,
      couponError,
      couponSuccess,
      couponDetails,
      appliedCoupon,
      validateAndApplyCoupon
    };
  }
}
</script>

<style scoped>
/* ... */
.coupon-section {
  background-color: #000;
  padding: 20px;
  border-radius: 8px;
  margin: 30px 0;
}

.coupon-form {
  margin-top: 15px;
}

.input-group {
  display: flex;
  margin-bottom: 15px;
}

.already-cancelled {
  margin-top: 1.5rem;
  background-color: #e2e3e5;
  padding: 1rem;
  border-radius: 5px;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  padding: 0.5rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.btn {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  cursor: pointer;
}

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-danger {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
