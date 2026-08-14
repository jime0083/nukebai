<template>
  <div class="prerelease-page">
    <!-- プレリリースバナー -->
    <div class="campaign-banner fade-in-element">
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
        </div>
      </div>
    </div>

    <div class="container">

      <!-- 使い方セクション -->
      <section class="how-to-use-section fade-in-element">
        <h2 class="section-title">プレリリースキャンペーン参加方法</h2>
        <div class="how-to-use-grid">
          <div class="how-to-use-card">
            <img :src="howToImage1" alt="使い方1：動画を検索">
            <h3>まずはログイン</h3>
            <p>Googleアカウントかメールアドレスでアカウントを作成しログインしましょう</p>
            <p class="small-text">※未ログインでも一部機能は利用できますが、未ログインでの利用はキャンペーンの利用回数にカウントされません</p>
          </div>
          <div class="how-to-use-card">
            <img :src="howToImage2" alt="使い方2：レビューを投稿">
            <h3>ヌけないアダルト動画の情報を検索</h3>
            <p>画面右上の「検索」をクリックして検索ページに移動しましょう。検索ページの検索ボックスに動画IDを入力してください</p>
            <p class="disclaimer-text text-left">※未ログインの場合は見られる情報に一部制限がかかります</p>
          </div>
          <div class="how-to-use-card">
            <img :src="howToImage3" alt="使い方3：賢く視聴">
            <h3>賢く視聴</h3>
            <p>これまでその動画で「ヌけなかった」人の情報を基に本当に楽しめる作品だけを選んで視聴。貴重な時間とお金の浪費を防ぎます。</p>
          </div>
        </div>
      </section>

      <!-- 報告方法セクション -->
      <section class="how-to-use-section fade-in-element">
        <div class="how-to-use-grid">
          <div class="how-to-use-card">
            <img :src="reportImage1" alt="使い方1：動画を検索">
            <h3>ヌけない動画を見たら...</h3>
            <p>ヌけない動画を見たら、画面右上の「報告」をクリックし、ヌけない動画の報告をしましょう！</p>
          </div>
          <div class="how-to-use-card">
            <img :src="reportImage2" alt="使い方2：レビューを投稿">
            <h3>検索・報告をしてアンケートに答えよう！</h3>
            <p>検索・報告をそれぞれ3回利用したら、プロフィールページの「アンケートに答える」ボタンをクリックしアンケートページからアンケートにご回答ください</p>
          </div>
          <div class="how-to-use-card">
            <img :src="reportImage3" alt="使い方3：賢く視聴">
            <h3>7/31まで無料利用できる！</h3>
            <p>アンケートにご回答いただいた方は月額1000円のヌケバイの全サービスを7/31まで無料でご利用いただけます!</p>
            <p class="small-text">※アンケート送信後、内容に不備などが無いかの確認のため1営業日程度お時間をいただく場合があります</p>
          </div>
        </div>
      </section>
    </div>
  </div>
  <!-- 画面下部の固定ボタン -->  
  <div class="fixed-bottom-cta-container">
    <router-link 
      to="/login" 
      class="fixed-bottom-try-free-button"
    >
      プレリリースキャンペーンに参加する
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

// 画像のインポート
import howToImage1 from '../assets/images/ple1.jpg';
import howToImage2 from '../assets/images/ple2.jpg';
import howToImage3 from '../assets/images/use3.jpg';
import reportImage1 from '../assets/images/ple3.jpg';
import reportImage2 from '../assets/images/ple4.jpg';
import reportImage3 from '../assets/images/ple5.jpg';

const userStore = useUserStore()

// スクロールアニメーション用の関数
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target) // 一度表示されたら監視を解除
      }
    })
  }, { threshold: 0.1 }) // 10%表示されたらアニメーション開始

  // 監視対象の要素を取得して監視を開始
  const elements = document.querySelectorAll('.fade-in-element')
  elements.forEach(el => observer.observe(el))
}

// コンポーネントがマウントされたら監視を開始
onMounted(() => {
  observeElements()
});
</script>

<style scoped>
.prerelease-page {
  padding-bottom: var(--space-xl);
}

/* プレリリースバナーのスタイル */
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
  max-width: 100vw;
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

.campaign-detail-button {
  background-color: var(--color-primary);
  color: white;
  padding: 10px 20px;
  margin-top: 20px;
}

.campaign-detail-button:hover {
  background-color: #e03131;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.campaign-period-box-bordered {
  border: 2px solid var(--color-primary);
  padding: 5px 20px;
  border-radius: 0;
  display: inline-block;
  margin-bottom: 8px;
}

.campaign-date-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.campaign-content-wrapper {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  margin-top: var(--space-md);
  width: 100%;
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

/* プレリリース説明セクションのスタイル */
.prerelease-info-section {
  margin-bottom: var(--space-xl);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  text-align: center;
  margin-top: 50px;
  margin-bottom: var(--space-lg);
  color: var(--color-primary);
  font-size: 2rem;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.7rem;
  }
}

.prerelease-description {
  font-size: 1.2rem;
  margin-bottom: var(--space-md);
  text-align: center;
}

.prerelease-benefits {
  list-style: none;
  padding: 0;
  margin: var(--space-lg) 0;
}

.prerelease-benefits li {
  margin-bottom: var(--space-md);
  padding-left: 30px;
  position: relative;
  font-size: 1.1rem;
}

.prerelease-benefits li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

.highlight-point {
  font-weight: bold;
  color: var(--color-primary);
}

.prerelease-note {
  font-style: italic;
  text-align: center;
  margin-top: var(--space-lg);
}

/* 使い方セクションのスタイル */
.how-to-use-section {
  margin-bottom: var(--space-xl);
}

.how-to-use-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-lg);
}

.how-to-use-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--space-md);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.how-to-use-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.how-to-use-card img {
  width: 100%;
  height: auto;
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--space-md);
}

.how-to-use-card h3 {
  margin-bottom: var(--space-sm);
  color: var(--color-primary);
}

.disclaimer-text {
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.8rem;
  margin-top: var(--space-sm);
}

.text-left {
  text-align: left;
}

.small-text {
  font-size: 0.7rem;
}

/* キャンペーン参加ボタンセクションのスタイル */
.campaign-join-section {
  margin: 50px 0;
  padding: 30px 0;
  text-align: center;
}

.campaign-join-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.campaign-join-button {
  background-color: var(--color-error, #FF4D4D);
  color: white;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: var(--border-radius-lg, 8px);
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.campaign-join-button:hover {
  background-color: #e03131;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .campaign-join-button {
    padding: 12px 30px;
    font-size: 1.1rem;
    width: 80%;
    max-width: 300px;
  }
}

/* アンケート協力セクションのスタイル */
.survey-cta-section {
  background-color: var(--color-surface-variant);
  border-radius: var(--border-radius-lg);
  padding: var(--space-lg);
  margin-top: var(--space-xl);
}

.survey-cta-content {
  text-align: center;
}

.survey-cta-content p {
  margin-bottom: var(--space-md);
  font-size: 1.1rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.primary-button, .secondary-button {
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--border-radius-md);
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
}

.primary-button {
  background-color: var(--color-primary);
  color: white;
}

.secondary-button {
  background-color: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.primary-button:hover {
  background-color: var(--color-primary-dark, #e03131);
  transform: translateY(-2px);
}

.secondary-button:hover {
  background-color: rgba(229, 57, 53, 0.1);
  transform: translateY(-2px);
}

/* レスポンシブスタイル */
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
  }
  
  .campaign-date {
    font-size: 1.5rem;
    text-align: center;
    flex-direction: row; /* Keep horizontal layout */
    flex-wrap: nowrap; /* Prevent wrapping */
    white-space: nowrap; /* Prevent text wrapping */
    justify-content: center;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .primary-button, .secondary-button {
    width: 100%;
    max-width: 300px;
    margin-bottom: var(--space-sm);
    text-align: center;
  }
}

@media (max-width: 420px) {
  .how-to-use-grid {
    grid-template-columns: 1fr;
  }
  
  .campaign-date {
    font-size: 1.1rem;
    flex-direction: row; /* Keep horizontal layout */
    align-items: baseline;
    justify-content: center;
    white-space: nowrap; /* Prevent text wrapping */
  }
  
  .large-number {
    font-size: 1.5rem;
  }
}

/* フェードインアニメーション */
.fade-in-element {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.fade-in-element.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 固定ボタンのスタイル */
.fixed-bottom-cta-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  box-sizing: border-box;
  animation: slideAndFadeInFromBottom 0.7s 0.2s ease-out forwards;
}

.fixed-bottom-try-free-button {
  background-color: var(--color-error, #FF4D4D);
  color: white;
  padding: 15px 30px;
  border-radius: var(--border-radius-lg, 8px);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.fixed-bottom-try-free-button:hover {
  background-color: var(--color-error-dark, #D93636);
  transform: translateY(-2px);
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

@media (max-width: 640px) {
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
}
</style>
