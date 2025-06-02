<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-content">
        <h2 class="modal-title">年齢確認</h2>
        <p class="modal-message">
          このサービスは18歳以上の方を対象としています。<br>
          あなたは18歳以上ですか？
        </p>
        
        <div class="age-verification">
          <label class="checkbox-container">
            <input type="checkbox" v-model="isChecked">
            <span class="checkmark"></span>
            <span class="label-text">{{ $t('ageVerification') }}</span>
          </label>
        </div>
        
        <div class="modal-actions">
          <button @click="confirm" class="btn-confirm" :disabled="!isChecked">
            確認して続ける
          </button>
          <button @click="decline" class="btn-decline">
            サイトを離れる
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isChecked = ref(false)

function confirm() {
  if (isChecked.value) {
    localStorage.setItem('age-verified', 'true')
    window.location.reload()
  }
}

function decline() {
  window.location.href = 'https://www.google.com'
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-content {
  padding: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem;
  color: #F44336;
}

.modal-message {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.age-verification {
  margin-bottom: 1.5rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
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

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #F44336;
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

.label-text {
  font-weight: 500;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 576px) {
    flex-direction: row;
    justify-content: center;
  }
}

.btn-confirm, .btn-decline {
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  
  @media (min-width: 576px) {
    width: auto;
  }
}

.btn-confirm {
  background-color: #7E57C2;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: darken(#7E57C2, 10%);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}

.btn-decline {
  background-color: transparent;
  color: #666;
  border: 1px solid #ccc;
  
  &:hover {
    background-color: #f5f5f5;
  }
}
</style>