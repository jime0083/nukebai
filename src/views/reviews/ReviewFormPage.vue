<template>
  <div class="review-form-page">
    <div class="form-container">
      <h1>レビューを投稿</h1>
      
      <form @submit.prevent="handleSubmit" class="review-form">
        <div class="form-group">
          <label for="videoId">{{ $t('videoId') }}</label>
          <input
            type="text"
            id="videoId"
            v-model="formData.videoId"
            required
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="videoTitle">{{ $t('videoTitle') }}</label>
          <input
            type="text"
            id="videoTitle"
            v-model="formData.videoTitle"
            required
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label>{{ $t('reviewReasons') }}</label>
          <div class="reasons-grid">
            <div 
              v-for="category in categories"
              :key="category.code"
              class="reason-checkbox"
            >
              <label class="checkbox-container">
                <input 
                  type="checkbox"
                  v-model="formData.reasons"
                  :value="category.code"
                >
                <span class="checkmark"></span>
                <span class="label-text">{{ category.displayName }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="image">画像（任意）</label>
          <input
            type="file"
            id="image"
            @change="handleImageChange"
            accept="image/*"
            class="form-input"
          />
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading || !isValid">
            {{ loading ? '投稿中...' : $t('submitReview') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReviewsStore } from '../../stores/reviews'

const router = useRouter()
const reviewsStore = useReviewsStore()

const formData = ref({
  videoId: '',
  videoTitle: '',
  reasons: [],
})
const imageFile = ref(null)
const loading = ref(false)
const categories = ref([])

const isValid = computed(() => {
  return formData.value.videoId.trim() &&
         formData.value.videoTitle.trim() &&
         formData.value.reasons.length > 0
})

function handleImageChange(event) {
  const file = event.target.files[0]
  if (file && file.type.startsWith('image/')) {
    imageFile.value = file
  }
}

async function handleSubmit() {
  if (!isValid.value) return
  
  try {
    loading.value = true
    
    await reviewsStore.createReview(formData.value, imageFile.value)
    router.push({ name: 'search' })
  } catch (error) {
    console.error('Review submission error:', error)
    // Here you would typically show an error message to the user
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    categories.value = await reviewsStore.getReasonCategories()
  } catch (error) {
    console.error('Error loading categories:', error)
  }
})
</script>

<style lang="scss" scoped>
.review-form-page {
  padding: 2rem 1rem;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    text-align: center;
  }
}

.review-form {
  .form-group {
    margin-bottom: 1.5rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
  }
}

.reasons-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
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
  margin-top: 2rem;
  
  .btn {
    width: 100%;
  }
}
</style>