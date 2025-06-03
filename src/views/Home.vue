<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1>ヌけないアダルト動画レビュー</h1>
          <p class="hero-subtitle">
            ヌけないアダルト動画を見て無駄にするお金と時間をゼロにする
          </p>
          
          
        </div>
      </div>
    </section>
    
    <div class="container">
      <div v-if="showUpgradePrompt" class="upgrade-prompt">
        <div class="upgrade-message">
          <h3>無料枠が残り少なくなっています</h3>
          <p>プレミアム会員になって全ての機能を利用しましょう。</p>
          <router-link to="/subscription" class="primary">プレミアムに登録</router-link>
        </div>
      </div>
      
      <section class="reviews-section">
        <h2 v-if="searchResults.length > 0">検索結果</h2>
        <h2 v-else>最新レビュー</h2>
        
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>読み込み中...</p>
        </div>
        
        <div v-else-if="searchError" class="error-message">
          {{ searchError }}
        </div>
        
        <div v-else-if="searchResults.length > 0" class="reviews-grid">
          <ReviewCard 
            v-for="review in searchResults" 
            :key="review.id" 
            :review="review"
            @click="incrementUsage"
          />
        </div>
        
        <div v-else-if="reviews.length > 0" class="reviews-grid">
          <ReviewCard 
            v-for="review in reviews" 
            :key="review.id" 
            :review="review"
            @click="incrementUsage"
          />
        </div>
        
        <div v-else class="empty-state">
          <p>レビューがまだありません。</p>
          <router-link v-if="userStore.user" to="/submit-review" class="primary">
            最初のレビューを投稿する
          </router-link>
          <router-link v-else to="/login" class="primary">
            ログインしてレビューを投稿
          </router-link>
        </div>
      </section>
      
      <section class="features-section">
        <h2>サービスの特徴</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>ユーザーレビュー</h3>
            <p>実際に視聴したユーザーによる正直なレビューで、ヌけない動画を事前に回避できます。</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>詳細な理由カテゴリ</h3>
            <p>なぜヌけないのか、具体的な理由がカテゴリ別に分類されています。</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>ポイント獲得</h3>
            <p>レビューを投稿すると20-30ポイントが獲得でき、サブスクリプション料金に充当できます。</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3>プレミアム特典</h3>
            <p>プレミアム会員になると、全ての情報にアクセスでき、より詳細なレビュー情報が閲覧可能です。</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useReviewsStore } from '../stores/reviews'
import { useUserStore } from '../stores/user'
import ReviewCard from '../components/reviews/ReviewCard.vue'

const reviewsStore = useReviewsStore()
const userStore = useUserStore()

const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const searchError = ref(null)

onMounted(async () => {
  await reviewsStore.fetchReviews()
})

const reviews = computed(() => {
  return reviewsStore.reviews
})

const loading = computed(() => {
  return reviewsStore.loading
})

const showUpgradePrompt = computed(() => {
  return userStore.user && userStore.subscriptionStatus === 'free' && userStore.freeUsageCount >= 2
})

function incrementUsage() {
  if (userStore.user && userStore.subscriptionStatus === 'free') {
    userStore.incrementFreeUsage()
  }
}

async function searchVideo() {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  searchError.value = null
  
  try {
    // In a real app, this would query the database
    // For demo purposes, we'll filter the existing reviews
    searchResults.value = reviews.value.filter(review => 
      review.videoId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      review.videoTitle.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    
    incrementUsage()
  } catch (err) {
    console.error('Search error:', err)
    searchError.value = '検索中にエラーが発生しました。'
  } finally {
    isSearching.value = false
  }
}
</script>

<style scoped>
.hero-section {
  background-color: var(--color-surface);
  padding: var(--space-xxl) 0;
  margin-bottom: var(--space-xxl);
  position: relative;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
  color: var(--color-primary);
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: var(--space-xl);
  color: var(--color-on-surface-variant);
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-form {
  display: flex;
  margin-bottom: var(--space-md);
}

.search-form input {
  flex: 1;
  padding: 12px var(--space-md);
  border-radius: var(--border-radius-sm) 0 0 var(--border-radius-sm);
  border: 2px solid var(--color-surface-variant);
  border-right: none;
  background-color: var(--color-surface-variant);
  color: var(--color-on-surface);
  font-size: 1rem;
}

.search-button {
  padding: 12px var(--space-lg);
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
  cursor: pointer;
  transition: background-color var(--transition-duration) ease;
}

.search-button:hover {
  background-color: var(--color-primary-hover);
}

.usage-counter {
  text-align: right;
  font-size: 0.9rem;
  color: var(--color-on-surface-variant);
}

.upgrade-prompt {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--space-xl);
  overflow: hidden;
  position: relative;
}

.upgrade-message {
  padding: var(--space-lg);
  text-align: center;
}

.upgrade-message h3 {
  color: var(--color-primary);
  margin-bottom: var(--space-sm);
}

.upgrade-message p {
  margin-bottom: var(--space-md);
}

.reviews-section {
  margin-bottom: var(--space-xxl);
}

h2 {
  margin-bottom: var(--space-xl);
  position: relative;
  display: inline-block;
}

h2:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--color-primary);
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.error-message {
  padding: var(--space-lg);
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: var(--border-radius-md);
  color: var(--color-error);
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: var(--space-xxl) 0;
}

.empty-state p {
  margin-bottom: var(--space-lg);
  color: var(--color-on-surface-variant);
}

.features-section {
  margin-bottom: var(--space-xxl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-lg);
}

.feature-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--space-lg);
  text-align: center;
  transition: transform var(--transition-duration) ease,
              box-shadow var(--transition-duration) ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
}

.feature-card h3 {
  margin-bottom: var(--space-md);
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .hero-section {
    padding: var(--space-xl) 0;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .reviews-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>