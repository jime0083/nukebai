import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const subscriptionStatus = ref('free') // 'free', 'paid', etc.
  const points = ref(0)
  const reportCount = ref(0)
  const searchCount = ref(0) // Logged-in user's search count from Firestore
  const role = ref(null)
  const isStoreInitialized = ref(false)

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

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => isLoggedIn.value && role.value === 'admin');
  const isPaidUser = computed(() => isLoggedIn.value && subscriptionStatus.value !== 'free' && subscriptionStatus.value !== null);

  // 検索・レポートはログイン必須(Q-b / D-6)。未ログインでは利用不可。
  const canPerformSearch = computed(() => isLoggedIn.value);
  const canSubmitReport = computed(() => isLoggedIn.value);

  return {
    user,
    subscriptionStatus,
    points,
    reportCount,
    searchCount,
    role,
    isStoreInitialized,
    setUser,
    clearUser,
    updateSubscription,
    updatePoints,
    isLoggedIn,
    isAdmin,
    isPaidUser,
    canPerformSearch,
    canSubmitReport,
  }
})
