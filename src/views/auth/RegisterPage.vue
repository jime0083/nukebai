<template>
  <div class="register-page">
    <div class="auth-container">
      <h1>{{ $t('register') }}</h1>
      
      <form @submit.prevent="handleRegister" class="auth-form">
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
        
        <div class="form-group">
          <label for="confirmPassword">{{ $t('confirmPassword') }}</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label class="checkbox-container">
            <input type="checkbox" v-model="agreeToTerms" required>
            <span class="checkmark"></span>
            <span class="label-text">{{ $t('ageVerification') }}</span>
          </label>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading || !agreeToTerms">
            {{ $t('register') }}
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
        <router-link :to="{ name: 'login' }">
          すでにアカウントをお持ちの方はこちら
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeToTerms = ref(false)
const loading = ref(false)

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    // Here you would typically show an error message to the user
    console.error('Passwords do not match')
    return
  }
  
  try {
    loading.value = true
    await authStore.registerWithEmail(email.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Registration error:', error)
    // Here you would typically show an error message to the user
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  try {
    loading.value = true
    await authStore.loginWithGoogle()
    router.push('/')
  } catch (error) {
    console.error('Google login error:', error)
    // Here you would typically show an error message to the user
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-page {
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

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  user-select: none;
  
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 24px;
    width: 24px;
    background-color: #eee;
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  
  &:hover input ~ .checkmark {
    background-color: #ccc;
  }
  
  input:checked ~ .checkmark {
    background-color: #7E57C2;
  }
  
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  
  input:checked ~ .checkmark:after {
    display: block;
  }
  
  .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
  
  .label-text {
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