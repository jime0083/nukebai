<template>
  <div class="review-detail-page">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>読み込み中...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="review" class="review-container">
      <h1>{{ review.videoTitle }}</h1>
      
      <div class="review-meta">
        <p class="video-id">動画ID: {{ review.videoId }}</p>
        <p class="post-date">投稿日: {{ formatDate(review.createdAt) }}</p>
      </div>
      
      <div class="review-content">
        <div class="reasons-section">
          <h2>ヌけない理由:</h2>
          <ul class="reason-tags">
            <li v-for="reasonCode in review.reasons" :key="reasonCode" class="reason-tag">
              {{ getReasonName(reasonCode) }}
            </li>
          </ul>
        </div>
        
        <div v-if="showImage && review.imageUrl" class="review-image">
          <img :src="review.imageUrl" alt="Review thumbnail" />
        </div>
      </div>
    </div>
    
    <div v-else class="not-found">
      <p>レビューが見つかりませんでした。</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useReviewsStore } from '../../stores/reviews'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const reviewsStore = useReviewsStore()
const authStore = useAuthStore()

const review = ref(null)
const loading = ref(true)
const error = ref(null)
const categories = ref([])

const showImage = computed(() => {
  return authStore.isPremium && review.value?.imageUrl
})

function getReasonName(reasonCode) {
  const category = categories.value.find(cat => cat.code === reasonCode)
  return category ? category.displayName : reasonCode
}

function formatDate(date) {
  if (!date) return ''
  
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).format(date)
}

onMounted(async () => {
  try {
    // Load categories first
    categories.value = await reviewsStore.getReasonCategories()
    
    // Then load the review
    review.value = await reviewsStore.getReviewById(route.params.id)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
.review-detail-page {
  padding: 2rem 1rem;
}

.review-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }
}

.review-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: #666;
}

.review-content {
  .reasons-section {
    margin-bottom: 2rem;
    
    h2 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
  }
}

.reason-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.reason-tag {
  background-color: #f3e5f5;
  color: #7E57C2;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.review-image {
  margin-top: 2rem;
  border-radius: 0.5rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.loading, .error, .not-found {
  text-align: center;
  padding: 3rem 0;
}

.loading {
  .spinner {
    margin-bottom: 1rem;
  }
}

.error {
  color: var(--color-error);
}
</style>