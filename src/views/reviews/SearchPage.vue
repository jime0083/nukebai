<template>
  <div class="search-page">
    <div class="search-container">
      <h1>動画を検索</h1>
      
      <div class="search-form">
        <div class="form-group">
          <label for="videoId">{{ $t('videoId') }}</label>
          <input
            type="text"
            id="videoId"
            v-model="searchQuery"
            placeholder="動画IDを入力"
            class="form-input"
          />
        </div>
        
        <button @click="handleSearch" class="btn btn-primary" :disabled="loading">
          {{ loading ? '検索中...' : '検索' }}
        </button>
      </div>
      
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>検索中...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="reviews.length > 0" class="search-results">
        <h2>検索結果</h2>
        <div class="reviews-grid">
          <ReviewCard 
            v-for="review in reviews" 
            :key="review.id" 
            :review="review"
            :categories="categories"
          />
        </div>
      </div>
      
      <div v-else-if="hasSearched" class="no-results">
        <p>該当する動画が見つかりませんでした。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReviewsStore } from '../../stores/reviews'
import ReviewCard from '../../components/reviews/ReviewCard.vue'

const reviewsStore = useReviewsStore()

const searchQuery = ref('')
const loading = ref(false)
const error = ref(null)
const hasSearched = ref(false)
const reviews = ref([])
const categories = ref([])

async function handleSearch() {
  if (!searchQuery.value.trim()) return
  
  try {
    loading.value = true
    error.value = null
    hasSearched.value = true
    
    reviews.value = await reviewsStore.searchReviewsByVideoId(searchQuery.value.trim())
  } catch (err) {
    error.value = err.message
    reviews.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    categories.value = await reviewsStore.getReasonCategories()
  } catch (err) {
    console.error('Error loading categories:', err)
  }
})
</script>

<style lang="scss" scoped>
.search-page {
  padding: 2rem 1rem;
}

.search-container {
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    text-align: center;
  }
}

.search-form {
  max-width: 600px;
  margin: 0 auto 3rem;
  display: flex;
  gap: 1rem;
  
  .form-group {
    flex: 1;
  }
}

.loading {
  text-align: center;
  padding: 3rem 0;
  
  .spinner {
    margin-bottom: 1rem;
  }
}

.error {
  text-align: center;
  color: var(--color-error);
  padding: 2rem 0;
}

.search-results {
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.no-results {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}
</style>