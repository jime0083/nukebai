<template>
  <div class="home-page">
    <section class="hero-section top-page-top">
      <div class="container">
        <div class="hero-content">
          <h1 class="main-catchphrase">あなたは今まで<br><span class="highlight-red">ヌけないアダルト動画</span>に<br>どれだけの<span class="highlight-red">時間</span>と<span class="highlight-red">お金</span>を費やしましたか?</h1>
          
          
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
      
      <section class="about-nukebai-section">
        <div class="about-nukebai-content-wrapper">
          <div class="about-content-left">
            <h2 class="section-title">ヌケバイってなに？</h2>
            <div class="about-text-column increased-spacing">
              <p class="normal-text">週3回オナニーする人は、毎週平均2.7本ヌけない動画を見て<br><br><span class="highlight-red large-text bold-text animate-bg" ref="wasteText">2,700円と2.25時間をムダ</span><span class="normal-text">にしています。</span></p>
              <p class="normal-text">ヌケバイは、その時間とお金のムダをなくすサービスです。</p>
            </div>
          </div>
          <div class="about-content-right">
            <img :src="negMan4" alt="説明画像1" class="image-1">
          </div>
        </div>
      </section>


            <!-- プレリリースバナー -->
            <!-- <div class="campaign-banner">
        <div class="container">
          <div class="campaign-title-container">
            <h2 class="title-large">ヌケバイ</h2>
            <div class="title-right-container">
              <p class="title-small">プレリリース記念！</p>
              <h3 class="title-medium">キャンペーン</h3>
            </div>
          </div>
          <div class="campaign-content-wrapper">
            <div class="campaign-timer">
              <div class="campaign-period-box-bordered">
                <span class="campaign-period-text">キャンペーン期間</span>
              </div>
              <div class="campaign-date-row">
                <p class="campaign-date">
                  <span class="all-white">2025年</span><span class="large-number">6</span><span class="all-white">月</span><span class="large-number">19</span><span class="all-white">日 ～ </span><span class="large-number">7</span><span class="all-white">月</span><span class="large-number">31</span><span class="all-white">日</span>
                </p>
              </div>
              <router-link :to="{path: '/prerelease', hash: '#top'}" class="campaign-detail-button">
                プレリリース詳細をチェック
              </router-link>
            </div>
            <div class="discount-display">
              <span class="discount-before">1000</span>
              <span class="discount-before"></span>
              <span class="discount-after">500</span>
              <span class="discount-currency">円</span>
            </div>
          </div>
        </div>
      </div> -->

      <!-- キャンペーンバナー -->
      <!-- <div class="campaign-banner">
        <div class="container">
          <div class="campaign-title-container">
            <h2 class="title-large">三大特典</h2>
            <div class="title-right-container">
              <p class="title-small">ヌケバイリリース記念！</p>
              <h3 class="title-medium">キャンペーン</h3>
            </div>
          </div>
          <div class="campaign-content-wrapper">
            <div class="campaign-timer">
              <div class="campaign-period-box-bordered">
                <span class="campaign-period-text">キャンペーン期間</span>
              </div>
              <div class="campaign-date-row">
                <p class="campaign-date">
                  <span class="all-white">2025年</span><span class="large-number">6</span><span class="all-white">月</span><span class="large-number">15</span><span class="all-white">日 ～ </span><span class="large-number">6</span><span class="all-white">月</span><span class="large-number">30</span><span class="all-white">日</span>
                </p>
              </div>
              <router-link :to="{path: '/campaign', hash: '#top'}" class="campaign-detail-button">
                キャンペーンページ詳細をチェック
              </router-link>
            </div>
            <div class="discount-display">
              <span class="discount-before">1000</span>
              <span class="discount-before"></span>
              <span class="discount-after">500</span>
              <span class="discount-currency">円</span>
            </div>
          </div>
        </div>
      </div> -->




      <!-- 使い方セクション -->
      <section class="how-to-use-section">
        <h2 class="section-title">ヌケバイの使い方</h2>
        <div class="how-to-use-grid">
          <div class="how-to-use-card">
            <img :src="howToImage1" alt="使い方1：動画を検索">
            <h3>ステップ1：動画を検索</h3>
            <p>アダルト動画を見る前に気になる動画を検索しましょう<br>今なら最大3回まで無料で使えます！</p>
          </div>
          <div class="how-to-use-card">
            <img :src="howToImage2" alt="使い方2：レビューを投稿">
            <h3>ステップ2：レビューを投稿</h3>
            <p>検索ページの検索ボックスに動画IDを入力してください</p>
            <p class="disclaimer-text text-left">※未ログインの場合は見られる情報に一部制限がかかります</p>
          </div>
          <div class="how-to-use-card">
            <img :src="howToImage3" alt="使い方3：賢く視聴">
            <h3>ステップ3：賢く視聴</h3>
            <p>これまでその動画で「ヌけなかった」人の情報を基に本当に楽しめる作品だけを選んで視聴。貴重な時間とお金の浪費を防ぎます。</p>
          </div>
        </div>
      </section>
    </div>
    <section class="hero-section top-page-top2">
        <div class="container">
          <div class="hero-content">
            <h1 class="main-catchphrase">ヌけないアダルト動画を見たら<br><span class="highlight-red">ポイントに変換！</span></h1>
          </div>
        </div>
    </section>

    <div class="container">
      <section class="how-to-use-section">
        <h2 class="section-title">ヌけなかった動画を報告してポイント獲得！</h2>
        <div class="how-to-use-grid">
          <div class="how-to-use-card">
            <img :src="reportImage1" alt="使い方1：動画を検索">
            <h3>ステップ1：ヌけない動画を見たら...</h3>
            <p>ヌけない動画を見たら、右上の「報告」をクリックしヌけない動画の情報をポイントに変換しましょう</p>
          </div>
          <div class="how-to-use-card">
            <img :src="reportImage2" alt="使い方2：レビューを投稿">
            <h3>ステップ2：ヌけない動画を報告</h3>
            <p>ヌけなかった動画のIDと共になぜヌけなかったのか理由を選択して「報告」ボタンをクリック！</p>
          </div>
          <div class="how-to-use-card">
            <img :src="reportImage3" alt="使い方3：賢く視聴">
            <h3>ステップ3：ポイント獲得</h3>
            <p>報告後すぐにポイントが付与されます。このポイントを利用すれば翌月のサブスク利用料を割引できます</p>
            <p>※ポイント利用機能は近日実装予定</p>
          </div>
        </div>
      </section>
    </div>
    <div class="fixed-bottom-cta-container">
      <!-- 無料で使ってみるボタン -->
      <router-link 
        to="/login" 
        class="fixed-bottom-try-free-button"
      >
        無料で使ってみる
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from 'vue'
import { useReviewsStore } from '../stores/reviews'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import ReviewCard from '../components/reviews/ReviewCard.vue'
import negMan4 from '../assets/images/neg-man4.png';
import howToImage1 from '../assets/images/use1.png';
import howToImage2 from '../assets/images/use2.png';
import howToImage3 from '../assets/images/use3.jpg';
import reportImage1 from '../assets/images/use4.png';
import reportImage2 from '../assets/images/use5.png';
import reportImage3 from '../assets/images/use6.png';


const reviewsStore = useReviewsStore()
const userStore = useUserStore()

const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const searchError = ref(null)

// References for the animated elements
const wasteText = ref(null)
const priceText = ref(null)

onMounted(async () => {
  await reviewsStore.fetchReviews()
  
  // Setup intersection observer after DOM is updated
  nextTick(() => {
    setupAnimationObserver()
  })
})

// Setup intersection observer for animations
function setupAnimationObserver() {
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-bg-active')
      }
    })
  }, options)
  
  // Observe the elements with animation
  if (wasteText.value) observer.observe(wasteText.value)
  if (priceText.value) observer.observe(priceText.value)
}

const reviews = computed(() => {
  return reviewsStore.reviews
})

const loading = computed(() => {
  return reviewsStore.loading
})

const showUpgradePrompt = computed(() => {
  return userStore.user && userStore.subscriptionStatus === 'free' && userStore.freeUsageCount >= 2
})

// プレリリース期間中は常に表示する
// const shouldShowBottomCta = computed(() => {
//   // 課金ユーザーや管理者の場合は表示しない
//   return !userStore.isPaidUser && !userStore.isAdmin
// })

function incrementUsage() {
  if (userStore.user && userStore.subscriptionStatus === 'free') {
    userStore.incrementFreeUsage()
  }
}

// 匿名ユーザーの使用回数をインクリメントする関数
function incrementAnonymousUsage() {
  // 匿名ユーザーの場合のみ実行
  if (!userStore.isLoggedIn) {
    userStore.incrementAnonymousSearchCount()
    console.log('匿名ユーザーの使用回数をインクリメントしました:', userStore.anonymousSearchCount)
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
  background-image: url('../assets/images/neg-man9.png');
  background-size: cover;
  background-position: center;
  padding: var(--space-xxl) 0;
  margin-bottom: var(--space-xxl);
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Darker overlay */
  z-index: 1;
}

.hero-content {
  text-align: left; /* Align text to the left */
  /* max-width and margin: 0 auto are removed to allow left alignment within .container */
  position: relative; 
  z-index: 2;
  animation: fadeInBottom 1s ease-out 0.3s forwards; /* Added animation with a slight delay */
  opacity: 0; /* Start as transparent for the animation */
}

.hero-content h1.main-catchphrase {
  color: white;
  font-size: 2.5rem; 
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0,0,0,0.5);
  line-height: 1.3;
  margin: 0;
  padding: var(--space-lg) 0;
}

.section-title {
  font-size: 2rem;
  margin-bottom: var(--space-lg);
  color: white;
  text-align: left;
  font-weight: bold;
}

.hero-content h1.main-catchphrase .highlight-red {
  color: #FF4D4D; /* A bright red color */
  font-size: 4rem; /* Slightly larger than the surrounding text */
  font-weight: bolder;
}

@media (max-width: 768px) {
  .hero-content h1.main-catchphrase .highlight-red {
    font-size: 2rem;
  }
  
  .hero-content h1.main-catchphrase {
    font-size: 1.3rem;
  }
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
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

.about-nukebai-section {
  margin-bottom: 0;
}

.about-nukebai-content-wrapper {
  display: flex;
  gap: var(--space-xl); /* Gap between text column and image column */
  align-items: stretch; /* Make columns equal height */
}

.about-content-left {
  flex: 1.5; /* Text column takes more space */
  display: flex;
  flex-direction: column;
}

.about-nukebai-section h2 {
  margin-bottom: var(--space-md); /* Space between title and text block */
  /* flex-shrink: 0; Not needed here as title is in its own column flow */
}

.about-content-right {
  flex: 0.7; /* Image column takes a bit more space */
  display: flex;
  /* justify-content: center; Will be handled by image width:100% */
  /* align-items: flex-start; Not needed with stretch and height 100% on image */
}

.about-text-column {
  background-color: #121212;
  color: #e0e0e0;
  padding: 15px 0 ;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  /* margin-top: 0; Already handled by h2 margin-bottom */
}

.about-text-column p {
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: var(--space-md);
}

.about-text-column p:last-child {
  margin-bottom: 0;
}

.image-1 { /* Styling for negMan4 in the right column */
  width: 100%; /* Fill the width of .about-content-right */
  height: 100%; /* Fill the height of .about-content-right */
  border-radius: var(--border-radius-md);
  object-fit: cover; /* Cover the area, cropping if needed */
}


/* Responsive adjustments */
@media (max-width: 768px) { /* Mobile */
  .about-nukebai-content-wrapper {
    flex-direction: column;
  }
  .about-content-right {
    order: -1; /* Optional: Show image above text content on mobile */
    align-items: center; /* Center image when stacked */
    margin-top: 0;
    margin-bottom: var(--space-lg);
  }
  .image-1 {
    max-width: 180px; /* Slightly larger on mobile */
    width: 100%; /* Ensure it can scale down if container is smaller */
    height: auto; /* Override desktop height: 100% for natural aspect ratio */
  }
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

@keyframes fadeInBottom {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.how-to-use-section {
  padding: var(--space-xl) 0;
}

.how-to-use-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
  margin-top: var(--space-lg);
  justify-content: center;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.how-to-use-card {
  background-color: var(--color-surface);
  padding: var(--space-md);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-elevation-2);
  text-align: left;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.how-to-use-card img {
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: var(--space-sm);
}

.how-to-use-card h3 {
  font-size: 1.25rem;
  margin-bottom: var(--space-sm);
  color: var(--color-on-surface);
}

.how-to-use-card p {
  font-size: 0.9rem;
  color: var(--color-on-surface-variant);
  line-height: 1.6;
  flex-grow: 1; /* Allows paragraph to take available space, useful for alignment if cards have different text lengths */
}

.hero-section.top-page-top2 {
  background-image: url('../assets/images/neg-man8.png');
  margin-top: var(--space-xl);
}

@keyframes slideAndFadeInFromBottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fixed-bottom-cta-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  padding: 20px; /* Adjust padding as needed */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0; /* Initial state for animation */
  transform: translateY(100%); /* Initial state for animation */
  animation: slideAndFadeInFromBottom 0.7s 0.2s ease-out forwards; /* Added a slight delay */
  box-sizing: border-box;
}

.fixed-bottom-try-free-button {
  background-color: var(--color-error, #FF4D4D); /* Red button */
  color: white;
  padding: 15px 30px;
  border-radius: var(--border-radius-lg, 8px);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.3s ease;
  /* position, z-index, specific transform for centering are removed as parent handles layout */
}

.fixed-bottom-try-free-button:hover {
  background-color: var(--color-error-dark, #D93636);
  transform: translateY(-2px);
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.disclaimer-text {
  color: rgba(255,255,255,0.7);
  font-size: 0.55rem;
  margin-top: 0.5rem;
  text-align: center;
}

.text-left {
  text-align: left;
}

/* Campaign Banner Styles */
.campaign-banner {
  width: 100vw;
  padding: var(--space-xl) 0;
  padding-top: 50px;
  margin-top: 0 !important;
  margin-bottom: 20px !important;
  position: relative;
  background-color: var(--color-background);
  background-image: url('../assets/images/pos-man10.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  max-width: 100vw; /* 画面幅を超えないようにする */
}

.campaign-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.campaign-title-container, .campaign-timer {
  position: relative;
  z-index: 2;
}

.campaign-title-container {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  width: 98%;
  margin-left: var(--space-sm);
  margin-right: var(--space-sm);
  position: relative;
}

.title-right-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 0;
  margin-bottom: 0;
  padding-bottom: 0;
}

.title-small {
  font-size: calc(1.5rem + 1vw);
  font-weight: 600;
  color: #fff;
  margin-bottom: 0;
  text-align: left;
  line-height: 1;
  white-space: nowrap;
  transform: skewX(-10deg);
}

.title-large {
  font-size: calc(7rem + 2vw);
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1;
  position: relative;
  transform: skewX(-10deg);
  border-bottom: 8px solid var(--color-primary);
  padding-bottom: 5px;
  display: inline-block;
}

.title-medium {
  font-size: calc(3.5rem + 2vw);
  font-weight: 900;
  color: var(--color-primary);
  text-align: left;
  line-height: 1;
  margin-top: -5px;
  transform: skewX(-10deg);
}

.campaign-timer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.campaign-period-box-bordered {
  border: 2px solid var(--color-primary);
  padding: 5px 20px;
  border-radius: 0; /* 角を丸くしない */
  display: inline-block;
  margin-bottom: 8px;
}

.campaign-date-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.campaign-detail-button {
  background-color: var(--color-primary);
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
}

.campaign-content-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  margin-top: var(--space-md);
  width: 100%;
}

.discount-display {
  font-weight: bold;
  display: flex;
  align-items: baseline;
  padding: var(--space-sm);
  border-radius: var(--border-radius-md);
  margin-left: var(--space-xs);
  position: relative;
  z-index: 2;
}

.discount-before {
  color: white;
  font-size: 1.8rem;
  text-decoration: line-through;
}

.discount-after {
  color: red;
  font-size: calc(3.5rem + 2vw);
  font-weight: 900;
}

.discount-currency {
  color: white;
  font-size: 1.8rem;
}

.campaign-detail-button:hover {
  background-color: #e03131;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.campaign-period-text {
  color: var(--color-primary);
  font-weight: 600;
  font-size: 0.9rem;
}

.campaign-date {
  font-size: 1.8rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap; /* Prevent wrapping */
  white-space: nowrap; /* Prevent text wrapping */
}

.all-white {
  color: white;
}

.large-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-primary);
  margin: 0 2px;
}

@media (max-width: 1200px) {
  .title-large {
    font-size: calc(5rem + 1vw);
  }
  
  .title-medium {
    font-size: calc(2.8rem + 1vw);
  }
  
  .title-small {
    font-size: calc(1.3rem + 0.5vw);
  }
}

@media (max-width: 992px) {
  .title-large {
    font-size: calc(4.5rem + 1vw);
  }
  
  .title-medium {
    font-size: calc(2.5rem + 1vw);
  }
  
  .title-small {
    font-size: calc(1.2rem + 0.5vw);
  }
}

@media (max-width: 768px) {
  .campaign-content-wrapper {
    flex-direction: column;
    align-items: center;
  }
  
  .discount-display {
    margin-left: 0;
    margin-top: var(--space-md);
    margin-bottom: var(--space-md);
  }
  
  .campaign-title-container {
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
    margin-left: 0;
  }
  
  .title-right-container {
    align-items: center;
  }
  
  .title-large {
    font-size: calc(4.5rem + 1vw);
    border-bottom: none;
    padding-bottom: 3px;
    text-align: center;
  }
  
  .title-small {
    font-size: calc(1.5rem + 0.5vw);
    text-align: center;
    margin-bottom: 10px;
  }
  
  .title-medium {
    font-size: calc(3rem + 1vw);
    text-align: center;
    margin-bottom: 10px;
  }
  
  .campaign-timer {
    align-items: center;
  }
  
  .campaign-period-box-bordered {
    text-align: center;
  }
  
  .campaign-date-row {
    justify-content: center;
  }
  
  .campaign-date {
    font-size: 1.5rem;
    text-align: center;
    flex-direction: row; /* Keep horizontal layout */
    flex-wrap: nowrap; /* Prevent wrapping */
    white-space: nowrap; /* Prevent text wrapping */
    justify-content: center;
  }
  
  .large-number {
    font-size: 2rem;
  }
  
  .campaign-detail-button {
    margin: 20px auto 0;
    display: block;
    text-align: center;
  }
}

@media (max-width: 576px) {
  .campaign-content-wrapper {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
  
  .campaign-timer {
    width: 100%;
  }
  
  .discount-display {
    margin: var(--space-md) 0;
    padding: var(--space-sm) var(--space-md);
    justify-content: center;
    width: 80%;
  }
  
  .title-large {
    font-size: calc(3rem + 1vw);
    border-bottom: none;
    text-align: center;
  }
  
  .title-medium {
    font-size: calc(2.3rem + 0.5vw);
    text-align: center;
  }
  
  .title-small {
    font-size: calc(1.2rem + 0.3vw);
    text-align: center;
  }
  
  .campaign-date {
    font-size: 1.3rem;
    text-align: center;
  }
  
  .large-number {
    font-size: 1.8rem;
  }
  
  .campaign-timer {
    width: 100%;
    padding: 0 10px;
  }
  
  .campaign-period-box-bordered {
    padding: 5px 15px;
  }
  
  .campaign-detail-button {
    margin: 15px auto 0;
    padding: 8px 12px;
    width: 80%;
    max-width: 300px;
    text-align: center;
    box-sizing: border-box;
  }
  
  .how-to-use-card {
    margin-bottom: 15px;
  }
  
  .section-title {
    margin-bottom: 15px;
  }
}

@media (max-width: 420px) {
  .title-large {
    font-size: calc(2.2rem + 1vw);
  }
  
  .title-medium {
    font-size: calc(1.8rem + 0.5vw);
  }
  
  .title-small {
    font-size: calc(1rem + 0.3vw);
  }
  
  .campaign-date {
    font-size: 1.1rem;
    flex-direction: row; /* Keep horizontal layout */
    align-items: baseline;
    justify-content: center;
    white-space: nowrap; /* Prevent text wrapping */
  }
  
  .large-number {
    font-size: 1.4rem;
  }
  
  .campaign-detail-button {
    width: 90%;
    font-size: 0.85rem;
  }
  
  .campaign-banner {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  
  .hero-section.top-page-top .main-catchphrase,
  .hero-section.top-page-top2 .main-catchphrase {
    font-size: 1.3rem;
  }
  
  .hero-section.top-page-top .main-catchphrase .highlight-red,
  .hero-section.top-page-top2 .main-catchphrase .highlight-red {
    font-size: 1.8rem;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .how-to-use-card h3 {
    font-size: 1rem;
  }
  
  .how-to-use-card p {
    font-size: 0.8rem;
  }
  
  .about-text-column p {
    font-size: 0.85rem;
  }
}

@media (max-width: 420px) {
  .title-large {
    font-size: calc(3rem + 1vw);
    text-align: center;
  }
  
  .title-medium {
    font-size: calc(2rem + 0.5vw);
    text-align: center;
  }
  
  .title-small {
    font-size: calc(1.2rem + 0.3vw);
    text-align: center;
  }
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .home-page {
    overflow-x: hidden;
  }
  
  .hero-section.top-page-top .main-catchphrase,
  .hero-section.top-page-top2 .main-catchphrase {
    font-size: 2rem; /* Adjusted for 1024px */
    line-height: 1.4;
    width: 100%;
    max-width: 100%;
  }

  .hero-section.top-page-top .main-catchphrase .highlight-red,
  .hero-section.top-page-top2 .main-catchphrase .highlight-red {
    font-size: 3.2rem; /* Adjusted for 1024px */
  }

  .about-nukebai-section .about-content-right {
    display: none; /* Hide the entire right column (image container) */
  }

  .about-nukebai-section .about-content-left {
    padding-right: 0;
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; /* 左揃えに変更 */
    width: 100%;
  }

  .about-nukebai-section .about-text-column {
    text-align: left; /* 左揃えに変更 */
    max-width: 100%;
    width: 100%;
  }
  
  .about-nukebai-content-wrapper {
    flex-direction: column;
    width: 100%;
  }

  .section-title {
    text-align: left; /* 左揃えを維持 */
    font-size: 1.8rem;
    width: 100%;
  }

  .how-to-use-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Adjust card layout */
    width: 100%;
  }
  
  .how-to-use-card {
    width: 100%;
    max-width: 100%;
  }
  
  .how-to-use-card img {
    max-width: 100%;
    height: auto;
  }
  
  .campaign-banner .container {
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
  }
}

@media (max-width: 640px) {
  .home-page {
    overflow-x: hidden;
  }
  
  .hero-section.top-page-top,
  .hero-section.top-page-top2 {
    padding: var(--space-lg) 0;
  }
  
  .hero-section.top-page-top .main-catchphrase,
  .hero-section.top-page-top2 .main-catchphrase {
    font-size: 1.5rem;
    line-height: 1.5;
    padding: 0 10px;
    margin-bottom: 0;
  }

  .hero-section.top-page-top .main-catchphrase .highlight-red,
  .hero-section.top-page-top2 .main-catchphrase .highlight-red {
    font-size: 2.2rem;
  }

  .section-title {
    font-size: 1.3rem;
    padding: 0 10px;
    margin-top: var(--space-md);
  }

  .how-to-use-section {
    padding: var(--space-md) 0;
  }
  
  .how-to-use-grid {
    gap: var(--space-md);
    margin-top: var(--space-md);
    padding: 0 10px;
  }
  
  .how-to-use-card {
    padding: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .how-to-use-card h3 {
    font-size: 1.1rem;
    margin-top: 10px;
  }

  .how-to-use-card p {
    font-size: 0.85rem;
    margin-bottom: 5px;
  }
  
  .about-nukebai-section {
    padding: var(--space-md);
  }
  
  .about-text-column p {
    font-size: 1.2rem;
    margin-bottom: 20px;
    line-height: 1.8;
  }
  
  .about-text-column.increased-spacing p {
    font-size: 1.4rem;
    margin-bottom: 25px;
    line-height: 2;
  }

  .fixed-bottom-cta-container {
    padding: 12px;
  }

  .fixed-bottom-try-free-button {
    padding: 10px 20px;
    font-size: 0.95rem;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }
  
  .campaign-banner {
    padding: var(--space-md) 0;
    padding-top: 30px;
  }
}
/* 重要なテキストのハイライト用スタイル */
.highlight-important {
  color: white;
  background-color: red;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  margin: 5px 0;
}

/* Animation for text background */
.animate-bg {
  position: relative;
  z-index: 1;
  padding: 3px 8px;
  border-radius: 4px;
  overflow: hidden;
}

.animate-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background-color: var(--color-primary);
  z-index: -1;
  transition: width 1s ease-out;
}

.animate-bg-active::before {
  width: 100%;
}

.animate-bg.highlight-red {
  color: white;
}

.animate-bg.highlight-red::before {
  background-color: var(--color-primary);
}

.large-text {
  font-size: 2rem;
}

.normal-text {
  font-size: 1.2rem !important;
}

.bold-text {
  font-weight: bold;
}

@media (max-width: 640px) {
  .highlight-important {
    font-size: 1.2rem;
    padding: 4px 8px;
  }
  
  .large-text {
    font-size: 1.5rem;
  }
}
</style>