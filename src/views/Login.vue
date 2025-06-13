<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth } from '../firebase'
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const router = useRouter()
const route = useRoute()
const redirect = route.query.redirect || '/'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'メールアドレスとパスワードを入力してください。'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // auth is now directly imported
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push(redirect)
  } catch (err) {
    console.error('Login error:', err)
    error.value = getErrorMessage(err.code)
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    // auth is now directly imported
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
    router.push(redirect)
  } catch (err) {
    console.error('Google login error:', err)
    error.value = getErrorMessage(err.code)
  } finally {
    loading.value = false
  }
}

function getErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return '無効なメールアドレスです。'
    case 'auth/user-disabled':
      return 'このアカウントは無効化されています。'
    case 'auth/user-not-found':
      return 'ユーザーが見つかりません。'
    case 'auth/wrong-password':
      return 'パスワードが間違っています。'
    default:
      return 'ログイン中にエラーが発生しました。'
  }
}
</script>

<template>
  <div class="login-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-card">
          <h2>ログイン</h2>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <form @submit.prevent="handleLogin">
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
              <label for="password">パスワード</label>
              <input 
                type="password" 
                id="password" 
                v-model="password" 
                placeholder="パスワードを入力"
                required
              />
            </div>
            
            <div class="form-actions">
              <button type="submit" class="primary login-button" :disabled="loading">
                <span v-if="loading">ログイン中...</span>
                <span v-else>ログイン</span>
              </button>
            </div>
          </form>
          
          <div class="auth-separator">
            <span>または</span>
          </div>
          
          <button class="google-button" @click="handleGoogleLogin" :disabled="loading">
            <span v-if="loading">ログイン中...</span>
            <span v-else>Googleでログイン</span>
          </button>
          
          <div class="auth-footer">
            <p>アカウントをお持ちでない場合は <router-link to="/register">新規登録</router-link></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
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

.form-actions {
  margin-top: var(--space-xl);
}

.login-button {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
}

.auth-separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: var(--space-xl) 0;
}

.auth-separator::before,
.auth-separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-surface-variant);
}

.auth-separator span {
  padding: 0 var(--space-md);
  color: var(--color-on-surface-variant);
}

.google-button {
  width: 100%;
  background-color: #4285f4;
  color: white;
  border: none;
  padding: 12px;
  border-radius: var(--border-radius-sm);
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color var(--transition-duration) ease;
}

.google-button:hover {
  background-color: #357ae8;
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