<template>
  <div class="login-page">
    <div class="auth-container">
      <h1>{{ $t('login') }}</h1>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">{{ $t('email') }}</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="password">{{ $t('password') }}</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            class="form-input"
          />
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ $t('login') }}
          </button>
        </div>
        
        <div class="auth-separator">
          <span>または</span>
        </div>
        
        <button @click="handleGoogleLogin" type="button" class="btn btn-google">
          {{ $t('googleLogin') }}
        </button>
      </form>
      
      <div class="auth-links">
        <router-link :to="{ name: 'register' }">
          アカウントをお持ちでない方はこちら
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  try {
    loading.value = true
    await authStore.loginWithEmail(email.value, password.value)
    
    // Redirect to intended page or home
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (error) {
    console.error('Login error:', error)
    // Here you would typically show an error message to the user
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  try {
    loading.value = true
    await authStore.loginWithGoogle()
    
    // Redirect to intended page or home
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (error) {
    console.error('Google login error:', error)
    // Here you would typically show an error message to the user
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-container {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5rem;
    font-weight: 700;
  }
}

.auth-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
}

.form-actions {
  margin-bottom: 1.5rem;
  
  .btn {
    width: 100%;
  }
}

.auth-separator {
  position: relative;
  text-align: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: calc(50% - 1rem);
    height: 1px;
    background-color: #e0e0e0;
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
  
  span {
    background-color: white;
    padding: 0 0.5rem;
    color: #666;
    font-size: 0.875rem;
  }
}

.btn-google {
  width: 100%;
  background-color: #4285f4;
  color: white;
  border: none;
  
  &:hover {
    background-color: darken(#4285f4, 10%);
  }
}

.auth-links {
  text-align: center;
  font-size: 0.875rem;
  
  a {
    color: #7E57C2;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>