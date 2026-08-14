<template>
  <div class="review-details-page">
    <div class="container">
      <div class="review-details-container">
        <div class="review-details-header">
          <router-link to="/" class="back-link">
            ← 一覧に戻る
          </router-link>
          <h2>レビュー詳細</h2>
        </div>
        
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>読み込み中...</p>
        </div>
        
        <div v-else-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div v-else-if="review" class="review-details-content">
          <ReviewCard :review="review" :showDetails="true" />
          
          <div class="premium-prompt" v-if="!userStore.user || userStore.subscriptionStatus === 'free'">
            <h3>より多くのレビューを閲覧するには</h3>
            <p>プレミアム会員になると、すべてのレビュー情報にアクセスできます。</p>
            <router-link to="/subscription" class="primary">プレミアムに登録する</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useReviewsStore } from '../stores/reviews'
import { useUserStore } from '../stores/user'
import ReviewCard from '../components/reviews/ReviewCard.vue'

const route = useRoute()
const router = useRouter()
const reviewsStore = useReviewsStore()
const userStore = useUserStore()

const review = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const reviewId = route.params.id
  if (!reviewId) {
    router.push('/')
    return
  }
  
  try {
    review.value = await reviewsStore.getReviewById(reviewId)
    
    if (!review.value) {
      error.value = 'レビューが見つかりませんでした。'
    }
  } catch (err) {
    console.error('Error fetching review:', err)
    error.value = 'レビューの取得中にエラーが発生しました。'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.review-details-page {
  min-height: calc(100vh - 200px);
}

.review-details-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl) 0;
}

.review-details-header {
  margin-bottom: var(--space-xl);
  position: relative;
}

.back-link {
  display: inline-block;
  margin-bottom: var(--space-md);
  color: var(--color-on-surface-variant);
  text-decoration: none;
  transition: color var(--transition-duration) ease;
}

.back-link:hover {
  color: var(--color-primary);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.error-message {
  background-color: rgba(211, 47, 47, 0.1);
  color: var(--color-error);
  padding: var(--space-lg);
  border-radius: var(--border-radius-md);
  text-align: center;
}

.premium-prompt {
  margin-top: var(--space-xxl);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xl);
  text-align: center;
  border: 1px solid var(--color-surface-variant);
}

.premium-prompt h3 {
  color: var(--color-primary);
  margin-bottom: var(--space-md);
}

.premium-prompt p {
  margin-bottom: var(--space-lg);
}
</style>