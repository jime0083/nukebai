import { defineStore } from 'pinia'
import { ref, computed } from 'vue' // onMounted はストアセットアップでは直接不要

// 利用回数の上限定義
const MAX_ANONYMOUS_SEARCHES = 1;
const MAX_LOGGED_IN_FREE_SEARCHES = 2;
const ANONYMOUS_SEARCH_COUNT_KEY = 'anonymousSearchCountNukebai'; // アプリ固有のキー名に変更

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const subscriptionStatus = ref('free') // 'free', 'paid', etc.
  const points = ref(0)
  const reportCount = ref(0)
  const searchCount = ref(0) // Logged-in user's search count from Firestore
  const role = ref(null)
  const isStoreInitialized = ref(false);

  // For anonymous users
  const anonymousSearchCount = ref(0);

  // ストアが初期化されるときにlocalStorageから匿名検索回数を読み込む
  function initializeAnonymousSearch() {
    const storedCount = localStorage.getItem(ANONYMOUS_SEARCH_COUNT_KEY);
    anonymousSearchCount.value = storedCount ? parseInt(storedCount, 10) : 0;
  }
  initializeAnonymousSearch(); // ストアインスタンス化時に実行

  function setUser(userData) {
    user.value = userData;
    if (userData) {
      role.value = userData.role || 'user';
      subscriptionStatus.value = userData.subscriptionStatus || 'free';
      points.value = userData.points || 0;
      reportCount.value = userData.reportCount || 0;
      searchCount.value = userData.searchCount || 0; // Firestoreからの検索回数
    } else {
      role.value = null;
      subscriptionStatus.value = 'free';
      points.value = 0;
      reportCount.value = 0;
      searchCount.value = 0;
    }
    isStoreInitialized.value = true;
  }

  function clearUser() {
    user.value = null;
    subscriptionStatus.value = 'free';
    points.value = 0;
    reportCount.value = 0;
    searchCount.value = 0;
    role.value = null;
    isStoreInitialized.value = true;
  }

  function updateSubscription(status) {
    subscriptionStatus.value = status
  }

  function updatePoints(newPoints) {
    points.value = newPoints
  }

  function incrementReportCount() {
    if (user.value) { // ログインユーザーのみ
      reportCount.value++;
      // Firestoreへの保存は呼び出し元コンポーネント/サービスで行う
    }
  }

  function incrementSearchCount() {
    if (user.value) { // ログインユーザーのみ
      searchCount.value++;
      // Firestoreへの保存は呼び出し元コンポーネント/サービスで行う
    }
  }

  function incrementAnonymousSearchCount() {
    if (!user.value) { // 未ログインユーザーのみ
      anonymousSearchCount.value++;
      localStorage.setItem(ANONYMOUS_SEARCH_COUNT_KEY, anonymousSearchCount.value.toString());
    }
  }

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => isLoggedIn.value && role.value === 'admin');
  const isPaidUser = computed(() => isLoggedIn.value && subscriptionStatus.value !== 'free' && subscriptionStatus.value !== null);

  const canPerformSearch = computed(() => {
    if (!isLoggedIn.value) {
      return anonymousSearchCount.value < MAX_ANONYMOUS_SEARCHES;
    }
    if (isPaidUser.value || isAdmin.value) {
      return true;
    }
    return searchCount.value < MAX_LOGGED_IN_FREE_SEARCHES;
  });

  const shouldShowMosaic = computed(() => {
    return !isLoggedIn.value;
  });

  const canSubmitReport = computed(() => {
    return isLoggedIn.value && (isPaidUser.value || isAdmin.value);
  });

  return {
    user,
    subscriptionStatus,
    points,
    reportCount,
    searchCount,
    anonymousSearchCount,
    role,
    isStoreInitialized,
    setUser,
    clearUser,
    updateSubscription,
    updatePoints,
    incrementReportCount,
    incrementSearchCount,
    incrementAnonymousSearchCount,
    isLoggedIn,
    isAdmin,
    isPaidUser,
    canPerformSearch,
    shouldShowMosaic,
    canSubmitReport,
  }
})