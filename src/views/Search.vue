<template>
  <div class="search-page">
    <div class="container">
      <h1>動画IDを入力してヌけない動画の情報を検索</h1>

      <!-- 未ログイン: 検索はログイン必須(Q-b / D-6) -->
      <div v-if="!userStore.isLoggedIn" class="login-required">
        <p>検索機能のご利用にはログインが必要です。</p>
        <button @click="goToLogin" class="login-button-promo">ログイン / アカウント作成</button>
      </div>

      <!-- ログイン済み: 検索フォーム -->
      <template v-else>
        <div class="search-form">
          <input
            type="text"
            v-model="videoId"
            placeholder="例:AAAA-123"
            @keyup.enter="searchReports"
            class="search-input"
            :readonly="isLoading"
          />
          <button @click="searchReports" :disabled="isLoading" class="search-button">
            <span>検索</span>
          </button>
        </div>

        <div v-if="isLoading" class="loading-indicator">
          <p>検索しています...</p>
        </div>

        <transition name="fade">
          <div v-if="searchAttempted && !isLoading" class="search-results-container">
            <!-- Case 1: No results -->
            <div v-if="reports.length === 0 && videoIdSearched" class="search-result-wrapper no-results-wrapper">
              <div class="no-results">
                <img :src="posMan5Image" alt="該当なし" class="result-image" />
                <p>
                  「{{ videoIdSearched }}」の報告はありませんでした。<br />
                  あなたが最初の報告者になりませんか？
                </p>
                <router-link
                  :to="{ name: 'SubmitReview', query: { videoId: videoIdSearched } }"
                  class="report-link-button"
                >
                  この動画を報告する
                </router-link>
              </div>
            </div>

            <!-- Case 2: Results found -->
            <div v-else-if="reports.length > 0" class="search-result-wrapper results-found-wrapper">
              <div class="results">
                <img :src="currentNegImage" alt="該当あり" class="result-image" />
                <p class="result-message">
                  「{{ videoIdSearched }}」は<span class="highlight">{{ totalNeg }}</span>人のユーザーによって報告されています。
                </p>
              </div>
              <!-- Reason summary -->
              <div class="reason-summary">
                <h3>報告理由の内訳:</h3>
                <ul>
                  <li v-for="(count, reason) in reasonCounts" :key="reason">
                    {{ reason }}: {{ count }} 人
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </transition>

        <div v-if="searchError" class="error-message">
          <p>{{ searchError }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import posMan5Image from '@/assets/images/pos-man5.png';
import negMan7Image from '@/assets/images/neg-man7.png';
import negMan1Image from '@/assets/images/neg-man1.png';
import negMan3Image from '@/assets/images/neg-man3.png';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useUserStore } from '@/stores/user';
import { useReasonsStore } from '@/stores/reasons';
import { useRouter } from 'vue-router';
import { normalizeVideoId } from '@/utils/videoId';

const videoId = ref('');
const videoIdSearched = ref(''); // 検索実行時のvideoIdを保持
const reports = ref([]);
const isLoading = ref(false);
const searchAttempted = ref(false);
const searchError = ref('');

const negImages = [negMan7Image, negMan1Image, negMan3Image];
const currentNegImage = ref(negImages[0]);

const db = getFirestore();
const userStore = useUserStore();
const reasonsStore = useReasonsStore();
const router = useRouter();

const totalNeg = computed(() => reports.value.length);

const goToLogin = () => {
  router.push({ name: 'Login', query: { redirect: '/search' } });
};

// 理由コード→表示名のマップは reasons ストア(マスタ)から生成し、二重管理を排除 (C-2)
const reasonDisplayMap = computed(() => {
  const map = {};
  reasonsStore.getAllReasons().forEach((r) => {
    map[r.code] = r.displayName;
  });
  return map;
});

const searchReports = async () => {
  if (!userStore.isLoggedIn) {
    goToLogin();
    return;
  }

  isLoading.value = true;
  searchAttempted.value = true;
  searchError.value = '';
  reports.value = [];
  // 動画IDを正規化(投稿時と同じルール。表記ゆれでもヒットさせる。C-1)
  videoIdSearched.value = normalizeVideoId(videoId.value);

  if (!videoIdSearched.value) {
    searchError.value = '動画IDを入力してください。';
    isLoading.value = false;
    return;
  }

  try {
    const q = query(collection(db, 'posts'), where('videoId', '==', videoIdSearched.value));
    const querySnapshot = await getDocs(q);
    const fetchedReports = [];
    querySnapshot.forEach((doc) => {
      fetchedReports.push({ id: doc.id, ...doc.data() });
    });
    reports.value = fetchedReports;

    if (fetchedReports.length > 0) {
      currentNegImage.value = negImages[Math.floor(Math.random() * negImages.length)];
    }
  } catch (error) {
    console.error('Error searching reports:', error);
    searchError.value = '検索中にエラーが発生しました。もう一度お試しください。';
  } finally {
    isLoading.value = false;
  }
};

const reasonCounts = computed(() => {
  if (reports.value.length === 0) {
    return {};
  }
  const counts = {};
  reports.value.forEach((report) => {
    if (report.reasons && Array.isArray(report.reasons) && report.reasons.length > 0) {
      report.reasons.forEach((reasonCode) => {
        const displayName = reasonDisplayMap.value[reasonCode] || reasonCode;
        counts[displayName] = (counts[displayName] || 0) + 1;
      });
    } else {
      counts['理由不明'] = (counts['理由不明'] || 0) + 1;
    }
  });
  return counts;
});
</script>

<style scoped>
.search-page {
  padding: var(--space-xl) 0;
  min-height: calc(100vh - 200px);
}

.container h1 {
  margin-bottom: var(--space-xl);
  text-align: center;
}

.login-required {
  text-align: center;
  margin-top: var(--space-xl);
  padding: var(--space-xl);
  background-color: var(--color-surface);
  border: 1px solid var(--color-surface-variant);
  border-radius: var(--border-radius-md);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.login-required p {
  margin-bottom: var(--space-lg);
  color: var(--color-on-surface);
}

.search-form {
  display: flex;
  justify-content: center;
  align-items: stretch;
  margin-bottom: var(--space-xl);
  gap: var(--space-sm);
  --search-element-height: 40px;
}

.search-input {
  min-width: 200px;
  width: 300px;
  padding: 0 var(--space-md);
  height: var(--search-element-height);
  line-height: var(--search-element-height);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  box-sizing: border-box;
}

.search-button {
  width: 100px;
  padding: 0 var(--space-lg);
  height: var(--search-element-height);
  line-height: var(--search-element-height);
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-form button:hover {
  background-color: var(--color-primary-dark);
}

.search-form button:disabled {
  background-color: var(--color-surface-variant);
  cursor: not-allowed;
}

.loading-indicator,
.error-message {
  text-align: center;
  margin-top: var(--space-xl);
}

.search-result-wrapper {
  text-align: center;
  margin-top: var(--space-xl);
}

.result-image {
  width: 70vw;
  max-width: 400px;
  height: auto;
  margin-bottom: var(--space-lg);
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.result-message {
  font-size: 1.1rem;
}

.highlight {
  color: var(--color-error);
  font-weight: bold;
  font-size: 1.5em;
}

.no-results p {
  line-height: 1.6;
  margin-bottom: var(--space-lg);
}

.report-link-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: background-color var(--transition-duration) ease;
}

.report-link-button:hover {
  background-color: var(--color-primary-dark, #c82333);
}

.reason-summary {
  margin-top: var(--space-lg);
  text-align: left;
  display: inline-block;
  padding: var(--space-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.reason-summary h3 {
  margin-bottom: var(--space-md);
  font-size: 1.1rem;
}

.reason-summary ul {
  list-style-type: none;
  padding: 0;
}

.reason-summary li {
  margin-bottom: var(--space-sm);
}

.error-message {
  color: var(--color-error);
  font-weight: bold;
}

.login-button-promo {
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--color-error);
  color: var(--color-on-error);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.login-button-promo:hover {
  background-color: var(--color-error-dark);
}

/* フェードインアニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
