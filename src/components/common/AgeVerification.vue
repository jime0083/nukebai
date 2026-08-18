<script setup>
import { ref } from 'vue'

const emit = defineEmits(['verified'])
const error = ref('')
const isChecked = ref(false)

function verifyAge() {
  if (!isChecked.value) {
    error.value = '年齢確認にチェックを入れてください。'
    return
  }
  
  emit('verified')
}
</script>

<template>
  <div class="age-verification-overlay">
    <div class="age-verification-modal">
      <div class="age-verification-content">
        <h2>年齢確認</h2>
        <p>このサイトはアダルトコンテンツを含みます。</p>
        <p>あなたは18歳以上ですか？</p>
        
        <div class="form-group">
          <label class="checkbox-container">
            <input type="checkbox" v-model="isChecked">
            <span class="checkmark"></span>
            私は18歳以上であることを確認します
          </label>
        </div>
        
        <p v-if="error" class="text-error">{{ error }}</p>
        
        <div class="button-container">
          <button class="primary" @click="verifyAge">続ける</button>
          <a href="https://www.google.com" class="back-button">退出する</a>
        </div>
        
        <div class="disclaimer">
          <p class="text-small">
            当サイトへのアクセスは、利用規約およびプライバシーポリシーに同意したものとみなされます。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.age-verification-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
}

.age-verification-modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
}

.age-verification-content {
  padding: var(--space-xl);
}

h2 {
  color: var(--color-primary);
  font-size: 1.75rem;
  margin-bottom: var(--space-lg);
  text-align: center;
}

p {
  margin-bottom: var(--space-md);
  line-height: 1.6;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  margin: var(--space-lg) 0;
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

.button-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

button {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
}

.back-button {
  display: block;
  text-align: center;
  padding: var(--space-sm);
  color: var(--color-on-surface-variant);
}

.disclaimer {
  margin-top: var(--space-xl);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-surface-variant);
}

.text-small {
  font-size: 0.8rem;
  color: var(--color-on-surface-variant);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .age-verification-content {
    padding: var(--space-lg);
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style>