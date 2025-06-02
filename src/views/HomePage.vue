<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('appName') }}</h1>
        <p class="hero-tagline">{{ $t('tagline') }}</p>
        <div class="hero-actions">
          <router-link :to="{ name: 'search' }" class="btn btn-primary">
            {{ $t('getStarted') }}
          </router-link>
          <button @click="scrollToHowItWorks" class="btn btn-secondary">
            {{ $t('howItWorks') }}
          </button>
        </div>
      </div>
    </section>
    
    <section ref="howItWorksSection" class="how-it-works">
      <h2 class="section-title">{{ $t('howItWorks') }}</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3 class="step-title">検索して無駄を省く</h3>
          <p class="step-description">動画IDを検索して、ヌけないと評価された動画を事前に確認できます。</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3 class="step-title">レビューを投稿してポイントゲット</h3>
          <p class="step-description">ヌけなかった動画のレビューを投稿すると、ポイントが貯まります。</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3 class="step-title">プレミアム会員でもっと詳しく</h3>
          <p class="step-description">プレミアム会員になると、全ての情報にアクセスでき、貯めたポイントで月額料金の割引も可能です。</p>
        </div>
      </div>
    </section>
    
    <section class="latest-reviews">
      <h2 class="section-title">最新のレビュー</h2>
      <div v-if="reviewsStore.loading" class="loading">
        <p>読み込み中...</p>
      </div>
      <div v-else-if="reviewsStore.error" class="error">
        <p>エラーが発生しました: {{ reviewsStore.error }}</p>
      </div>
      <div v-else-if="latestReviews.length === 0" class="no-reviews">
        <p>まだレビューがありません。最初のレビューを投稿しましょう！</p>
      </div>
      <div v-else class="reviews-grid">
        <ReviewCard 
          v-for="review in latestReviews" 
          :key="review.id" 
          :review="review" 
          :categories="categories"
        />
      </div>
      
      <div class="view-more">
        <router-link :to="{ name: 'search' }" class="btn btn-outline">
          もっと見る
        </router-link>
      </div>
    </section>
    
    <section class="premium-cta">
      <div class="premium-content">
        <h2 class="premium-title">プレミアム会員になる</h2>
        <p class="premium-description">
          月額1,000円でより詳細な情報にアクセスでき、無駄な時間と出費を大幅に削減できます。
        </p>
        <router-link :to="{ name: 'subscription' }" class="btn btn-primary">
          {{ $t('upgradeNow') }}
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReviewsStore } from '../stores/reviews'
import ReviewCard from '../components/reviews/ReviewCard.vue'

const reviewsStore = useReviewsStore()
const howItWorksSection = ref(null)
const latestReviews = ref([])
const categories = ref([])

function scrollToHowItWorks() {
  howItWorksSection.value.scrollIntoView({ behavior: 'smooth' })
}

onMounted(async () => {
  try {
    // Get reason categories
    categories.value = await reviewsStore.getReasonCategories()
    
    // Get latest reviews
    latestReviews.value = await reviewsStore.getLatestReviews(6)
  } catch (error) {
    console.error('Error loading homepage data:', error)
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  padding: 4rem 1rem;
  background-color: #7E57C2;
  color: white;
  border-radius: 0.5rem;
  margin-bottom: 3rem;
  text-align: center;
  
  @media (min-width: 768px) {
    padding: 6rem 2rem;
    text-align: left;
  }
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
}

.hero-tagline {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
}

.hero-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 576px) {
    flex-direction: row;
  }
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.how-it-works {
  padding: 3rem 1rem;
  margin-bottom: 3rem;
}

.steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.step {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: #7E57C2;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50%;
  margin: 0 auto 1rem;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.latest-reviews {
  padding: 3rem 1rem;
  margin-bottom: 3rem;
}

.reviews-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.view-more {
  margin-top: 2rem;
  text-align: center;
}

.premium-cta {
  padding: 4rem 1rem;
  background-color: #F44336;
  color: white;
  border-radius: 0.5rem;
  margin-bottom: 3rem;
  text-align: center;
}

.premium-content {
  max-width: 800px;
  margin: 0 auto;
}

.premium-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.premium-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.loading, .error, .no-reviews {
  text-align: center;
  padding: 2rem;
}

// Button styles
.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 0.375rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.btn-primary {
  background-color: #F44336;
  color: white;
  border: none;
  
  &:hover {
    background-color: darken(#F44336, 10%);
  }
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid white;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}

.btn-outline {
  background-color: transparent;
  color: #7E57C2;
  border: 1px solid #7E57C2;
  
  &:hover {
    background-color: #7E57C2;
    color: white;
  }
}
</style>