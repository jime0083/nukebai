import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

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

// auth is now directly imported from '../firebase.js'
// Firebase is initialized within firebase.js itself

let isAuthInitialized = false; // 認証初期化済みフラグ

function getCurrentUser() {
  return new Promise((resolve, reject) => {
    if (isAuthInitialized && auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // 一度だけ実行
      isAuthInitialized = true;
      resolve(user);
    }, reject);
  });
}

// userStoreの初期化を待つヘルパー関数
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

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    const user = await getCurrentUser(); // 認証状態が解決するまで待つ
    if (!user) {
      next({ name: 'Login', query: { redirect: to.fullPath } });
      return;
    }
    // userStore.user のチェックは、waitForUserStoreInitialization 後なので、より信頼性が高い
    // ただし、Firebase認証ユーザー(user)とストアユーザー(userStore.user)が一致するかは別の問題
    if (!userStore.user || userStore.user.uid !== user.uid) {
      // ストアにユーザーがいない、または認証ユーザーとストアのユーザーが異なる場合
      // App.vueでのストア設定処理が完了するのを待つか、エラーとして扱うか
      // ここでは一旦、ログインへリダイレクトする（App.vueでの処理に期待）
      next({ name: 'Login', query: { redirect: to.fullPath, reason: 'user_store_sync_issue' } });
      return;
    }
  }

  // Premium subscription requirement removed - logged-in users can access all features

  next();
});

export default router;