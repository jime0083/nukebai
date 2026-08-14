<template>
  <div class="search-page">
    <div class="container">
      <h1>動画IDを入力してヌけない動画の情報を検索</h1>

      <div class="search-form">
        <input type="text" v-model="videoId" placeholder="例:AAAA-123" @keyup.enter="searchReports" class="search-input" :readonly="isLoading || !userStore.canPerformSearch" />
        <button @click="searchReports" :disabled="isLoading || !userStore.canPerformSearch" class="search-button">
          <span>検索</span>
        </button>
      </div>
      
      <!-- 未ログインユーザー向けの注釈 -->
      <div v-if="!userStore.isLoggedIn" class="disclaimer-container">
        <p class="disclaimer-text">※未ログイン時は見られる情報に制限がかかります</p>
      </div>


      <div v-if="isLoading" class="loading-indicator">
        <p>検索しています...</p>
      </div>

      <!-- Message for unauthenticated user who has used free search -->
      <div v-if="showFreeLimitReachedMessage" class="free-limit-reached-message">
        <p class="limit-text">すでに無料枠を使用しています。</p>
        <div class="login-prompt-inline">
          <p>今だけアカウントを作成すれば無料でさらに2回、全情報が見られる！</p>
          <button @click="goToLoginForPromo" class="login-button-promo">アカウント作成</button>
        </div>
      </div>

      <transition name="fade">
        <div v-if="searchAttempted && !isLoading" class="search-results-container">
          
          <!-- Case 1: No results -->
          <div v-if="reports.length === 0 && videoIdSearched" class="search-result-wrapper no-results-wrapper">
            <div class="no-results">
              <img :src="posMan5Image" alt="該当なし" class="result-image"/>
              <p>
                「{{ videoIdSearched }}」の報告はありませんでした。<br />
                あなたが最初の報告者になりませんか？
              </p>
            </div>
          </div>

          <!-- Case 2: Results found -->
          <div v-else-if="reports.length > 0" class="search-result-wrapper results-found-wrapper">
            <div class="results">
              <img :src="currentNegImage" alt="該当あり" class="result-image"/>
              <p class="result-message">
                「{{ videoIdSearched }}」は<span class="highlight">{{ totalNeg }}</span>人のユーザーによって報告されています。
              </p>
              <p v-if="userStore.shouldShowMosaic" class="mosaic-info">
                この動画をヌけなかった人が <span class="highlight">{{ reasonCounts['ヌけなかった'] || 0 }}人</span> いました。<br/>
                報告理由の詳細はログイン/アカウント作成後に確認できます。
              </p>
            </div>
            <!-- Reason summary with mosaic -->
            <div class="reason-summary" :class="{ 'mosaic-active': userStore.shouldShowMosaic }">
              <h3>報告理由の内訳:</h3>
              <ul>
                <li v-for="(count, reason) in reasonCounts" :key="reason">
                  {{ reason }}: {{ count }} 人
                </li>
              </ul>
            </div>
            <!-- Login promotion for anonymous users with mosaic -->
            <div v-if="userStore.shouldShowMosaic && reports.length > 0" class="login-prompt-mosaic">
              <p>今だけアカウントを作成すれば無料でさらに2回、全情報が見られる！</p>
              <button @click="goToLogin" class="login-button-promo">アカウント作成</button>
            </div>
          </div>


        </div>
      </transition>
       <div v-if="searchError" class="error-message">
        <p>{{ searchError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'; // Import onMounted
import posMan5Image from '@/assets/images/pos-man5.png';
import negMan7Image from '@/assets/images/neg-man7.png';
import negMan1Image from '@/assets/images/neg-man1.png';
import negMan3Image from '@/assets/images/neg-man3.png';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useUserStore } from '@/stores/user';
import { useReasonsStore } from '@/stores/reasons';
import { useRouter } from 'vue-router'; // Import useRouter
import { normalizeVideoId } from '@/utils/videoId';

const videoId = ref('');
const videoIdSearched = ref(''); // 検索実行時のvideoIdを保持
const reports = ref([]);
const isLoading = ref(false);
const searchAttempted = ref(false); // 検索が試みられたかどうかのフラグ
const searchError = ref('');

const negImages = [negMan7Image, negMan1Image, negMan3Image];
const currentNegImage = ref(negImages[0]); // 初期画像としてリストの最初のものを設定



const db = getFirestore();
const userStore = useUserStore();
const reasonsStore = useReasonsStore();
const router = useRouter(); // Initialize router

const showFreeLimitReachedMessage = computed(() => !userStore.isLoggedIn && !userStore.canPerformSearch);

// 理由コード→表示名のマップは reasons ストア(マスタ)から生成し、二重管理を排除 (C-2)
const reasonDisplayMap = computed(() => {
  const map = {};
  reasonsStore.getAllReasons().forEach((r) => {
    map[r.code] = r.displayName;
  });
  return map;
});

const goToLoginForPromo = () => {
  router.push({ name: 'Login', query: { redirect: '/search', reason: 'promo_login_limit' } });
};

// This function is for the mosaic prompt, might need renaming or consolidation if behavior is identical
const goToLogin = () => {
  router.push({ name: 'Login', query: { redirect: '/search', reason: 'promo_login_mosaic' } });
};


const searchReports = async () => {
  // 1. Check permission to search
  if (!userStore.canPerformSearch) {
    // For unauthenticated users, 'showFreeLimitReachedMessage' (computed) handles the prompt.
    // The search button/input will be disabled by 'isSearchDisabled' if canPerformSearch is false.
    isLoading.value = false;
    searchAttempted.value = true; // To display the error
    reports.value = []; // Clear previous results
    return;
  }

  if (!videoId.value.trim()) {
    searchError.value = '動画IDを入力してください。';
    isLoading.value = false;
    searchAttempted.value = true; // To display the error if input is empty on click
    reports.value = [];
    // showFreeLimitReachedMessage is now computed, no need to set it false here.
    // If input is invalid, we clear reports and show an error, the limit message will hide if conditions for it are no longer met.
    return;
  }
  // If a new search is attempted with valid input, the computed showFreeLimitReachedMessage will update if user state changes (e.g. they log in).
  // No explicit reset needed here for the computed property.

  isLoading.value = true;
  searchAttempted.value = true;
  searchError.value = ''; // Clear previous errors
  reports.value = []; // Clear previous results
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

    // 2. Increment search count AFTER successful search execution
    if (!userStore.isLoggedIn) {
      userStore.incrementAnonymousSearchCount();
    }
    // Logged-in users have unlimited searches, no need to track count
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
  reports.value.forEach(report => {
    if (report.reasons && Array.isArray(report.reasons) && report.reasons.length > 0) {
      report.reasons.forEach(reasonCode => {
        const displayName = reasonDisplayMap.value[reasonCode] || reasonCode; // マスタにあれば表示名、なければ元のコード
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
  min-height: calc(100vh - 200px); /* フッター分を考慮 */
}

.container h1 {
  margin-bottom: var(--space-xl);
  text-align: center;
}

.search-form {
  display: flex;
  justify-content: center;
  align-items: stretch; /* 高さを揃える */
  margin-bottom: var(--space-xl);
  gap: var(--space-sm);
  --search-element-height: 40px; /* 高さを定義 (例: 40px) */
}

.search-input { /* input specific class */
  min-width: 200px;
  width: 300px;
  padding: 0 var(--space-md); /* 上下paddingを0にし、heightで制御 */
  height: var(--search-element-height);
  line-height: var(--search-element-height); /* テキストを垂直中央に */
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  box-sizing: border-box; /* paddingとborderをwidth/heightに含める */
}

.search-button { /* button specific class */
  width: 100px;
  padding: 0 var(--space-lg); /* 上下paddingを0にし、heightで制御 */
  height: var(--search-element-height);
  line-height: var(--search-element-height); /* テキストを垂直中央に */
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: 1px solid var(--color-primary); /* ボタンの色に合わせた枠線 */
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  box-sizing: border-box; /* paddingとborderをwidth/heightに含める */
  display: flex; /* 中のテキストを中央揃えにするため */
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

.loading-indicator, .error-message {
  text-align: center;
  margin-top: var(--space-xl);
}
.search-result-wrapper { /* Transition対象のラッパー */
  text-align: center;
  margin-top: var(--space-xl);
}

.result-image { /* 新しいクラス */
  width: 70vw; /* ビューポート幅の70% */
  max-width: 400px; /* 最大幅を制限 (例) */
  height: auto; /* アスペクト比を維持 */
  margin-bottom: var(--space-lg);
  display: block; /* 中央寄せのため */
  margin-left: auto;
  margin-right: auto;
}

.results h2 {
  margin-bottom: var(--space-md);
}

.report-count {
  font-size: 1.2rem;
  /* font-weight: bold; */
  margin-bottom: var(--space-lg);
}

.no-results p { /* 親のpタグのスタイル調整が必要な場合 */
  line-height: 1.6; /* 例: 行間を調整 */
}

.no-reports-highlight { /* 新しいクラス */
  color: var(--color-error); /* または直接 red など */
  font-weight: bold;
}

.highlight-count { /* 新しいクラス */
  color: var(--color-error); /* または直接 red など */
  font-weight: bold;
  font-size: 1.5em; /* 親要素のフォントサイズに対して1.5倍 (調整可能) */
}

.reason-summary {
  margin-top: var(--space-lg);
  text-align: left;
  display: inline-block; /* 中央寄せのため */
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

/* フェードインアニメーション */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px); /* 下から少し移動する */
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.mosaic-active {
  filter: blur(4px);
  user-select: none;
  /* Optionally, add a semi-transparent overlay if blur is not enough */
  /* position: relative; */
}

/* Optional: Style for overlay if needed */
/*
.mosaic-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3); 
  z-index: 1;
}
*/

.login-prompt-mosaic {
  margin-top: var(--space-lg);
  padding: var(--space-lg);
  background-color: var(--color-surface-variant);
  border-radius: var(--border-radius-md);
  text-align: center;
}

.login-prompt-mosaic p {
  margin-bottom: var(--space-md);
  font-size: 0.95rem;
  color: #FFFFFF; /* 白色に変更 */
}

.login-button-promo {
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--color-error); /* 赤色に変更 */
  color: var(--color-on-error); /* テキスト色をエラー色に対するコントラスト色に */
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.login-button-promo:hover {
  background-color: var(--color-error-dark); /* 赤色の濃いバージョンに変更 */
}

.free-limit-reached-message {
  margin-top: var(--space-lg);
  margin-bottom: var(--space-lg);
  padding: var(--space-lg);
  background-color: var(--color-surface); /* Or a slightly different background */
  border: 1px solid var(--color-error);
  border-radius: var(--border-radius-md);
  text-align: center;
}

.free-limit-reached-message .limit-text {
  color: var(--color-error);
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: var(--space-md);
}

/* Styles for the paragraph within the inline prompt */
.login-prompt-inline p {
  margin-bottom: var(--space-md);
  font-size: 0.95rem;
  color: var(--color-on-surface); /* Adjust if parent background changes */
}

/* Button style is already defined by .login-button-promo */


.disclaimer-container {
  margin-top: 0.5rem;
  text-align: center;
}

.disclaimer-text {
  color: rgba(255,255,255,0.7);
  font-size: 0.65rem;
  margin-bottom: 1rem;
}
</style>
