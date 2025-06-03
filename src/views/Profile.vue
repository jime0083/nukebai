<script setup>
import { ref, onMounted, computed } from 'vue'
import { getFirebaseAuth, getFirebaseDb } from '../firebase'
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const displayName = ref('')
const email = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const newEmail = ref('')

const loading = ref(false)
const error = ref('')
const success = ref('')
const showEmailChange = ref(false)
const showPasswordChange = ref(false)

const userPoints = computed(() => {
  return userStore.points || 0
})

const subscriptionStatus = computed(() => {
  return userStore.subscriptionStatus === 'premium' ? 'プレミアム会員' : '無料会員'
})

onMounted(async () => {
  if (!userStore.user) return
  
  loading.value = true
  
  try {
    const db = getFirebaseDb()
    const userDoc = await getDoc(doc(db, 'users', userStore.user.uid))
    
    if (userDoc.exists()) {
      const userData = userDoc.data()
      displayName.value = userData.displayName || userStore.user.displayName
      email.value = userData.email || userStore.user.email
    }
  } catch (err) {
    console.error('Error fetching user data:', err)
    error.value = 'ユーザー情報の取得中にエラーが発生しました。'
  } finally {
    loading.value = false
  }
})

async function updateProfile() {
  if (!userStore.user) return
  
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const db = getFirebaseDb()
    await updateDoc(doc(db, 'users', userStore.user.uid), {
      displayName: displayName.value
    })
    
    success.value = 'プロフィールが更新されました。'
  } catch (err) {
    console.error('Error updating profile:', err)
    error.value = 'プロフィールの更新中にエラーが発生しました。'
  } finally {
    loading.value = false
  }
}

async function changeEmail() {
  if (!userStore.user || !currentPassword.value || !newEmail.value) {
    error.value = '現在のパスワードと新しいメールアドレスを入力してください。'
    return
  }
  
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const auth = getFirebaseAuth()
    const user = auth.currentUser
    
    // Re-authenticate
    const credential = EmailAuthProvider.credential(user.email, currentPassword.value)
    await reauthenticateWithCredential(user, credential)
    
    // Update email
    await updateEmail(user, newEmail.value)
    
    // Update in Firestore
    const db = getFirebaseDb()
    await updateDoc(doc(db, 'users', user.uid), {
      email: newEmail.value
    })
    
    email.value = newEmail.value
    newEmail.value = ''
    currentPassword.value = ''
    showEmailChange.value = false
    success.value = 'メールアドレスが更新されました。'
  } catch (err) {
    console.error('Error changing email:', err)
    error.value = getAuthErrorMessage(err.code)
  } finally {
    loading.value = false
  }
}

async function changePassword() {
  if (!userStore.user || !currentPassword.value || !newPassword.value || !confirmPassword.value) {
    error.value = '全ての項目を入力してください。'
    return
  }
  
  if (newPassword.value !== confirmPassword.value) {
    error.value = '新しいパスワードが一致しません。'
    return
  }
  
  if (newPassword.value.length < 6) {
    error.value = '新しいパスワードは6文字以上にしてください。'
    return
  }
  
  loading.value = true
  error.value = ''
  success.value = ''
  
  try {
    const auth = getFirebaseAuth()
    const user = auth.currentUser
    
    // Re-authenticate
    const credential = EmailAuthProvider.credential(user.email, currentPassword.value)
    await reauthenticateWithCredential(user, credential)
    
    // Update password
    await updatePassword(user, newPassword.value)
    
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    showPasswordChange.value = false
    success.value = 'パスワードが更新されました。'
  } catch (err) {
    console.error('Error changing password:', err)
    error.value = getAuthErrorMessage(err.code)
  } finally {
    loading.value = false
  }
}

function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/wrong-password':
      return '現在のパスワードが間違っています。'
    case 'auth/user-not-found':
      return 'ユーザーが見つかりませんでした。'
    case 'auth/invalid-email':
      return '無効なメールアドレスです。'
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています。'
    case 'auth/requires-recent-login':
      return '再認証が必要です。一度ログアウトして再度ログインしてください。'
    default:
      return '認証エラーが発生しました。'
  }
}
</script>

<template>
  <div class="profile-page">
    <div class="container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
      
      <div v-else class="profile-container">
        <h2>マイプロフィール</h2>
        
        <div class="profile-overview">
          <div class="profile-info">
            <div class="profile-status">
              <span class="status-badge" :class="{ 'premium': subscriptionStatus === 'プレミアム会員' }">
                {{ subscriptionStatus }}
              </span>
            </div>
            
            <div class="profile-points">
              <h3>保有ポイント</h3>
              <div class="points-display">
                <span class="points-value">{{ userPoints }}</span>
                <span class="points-label">ポイント</span>
              </div>
              <p class="points-description">
                ポイントはプレミアム会員の支払いに利用できます。
                <router-link to="/subscription">詳細はこちら</router-link>
              </p>
            </div>
          </div>
        </div>
        
        <div class="profile-card">
          <h3>アカウント情報</h3>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div v-if="success" class="success-message">
            {{ success }}
          </div>
          
          <form @submit.prevent="updateProfile">
            <div class="form-group">
              <label for="displayName">表示名</label>
              <input type="text" id="displayName" v-model="displayName" />
            </div>
            
            <div class="form-group">
              <label for="email">メールアドレス</label>
              <div class="email-container">
                <input type="email" id="email" v-model="email" disabled />
                <button type="button" class="email-change-button" @click="showEmailChange = !showEmailChange">
                  変更
                </button>
              </div>
            </div>
            
            <div v-if="showEmailChange" class="email-change-form">
              <div class="form-group">
                <label for="currentPassword">現在のパスワード</label>
                <input type="password" id="currentPassword" v-model="currentPassword" />
              </div>
              
              <div class="form-group">
                <label for="newEmail">新しいメールアドレス</label>
                <input type="email" id="newEmail" v-model="newEmail" />
              </div>
              
              <div class="form-actions">
                <button type="button" class="primary" @click="changeEmail" :disabled="loading">
                  <span v-if="loading">処理中...</span>
                  <span v-else>メールアドレスを更新</span>
                </button>
                <button type="button" class="cancel-button" @click="showEmailChange = false">
                  キャンセル
                </button>
              </div>
            </div>
            
            <div class="form-group password-group">
              <label>パスワード</label>
              <button type="button" class="password-change-button" @click="showPasswordChange = !showPasswordChange">
                パスワードを変更
              </button>
            </div>
            
            <div v-if="showPasswordChange" class="password-change-form">
              <div class="form-group">
                <label for="currentPasswordForPw">現在のパスワード</label>
                <input type="password" id="currentPasswordForPw" v-model="currentPassword" />
              </div>
              
              <div class="form-group">
                <label for="newPassword">新しいパスワード</label>
                <input type="password" id="newPassword" v-model="newPassword" />
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">新しいパスワード (確認)</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" />
              </div>
              
              <div class="form-actions">
                <button type="button" class="primary" @click="changePassword" :disabled="loading">
                  <span v-if="loading">処理中...</span>
                  <span v-else>パスワードを更新</span>
                </button>
                <button type="button" class="cancel-button" @click="showPasswordChange = false">
                  キャンセル
                </button>
              </div>
            </div>
            
            <div class="form-actions" v-if="!showEmailChange && !showPasswordChange">
              <button type="submit" class="primary" :disabled="loading">
                <span v-if="loading">更新中...</span>
                <span v-else>プロフィールを更新</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: calc(100vh - 200px);
}

.profile-container {
  max-width: 800px;
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

.profile-overview {
  margin-bottom: var(--space-xl);
}

.profile-info {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.profile-status {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-md);
}

.status-badge {
  background-color: var(--color-secondary);
  color: var(--color-on-secondary);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--border-radius-sm);
  font-weight: 500;
}

.status-badge.premium {
  background-color: var(--color-accent);
  color: var(--color-on-accent);
}

.profile-points {
  text-align: center;
}

.profile-points h3 {
  margin-bottom: var(--space-md);
  color: var(--color-on-surface-variant);
}

.points-display {
  margin-bottom: var(--space-md);
}

.points-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.points-label {
  font-size: 1.2rem;
  margin-left: var(--space-sm);
}

.points-description {
  font-size: 0.9rem;
  color: var(--color-on-surface-variant);
}

.profile-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.profile-card h3 {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-surface-variant);
}

.error-message {
  background-color: rgba(211, 47, 47, 0.1);
  color: var(--color-error);
  padding: var(--space-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-lg);
}

.success-message {
  background-color: rgba(56, 142, 60, 0.1);
  color: var(--color-success);
  padding: var(--space-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-lg);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.email-container {
  display: flex;
  gap: var(--space-sm);
}

.email-container input {
  flex: 1;
}

.email-change-button, .password-change-button {
  background-color: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  padding: var(--space-xs) var(--space-md);
}

.email-change-button:hover, .password-change-button:hover {
  background-color: rgba(229, 57, 53, 0.1);
}

.password-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.email-change-form, .password-change-form {
  margin-top: var(--space-md);
  padding: var(--space-md);
  background-color: var(--color-surface-variant);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-lg);
}

.form-actions {
  display: flex;
  gap: var(--space-md);
}

.cancel-button {
  background-color: transparent;
  border: 1px solid var(--color-on-surface-variant);
  color: var(--color-on-surface-variant);
}

.cancel-button:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

@media (max-width: 768px) {
  .profile-card {
    padding: var(--space-lg);
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>