import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './assets/styles/main.scss'
import { initializeFirebase } from './services/firebase'

// Initialize Firebase
initializeFirebase()

// Create i18n instance
const i18n = createI18n({
  locale: 'ja',
  fallbackLocale: 'ja',
  messages: {
    ja: {
      // Common
      appName: '動画レビューサービス',
      login: 'ログイン',
      register: '新規登録',
      logout: 'ログアウト',
      search: '検索',
      submit: '送信',
      cancel: 'キャンセル',
      
      // Home
      tagline: 'ヌけないアダルト動画を見て無駄にするお金と時間をゼロにする',
      getStarted: '始める',
      howItWorks: '使い方',
      
      // Auth
      email: 'メールアドレス',
      password: 'パスワード',
      confirmPassword: 'パスワード（確認）',
      forgotPassword: 'パスワードをお忘れですか？',
      googleLogin: 'Googleでログイン',
      ageVerification: '私は18歳以上です',
      
      // Reviews
      videoId: '動画ID',
      videoTitle: '動画タイトル',
      reviewReasons: 'ヌけない理由',
      submitReview: 'レビューを投稿',
      searchByVideoId: '動画IDで検索',
      filterByReason: '理由でフィルター',
      
      // Account
      myAccount: 'マイアカウント',
      myReviews: '投稿したレビュー',
      myPoints: 'ポイント',
      subscription: 'サブスクリプション',
      
      // Subscription
      premiumFeatures: 'プレミアム機能',
      monthlyPrice: '月額 1,000円',
      upgradeNow: '今すぐアップグレード',
      
      // Footer
      terms: '利用規約',
      privacy: 'プライバシーポリシー',
      contact: 'お問い合わせ'
    }
  }
})

// Create Pinia store
const pinia = createPinia()

// Create app
const app = createApp(App)

// Use plugins
app.use(router)
app.use(pinia)
app.use(i18n)

// Mount app
app.mount('#app')