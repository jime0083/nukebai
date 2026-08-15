import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import AgeVerification from '../views/AgeVerification.vue';
import SubmitReview from '../views/SubmitReview.vue';
import ReviewDetails from '../views/ReviewDetails.vue';
import UserProfile from '../views/UserProfile.vue';
import Subscription from '../views/Subscription.vue';
import ContractManagement from '../views/ContractManagement.vue';
import NotFound from '../views/NotFound.vue';
import Search from '../views/Search.vue';
import TermsOfService from '../views/TermsOfService.vue';
import PrivacyPolicy from '../views/PrivacyPolicy.vue';
import { useUserStore } from '../stores/user';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/age-verification',
    name: 'AgeVerification',
    component: AgeVerification
  },
  {
    path: '/submit-review',
    name: 'SubmitReview',
    component: SubmitReview,
    meta: { requiresAuth: true }
  },
  {
    path: '/review/:id',
    name: 'ReviewDetails',
    component: ReviewDetails
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: Subscription
  },
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/contract-management',
    name: 'ContractManagement',
    component: ContractManagement
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/terms',
    name: 'TermsOfService',
    component: TermsOfService
  },
  {
    path: '/privacy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicy
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // 常にページの最上部にスクロールする
    return { top: 0 }
  }
});

// userStoreの初期化を待つヘルパー関数(App.vue の useAuthState が
// onAuthStateChanged 完了時に isStoreInitialized を true にする)
async function waitForUserStoreInitialization(store) {
  return new Promise(resolve => {
    if (store.isStoreInitialized) {
      resolve();
    } else {
      const unsubscribe = store.$subscribe((mutation, state) => {
        if (state.isStoreInitialized) {
          unsubscribe();
          resolve();
        }
      });
    }
  });
}

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore(); // ストアインスタンスを取得
  await waitForUserStoreInitialization(userStore); // userStoreの初期化を待つ

  // 年齢確認ゲート(D-3): 未確認なら年齢確認ページへ誘導する
  const ageVerified = localStorage.getItem('ageVerified') === 'true';
  if (!ageVerified && to.name !== 'AgeVerification') {
    next({ name: 'AgeVerification', query: { redirect: to.fullPath } });
    return;
  }
  // 確認済みユーザーが年齢確認ページへ来た場合はトップ(または元の遷移先)へ
  if (ageVerified && to.name === 'AgeVerification') {
    next(typeof to.query.redirect === 'string' ? to.query.redirect : '/');
    return;
  }

  // 認証が必要なページ: userStore のログイン状態で判定する。
  // userStore は useAuthState(onAuthStateChanged)が確定させ、上で初期化を待済み。
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }

  next();
});

// ページごとの document.title を設定(SEO / F-3)
const BASE_TITLE = 'ヌケバイ';
const TITLE_MAP = {
  Home: 'ヌケバイ | ヌけないアダルト動画の情報共有',
  Login: 'ログイン',
  Register: '新規登録',
  Search: '動画を検索',
  SubmitReview: 'ヌけない動画を報告',
  ReviewDetails: 'レビュー詳細',
  UserProfile: 'プロフィール',
  Subscription: 'プレミアムプラン',
  ContractManagement: '契約管理',
  AgeVerification: '年齢確認',
  TermsOfService: '利用規約',
  PrivacyPolicy: 'プライバシーポリシー',
  NotFound: 'ページが見つかりません',
};
router.afterEach((to) => {
  const mapped = TITLE_MAP[to.name];
  if (!mapped) {
    document.title = BASE_TITLE;
  } else if (to.name === 'Home') {
    document.title = mapped;
  } else {
    document.title = `${mapped} | ${BASE_TITLE}`;
  }
});

export default router;