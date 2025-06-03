<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getFirebaseAuth, getFirebaseDb } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const displayName = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  // Validation
  if (!email.value || !password.value || !confirmPassword.value) {
    error.value = '全ての項目を入力してください。'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'パスワードが一致しません。'
    return
  }
  
  if (password.value.length < 6) {
    error.value = 'パスワードは6文字以上にしてください。'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const auth = getFirebaseAuth()
    const db = getFirebaseDb()
    
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    
    // Set display name
    const username = displayName.value || email.value.split('@')[0]
    await updateProfile(user, {
      displayName: username
    })
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: username,
      createdAt: serverTimestamp(),
      subscriptionStatus: 'free',
      points: 0,
      totalPosts: 0,
      freeUsageCount: 0,
      role: 'user',
      isUnlimited: false
    })
    
    router.push('/')
  } catch (err) {
    console.error('Registration error:', err)
    error.value = getErrorMessage(err.code)
  } finally {
    loading.value = false
  }
}

function getErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'このメールアドレスは既に使用されています。'
    case 'auth/invalid-email':
      return '無効なメールアドレスです。'
    case 'auth/operation-not-allowed':
      return 'この操作は許可されていません。'
    case 'auth/weak-password':
      return 'パスワードが弱すぎます。'
    default:
      return '登録中にエラーが発生しました。'
  }
}
</script>

<template>
  <div class="register-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-card">
          <h2>新規登録</h2>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="email">メールアドレス</label>
              <input 
                type="email" 
                id="email" 
                v-model="email" 
                placeholder="メールアドレスを入力"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="displayName">表示名 (任意)</label>
              <input 
                type="text" 
                id="displayName" 
                v-model="displayName" 
                placeholder="表示名を入力"
              />
            </div>
            
            <div class="form-group">
              <label for="password">パスワード</label>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                placeholder="パスワードを入力 (6文字以上)"
                required
                minlength="6"
              />
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">パスワード (確認)</label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="confirmPassword" 
                placeholder="パスワードを再入力"
                required
                minlength="6"
              />
            </div>
            
            <div class="age-confirmation">
              <p>
                登録することで、<a href="#">利用規約</a>および<a href="#">プライバシーポリシー</a>に同意したことになります。
              </p>
              <p>
                このサイトは18歳以上の方のみご利用いただけます。
              </p>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="primary register-button" :disabled="loading">
                <span v-if="loading">登録中...</span>
                <span v-else>登録する</span>
              </button>
            </div>
          </form>
          
          <div class="auth-footer">
            <p>既にアカウントをお持ちの場合は <router-link to="/login">ログイン</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
}

.auth-container {
  max-width: 500px;
  margin: 0 auto;
  padding: var(--space-xl) 0;
}

.auth-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

h2 {
  text-align: center;
  margin-bottom: var(--space-xl);
  color: var(--color-primary);
}

.error-message {
  background-color: rgba(211, 47, 47, 0.1);
  color: var(--color-error);
  padding: var(--space-md);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-lg);
}

.form-group {
  margin-bottom: var(--space-lg);
}

.age-confirmation {
  margin: var(--space-xl) 0;
  padding: var(--space-md);
  background-color: var(--color-surface-variant);
  border-radius: var(--border-radius-sm);
}

.age-confirmation p {
  margin-bottom: var(--space-sm);
  font-size: 0.9rem;
  color: var(--color-on-surface-variant);
}

.form-actions {
  margin-top: var(--space-xl);
}

.register-button {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
}

.auth-footer {
  margin-top: var(--space-xl);
  text-align: center;
}

.auth-footer p {
  color: var(--color-on-surface-variant);
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 500;
}

@media (max-width: 768px) {
  .auth-card {
    padding: var(--space-lg);
  }
}
</style>