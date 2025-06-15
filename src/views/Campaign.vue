<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const navigateToSubscription = () => {
  router.push('/subscription')
}

const navigateToLoginPage = () => {
  router.push('/login')
}

const navigateToSearchPage = () => {
  router.push('/search')
}
</script>

<template>
  <div class="campaign-page">
    <div class="campaign-banner">
      <div class="container">
        <div class="campaign-title-container">
          <h2 class="title-large">三大特典</h2>
          <div class="title-right-container">
            <p class="title-small">ヌケバイリリース記念！</p>
            <h3 class="title-medium">キャンペーン</h3>
          </div>
        </div>
        <div class="campaign-timer">
        <div class="campaign-period-box">
          <span class="campaign-period-text">キャンペーン期間</span>
        </div>
        <p class="campaign-date">
          <span class="all-white">2025年</span><span class="large-number">6</span><span class="all-white">月</span><span class="large-number">15</span><span class="all-white">日 ～ </span><span class="large-number">6</span><span class="all-white">月</span><span class="large-number">30</span><span class="all-white">日</span>
        </p>
      </div>
      </div>
    </div>
    
    <div class="container">
      <!-- Service Concept Section -->
      <div class="service-concept">
        <div class="concept-container">
          <div class="bracket bracket-left"></div>
          <h2 class="concept-heading">
            <span class="heading-text">ヌけないアダルト動画で<br>浪費する時間とお金をなくす</span>
          </h2>
          <div class="bracket bracket-right"></div>
        </div>
        <p class="concept-description">動画IDを入れることでそのアダルト動画はなぜ抜けなかったのかを知れ<br>ヌけない動画で浪費する時間・お金をなくせます</p>
      </div>
      
      <div class="campaign-cards">
        <!-- 特典① -->
        <div class="campaign-card">
          <div class="parallelogram-bg">
            <div class="card-content">
              <h3><span class="benefit-number">特典①</span><span class="separator">/</span><span class="benefit-detail"><span class="small-text">最大3回</span><br>無料利用</span></h3>
              <p>新規登録の方限定！サービスの全機能を3回まで無料でお試しいただけます。</p>
              <div class="disclaimer">※未ログインの際は見られる情報に一部制限がかかります</div>
            </div>
          </div>
        </div>

        <!-- 特典② -->
        <div class="campaign-card">
          <div class="parallelogram-bg">
            <div class="card-content">
              <h3><span class="benefit-number m-b-0">特典②</span><span class="separator">/</span><span class="benefit-detail"><span class="small-text">利用料</span><br>50%OFF</span></h3>
              <p class="m-b-0">以下の期間限定クーポンコードを入力すると最初の1カ月は通常価格の半額でご利用いただけます</p>
              <div class="coupon-code">NukebyeStart</div>
            </div>
          </div>
        </div>

        <!-- 特典③ -->
        <div class="campaign-card">
          <div class="parallelogram-bg">
            <div class="card-content">
              <h3><span class="benefit-number">特典③</span><span class="separator">/</span><span class="benefit-detail"><span class="small-text">アンケートに答えて</span><br>来月も50%OFF</span></h3>
              <p>サービス利用後のアンケートにお答えいただくと、翌月も50%OFFクーポンをプレゼント！</p>
              <div class="disclaimer"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="campaign-details">
        <h3>キャンペーン詳細</h3>
        <div class="campaign-rules">
          <h4>最大3回無料体験</h4>
          <ul>
            <li>当サービス内の検索機能を3回まで無料でご利用いただけます</li>
            <li>無料体験は登録から30日以内にご利用ください</li>
            <li>無料体験後も引き続きサービスをご利用いただく場合は、有料プランへの登録が必要です</li>
          </ul>

          <h4>利用料50%OFF</h4>
          <ul>
            <li>キャンペーン期間中にクーポン利用で、利用料が50%OFFになります</li>
            <li>次回以降は通常料金で自動的に更新されます</li>
          </ul>

          <h4>アンケートクーポン</h4>
          <ul>
            <li>サービス利用後、メールでお送りするアンケートにお答えいただくと、次月50%OFFクーポンを進呈</li>
            <li>クーポンコードはアンケート回答後、メールにてお送りします</li>
          </ul>
        </div>

        <div class="campaign-notes">
          <h4>注意事項</h4>
          <ul>
            <li>各キャンペーンは予告なく終了する場合があります</li>
            <li>キャンペーンの併用はできません</li>
            <li>本キャンペーンは日本国内の方を対象としています</li>
          </ul>
        </div>
      </div>

      <!-- ボタン削除 -->
      
    </div>
    <!-- ユーザーの状態に合わせた固定ボタン -->
    <div class="fixed-bottom-button-container">
      <!-- 未ログインで無料枠が残っている場合 -->
      <div v-if="!userStore.isLoggedIn && userStore.anonymousSearchCount < 1" class="button-container">
        <router-link 
          to="/search" 
          class="fixed-bottom-try-free-button"
        >
          とりあえず無料で使ってみる
        </router-link>
        <p class="disclaimer-text">※未ログイン時は見られる情報に制限がかかります</p>
      </div>
      
      <!-- 未ログインで無料枠を既に使用した場合 -->
      <router-link 
        v-else-if="!userStore.isLoggedIn && userStore.anonymousSearchCount >= 1" 
        to="/login" 
        class="fixed-bottom-try-free-button"
      >
        今だけログインすればもう2回無料！
      </router-link>
      
      <!-- ログイン済みで非課金ユーザーの場合 -->
      <router-link 
        v-else-if="userStore.isLoggedIn && !userStore.isPaidUser" 
        to="/subscription" 
        class="fixed-bottom-try-free-button"
      >
        プレミアム会員になる
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.m-b-0 {
  margin-bottom: 0 !important;
}
.campaign-page {
  background-color: var(--color-background);
  color: var(--color-on-background);
  padding-bottom: 80px; /* 固定ボタンの高さ分の余白 */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}

.campaign-banner {
  width: 100vw;
  margin-bottom: var(--space-xl);
  padding: var(--space-xl) 0;
  padding-top: 50px;
  margin-top: 0;
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
  align-items: flex-end; /* 下揃え */
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
  margin-left: 0; /* 余白削除 */
  margin-bottom: 0; /* 調整用 */
  padding-bottom: 0; /* 調整用 */
}

.title-small {
  font-size: calc(1.5rem + 1vw); /* 文字サイズを大きく */
  font-weight: 600;
  color: #fff;
  margin-bottom: 0; /* 余白削除 */
  text-align: left;
  line-height: 1;
  white-space: nowrap;
  transform: skewX(-10deg); /* 斜め文字 */
}

.title-large {
  font-size: calc(7rem + 2vw); /* さらに大きく */
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1;
  position: relative;
  transform: skewX(-10deg); /* 斜め文字 */
  margin-right: -8px; /* 右側の余白を消す */
  white-space: nowrap;
}

/* 三大特典の下に赤線を追加 - 画像のように赤い下線 */
.title-large::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 6px;
  background-color: var(--color-primary);
  transform: skewX(0); /* 線は斜めにならないように */
}

.title-medium {
  font-size: calc(3.5rem + 2vw); /* さらに大きく */
  font-weight: 900;
  color: var(--color-primary);
  letter-spacing: 2px;
  line-height: 0.88; /* 下揃えに影響する行の高さを調整 */
  white-space: nowrap;
  transform: skewX(-10deg); /* 斜め文字 */
  position: relative;
  top: 0; /* 真上に位置調整 */
  display: inline-block;
  padding-bottom: 5px; /* 下線と揃えるように余白調整 */
}

.campaign-timer {
  margin-bottom: var(--space-xl);
  text-align: left;
  padding: var(--space-md) var(--space-xl);
  margin-top: 30px;
}

.campaign-period-box {
  display: inline-block;
  margin-bottom: var(--space-md);
}

.campaign-period-text {
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: 8px 16px;
  font-size: 1.2rem;
  font-weight: 700;
}

.campaign-date {
  font-size: 1.8rem;
  color: #fff;
  margin: 0;
}

.large-number {
  font-size: 2.8rem;
  font-weight: 700;
  color: #fff;
}

.all-white {
  color: #fff;
}

.campaign-icon {
  font-size: 1.8rem;
}

.campaign-date {
  color: var(--color-primary);
  font-weight: bold;
  font-size: 1.2rem;
}

.campaign-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.campaign-card {
  position: relative;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
}

.campaign-card:hover {
  transform: translateY(-5px);
}

/* Benefit label removed */

.parallelogram-bg {
  position: relative;
  background-color: #222;
  clip-path: polygon(5% 0, 100% 0, 95% 100%, 0% 100%);
  padding: var(--space-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  height: 240px;
  display: flex;
  align-items: center;
}

/* Adding a border using pseudo-element */
.parallelogram-bg::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  z-index: -1;
  clip-path: polygon(4% 0, 100% 0, 96% 100%, 0% 100%);
}

.parallelogram-bg {
  background-color: #222;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-md);
  color: white;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
}

.card-content h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
  color: white;
  display: flex;
  align-items: center;
}

.highlight {
  color: var(--color-primary);
  font-weight: 700;
}

.benefit-number {
  font-size: 2.4rem;
  font-weight: 700;
}

.separator {
  color: var(--color-primary);
  font-weight: 700;
  margin: 0 5px;
}

.benefit-detail {
  color: white;
  font-weight: 700;
}

.small-text {
  font-size: 0.9rem;
  display: inline-block;
}

.disclaimer {
  font-size: 0.65rem;
  color: #aaa;
  margin-top: 5px;
}

.coupon-code {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1.2rem;
  padding: 0;
  margin: 0;
  letter-spacing: 1px;
  display: inline-block;
}

/* Service Concept Styles */
.service-concept {
  text-align: center;
  margin-bottom: 1rem;
  padding: 2rem 1rem;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.concept-container {
  position: relative;
  display: inline-block;
  padding: 0 1rem;
  margin: 0 auto;
}

.concept-heading {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: 1px;
  color: white;
  position: relative;
  display: inline-block;
  padding: 0 3rem;
}

.heading-text {
  text-align: center;
  display: block;
}

.bracket {
  position: absolute;
  height: 100%;
  width: 30px;
  top: 0;
  border-top: 1px solid rgba(255,255,255,0.5);
  border-bottom: 1px solid rgba(255,255,255,0.5);
}

.bracket-left {
  left: -40px;
  border-left: 1px solid rgba(255,255,255,0.5);
}

.bracket-right {
  right: -40px;
  border-right: 1px solid rgba(255,255,255,0.5);
}

.bracket-left::before, .bracket-right::before {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
}

.bracket-left::before {
  top: -8px;
  left: -1px;
  border-top: 1px solid rgba(255,255,255,0.5);
  border-left: 1px solid rgba(255,255,255,0.5);
}

.bracket-right::before {
  top: -8px;
  right: -1px;
  border-top: 1px solid rgba(255,255,255,0.5);
  border-right: 1px solid rgba(255,255,255,0.5);
}

.bracket-left::after, .bracket-right::after {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
}

.bracket-left::after {
  bottom: -8px;
  left: -1px;
  border-bottom: 1px solid rgba(255,255,255,0.5);
  border-left: 1px solid rgba(255,255,255,0.5);
}

.bracket-right::after {
  bottom: -8px;
  right: -1px;
  border-bottom: 1px solid rgba(255,255,255,0.5);
  border-right: 1px solid rgba(255,255,255,0.5);
}

.concept-description {
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 900px;
  margin: 0 auto;
  color: #eee;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .concept-heading {
    font-size: 1.8rem;
    padding: 0 2.2rem;
  }
  
  .quote-left, .quote-right {
    font-size: 4rem;
  }
  
  .quote-left {
    left: -2.5rem;
    top: -1.5rem;
  }
  
  .quote-right {
    right: -2.5rem;
    bottom: -1.5rem;
  }
  
  .concept-description {
    font-size: 1rem;
  }
}

.card-content p {
  margin-bottom: var(--space-md);
  color: #ccc;
  flex-grow: 1;
  font-size: 0.85rem;
}

.card-cta {
  width: 100%;
  margin-top: auto;
}

.cta-button {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--space-sm) var(--space-lg);
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s ease;
}

.cta-button:hover {
  background-color: #ff3333;
}

.campaign-details {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.campaign-details h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-md);
  text-align: center;
}

.campaign-rules {
  margin-bottom: var(--space-lg);
}

.campaign-rules h4, .campaign-notes h4 {
  font-size: 1.2rem;
  margin-bottom: var(--space-sm);
  color: var(--color-primary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: var(--space-xs);
}

.campaign-rules ul, .campaign-notes ul {
  padding-left: var(--space-lg);
  margin-bottom: var(--space-md);
}

.campaign-rules li, .campaign-notes li {
  margin-bottom: var(--space-xs);
  color: #ccc;
}

.cta-container {
  text-align: center;
  margin-top: var(--space-xl);
}

.main-cta-button {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: none;
  border-radius: var(--border-radius-md);
  padding: var(--space-md) var(--space-xl);
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.main-cta-button:hover {
  background-color: #ff3333;
  transform: scale(1.05);
}

/* 固定ボタンのスタイル */
.fixed-bottom-button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.fixed-bottom-try-free-button {
  background-color: var(--color-primary);
  color: white;
  text-align: center;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  max-width: 400px;
}

.fixed-bottom-try-free-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
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
  font-size: 0.65rem;
  margin-top: 0.5rem;
  text-align: center;
}

.main-content{
  padding-top: 0 !important;
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

@media (max-width: 1024px) {
  .campaign-page {
    overflow-x: hidden;
  }
}

@media (max-width: 768px) {
  .campaign-title-container {
    flex-direction: column;
    align-items: center;
    width: 100%;
    text-align: center;
    margin-left: 0;
  }
  
  .title-right-container {
    align-items: center;
    margin-left: 0;
  }
  
  .title-large {
    font-size: calc(4.5rem + 1vw);
    border-bottom: none;
    padding-bottom: 3px;
    text-align: center;
  }
  
  .title-large::after {
    display: none;
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
    bottom: 0;
  }
  
  .campaign-timer {
    align-items: center;
    text-align: center;
    padding: var(--space-md) 0;
  }
  
  .campaign-period-box {
    text-align: center;
  }
  
  .campaign-date {
    text-align: center;
  }
  
  .campaign-cards {
    grid-template-columns: 1fr;
  }
  
  .campaign-card {
    padding: var(--space-md);
  }
  
  .campaign-details {
    padding: var(--space-md);
  }
  
  .card-content p {
    text-align: center;
  }
  
  .disclaimer {
    text-align: center;
  }
  
  .card-content h3 {
    justify-content: center;
  }
}

@media (max-width: 576px) {
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
  
  .campaign-period-box {
    padding: 5px 15px;
  }
  
  .campaign-banner {
    padding: var(--space-lg) var(--space-sm);
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
    flex-direction: column;
    align-items: center;
  }
  
  .large-number {
    font-size: 1.4rem;
  }
  
  .campaign-banner {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  
  .campaign-period-text {
    font-size: 1rem;
    padding: 6px 12px;
  }
}
</style>
