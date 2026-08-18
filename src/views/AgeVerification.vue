<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const redirect = route.query.redirect || '/'

const isChecked = ref(false)
const error = ref('')

function handleVerify() {
  if (!isChecked.value) {
    error.value = '年齢確認にチェックを入れてください。'
    return
  }
  
  localStorage.setItem('ageVerified', 'true')
  router.push(redirect)
}

function handleExit() {
  window.location.href = 'https://www.google.com'
}
</script>

<template>
  <div class="age-verification-page">
    <div class="container">
      <div class="verification-card">
        <h1>年齢確認</h1>
        
        <div class="verification-content">
          <p class="warning-text">このウェブサイトにはアダルトコンテンツが含まれています。</p>
          
          <div class="age-question">
            <p>あなたは18歳以上ですか？</p>
          </div>
          
          <div class="checkbox-container">
            <label>
              <input type="checkbox" v-model="isChecked">
              <span class="checkmark"></span>
              私は18歳以上であることを確認します
            </label>
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <div class="verification-actions">
            <button @click="handleVerify" class="primary verify-button">
              続ける
            </button>
            
            <button @click="handleExit" class="exit-button">
              退出する
            </button>
          </div>
          
          <div class="legal-note">
            <p>
              このサイトにアクセスすることにより、利用規約およびプライバシーポリシーに同意したものとみなされます。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.age-verification-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.verification-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xl);
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  animation: fadeIn 0.3s ease;
}

h1 {
  color: var(--color-primary);
  text-align: center;
  margin-bottom: var(--space-xl);
  font-size: 2rem;
}

.verification-content {
  text-align: center;
}

.warning-text {
  font-size: 1.2rem;
  margin-bottom: var(--space-lg);
}

.age-question {
  margin-bottom: var(--space-lg);
}

.age-question p {
  font-size: 1.3rem;
  font-weight: 500;
}

.checkbox-container {
  display: flex;
  justify-content: center;
  margin: var(--space-xl) 0;
}

.checkbox-container label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

.checkmark {
  height: 24px;
  width: 24px;
  background-color: var(--color-surface-variant);
  border: 2px solid var(--color-primary);
  border-radius: var(--border-radius-sm);
  margin-right: var(--space-md);
  position: relative;
  transition: all var(--transition-duration) ease;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: rgba(209, 89, 123, 0.12);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--color-primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.error-message {
  color: var(--color-error);
  margin-bottom: var(--space-lg);
}

.verification-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.verify-button, .exit-button {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
}

.exit-button {
  background-color: transparent;
  border: 1px solid var(--color-on-surface-variant);
  color: var(--color-on-surface-variant);
}

.exit-button:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.legal-note {
  font-size: 0.8rem;
  color: var(--color-on-surface-variant);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .verification-card {
    padding: var(--space-lg);
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .warning-text {
    font-size: 1.1rem;
  }
  
  .age-question p {
    font-size: 1.2rem;
  }
}
</style>