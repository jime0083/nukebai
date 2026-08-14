<template>
  <div class="review-form-container">
    <div v-if="success" class="success-message">
      <h3>レビューが投稿されました！</h3>
      <p v-if="pointsEarned">{{ pointsEarned }}ポイントを獲得しました！</p>
      <p v-else>ポイントが付与されました！</p>
      <button class="primary" @click="success = false">新しいレビューを投稿する</button>
    </div>
    
    <form v-else @submit.prevent="submitReview" class="review-form">
      <h2>ヌけなかった動画の報告</h2>
      
      <div class="form-group">
        <label for="videoId">動画ID <span class="required">*</span></label>
        <input 
          type="text" 
          id="videoId" 
          v-model="videoId" 
          placeholder="例: AAAA-123" 
          required
        />
      </div>
      
      <div class="form-group">
        <label for="videoTitle">動画タイトル <span class="required">*</span></label>
        <input 
          type="text" 
          id="videoTitle" 
          v-model="videoTitle" 
          placeholder="動画のタイトルを入力" 
          required
        />
      </div>
      
      <div class="form-group">
        <label>ヌけない理由 <span class="required">*</span></label>
        
        <div class="reasons-selection">
          <div v-for="category in allReasonsByCategory" :key="category.id" class="reason-category">
            <h4>{{ category.name }}</h4>
            
            <div class="reason-options">
              <div v-for="reason in category.reasons" :key="reason.code" class="reason-option">
                <label class="checkbox-container">
                  <input 
                    type="checkbox" 
                    :value="reason.code" 
                    v-model="selectedReasons"
                  />
                  <span class="checkmark"></span>
                  {{ reason.displayName }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div class="form-actions">
        <button type="submit" class="primary" :disabled="submitting">
          <span v-if="submitting">報告中...</span>
          <span v-else>報告</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useReasonsStore } from '../../stores/reasons'
import { useReviewsStore } from '../../stores/reviews'
import { useUserStore } from '../../stores/user'


const emit = defineEmits(['submitted'])
const reasonsStore = useReasonsStore()
const reviewsStore = useReviewsStore()
const userStore = useUserStore()

const videoId = ref('')
const videoTitle = ref('')
const selectedReasons = ref([])

const submitting = ref(false)
const error = ref('')
const success = ref(false)
const pointsEarned = ref(0)

const allReasonsByCategory = computed(() => {
  return reasonsStore.reasonCategories
})

function resetForm() {
  videoId.value = ''
  videoTitle.value = ''
  selectedReasons.value = []

  error.value = ''
}

async function submitReview() {
  // Validation
  if (!videoId.value.trim()) {
    error.value = '動画IDを入力してください。'
    return
  }
  
  if (!videoTitle.value.trim()) {
    error.value = '動画タイトルを入力してください。'
    return
  }
  
  if (selectedReasons.value.length === 0) {
    error.value = '少なくとも1つの理由を選択してください。'
    return
  }
  
  submitting.value = true
  error.value = ''
  
  try {
    const reviewData = {
      videoId: videoId.value,
      videoTitle: videoTitle.value,
      reasons: selectedReasons.value,
    }
    
    const result = await reviewsStore.submitReview(reviewData)
    if (result && result.success) {
      success.value = true
      pointsEarned.value = 0
      resetForm()
      emit('submitted')
      // サーバー(トリガー)が付与したポイントを待って表示に反映(取得できなければ
      // 固定メッセージのまま)
      const awarded = await reviewsStore.waitForAwardedPoints(result.postId)
      if (awarded) {
        pointsEarned.value = awarded
        userStore.updatePoints((userStore.points || 0) + awarded)
      }
    } else {
      error.value = reviewsStore.error || 'レビューの投稿に失敗しました。'
    }
  } catch (err) {
    console.error('Error submitting review:', err)
    error.value = '予期せぬエラーが発生しました。'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.review-form-container {
  max-width: 800px;
  margin: 0 auto;
}

.review-form {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xl);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

h2 {
  margin-bottom: var(--space-xl);
  text-align: center;
  color: var(--color-primary);
}

.form-group {
  margin-bottom: var(--space-lg);
}

label {
  display: block;
  margin-bottom: var(--space-sm);
  font-weight: 500;
}

.required {
  color: var(--color-primary);
}

.reasons-selection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.reason-category {
  margin-bottom: var(--space-lg);
}

.reason-category h4 {
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 1px solid var(--color-surface-variant);
}

.reason-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.checkbox-container {
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
  height: 20px;
  width: 20px;
  background-color: var(--color-surface-variant);
  border: 2px solid var(--color-on-surface-variant);
  border-radius: var(--border-radius-sm);
  margin-right: var(--space-md);
  position: relative;
  transition: all var(--transition-duration) ease;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: rgba(229, 57, 53, 0.1);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
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
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.file-upload {
  margin-bottom: var(--space-md);
}

.file-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

.file-label {
  cursor: pointer;
  display: inline-block;
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-secondary);
  color: var(--color-on-secondary);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--transition-duration) ease;
}

.file-label:hover {
  background-color: var(--color-secondary-hover);
}

.image-preview {
  margin-top: var(--space-md);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  max-width: 300px;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.error-message {
  color: var(--color-error);
  margin-bottom: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: var(--border-radius-sm);
}

.form-actions {
  margin-top: var(--space-xl);
  display: flex;
  justify-content: center;
}

.form-actions button {
  min-width: 200px;
}

.success-message {
  background-color: rgba(56, 142, 60, 0.1);
  padding: var(--space-xl);
  border-radius: var(--border-radius-lg);
  text-align: center;
}

.success-message h3 {
  color: var(--color-success);
  margin-bottom: var(--space-md);
}

.success-message p {
  font-size: 1.2rem;
  margin-bottom: var(--space-lg);
}

@media (max-width: 768px) {
  .review-form {
    padding: var(--space-lg);
  }
  
  .reasons-selection {
    grid-template-columns: 1fr;
  }
}
</style>