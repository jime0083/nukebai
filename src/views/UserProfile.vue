<template>
  <div class="profile-page">
    <div v-if="user" class="profile-content">
      <div class="profile-header">
        <img v-if="user.photoURL" :src="user.photoURL" alt="User Avatar" class="profile-avatar">
        <div v-else class="profile-avatar-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </div>
        <h1>{{ user.displayName ? user.displayName : 'ユーザー' }}のプロフィール</h1>
      </div>
      <div class="profile-details">
        <p><strong>メールアドレス:</strong> {{ user.email }}</p>
        <div class="points-section">
          <p><strong>現在の獲得ポイント:</strong> <span class="highlight-stat">{{ user.points !== undefined ? user.points : 'N/A' }}</span></p>
          <button @click="handleUsePoints" class="use-points-button">ポイントを利用する</button>
        </div>
        <p><strong>現在の報告回数:</strong> <span class="highlight-stat">{{ user.reportCount !== undefined ? user.reportCount : 'N/A' }}</span></p>
        <p><strong>現在の検索回数:</strong> <span class="highlight-stat">{{ user.searchCount !== undefined ? user.searchCount : 'N/A' }}</span></p>

        <!-- アンケートボタンセクション - 3回以上検索とレポートを使用したユーザーにのみ表示 -->
        <div v-if="showSurveyButton" class="survey-section">
          <h3>アンケートにご協力ください</h3>
          <p>サービス改善のため、あなたのご意見をお聞かせください。</p>
          <button @click="handleSurvey" class="survey-button">アンケートに答える</button>
        </div>

        <div class="coupon-section">
          <h3>クーポンコードを利用</h3>
          <div class="coupon-input-group">
            <input type="text" v-model="couponCode" placeholder="クーポンコードを入力" class="coupon-input">
            <button @click="handleRedeemCoupon" class="redeem-coupon-button">利用</button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading-message">
      <p>ユーザー情報を読み込んでいます...</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'; // ref をインポート
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const user = computed(() => userStore.user);
const couponCode = ref(''); // クーポンコード入力用の ref

// 3回以上検索とレポートを使用したユーザーにのみアンケートボタンを表示
const showSurveyButton = computed(() => {
  if (!user.value) return false;
  return (user.value.searchCount >= 3 && user.value.reportCount >= 3);
});

const handleUsePoints = () => {
  // TODO: Implement point usage logic (e.g., show popup)
  alert('ポイント利用機能は現在準備中です。');
};

const handleRedeemCoupon = () => {
  if (!couponCode.value.trim()) {
    alert('クーポンコードを入力してください。');
    return;
  }
  // TODO: Implement coupon redemption logic
  alert(`クーポンコード「${couponCode.value}」の利用機能は現在準備中です。`);
  couponCode.value = ''; // 入力フィールドをクリア
};

// アンケートボタンがクリックされた時の処理
const handleSurvey = () => {
  // Googleフォームのアンケートページに移動
  const surveyUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfSNF-K52OLKclkctRWiZuAAuIM7xNi1jZCNbepRO4v56ruBA/viewform?usp=header';
  window.open(surveyUrl, '_blank'); // 新しいタブでアンケートを開く
};

</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
}


.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.profile-avatar-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
  background-color: #e0e0e0; /* Light grey placeholder background */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #757575; /* Icon color */
}

.profile-avatar-placeholder svg {
  width: 30px;
  height: 30px;
}

.profile-header h1 {
  font-size: 1.8em;
  margin: 0; /* Reset margin for h1 inside flex container */
}

.profile-details p {
  margin-bottom: 10px;
  font-size: 1.1em;
}

.points-section {
  margin-bottom: 10px; /* Matches p margin for consistent spacing */
}

.points-section p {
  margin-bottom: 8px; /* Space between points display and button */
}

.use-points-button {
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border: 1px solid var(--color-primary); /* Added border for consistency */
  padding: 8px 15px;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.use-points-button:hover {
  background-color: white; /* Assuming a white background is desired */
  color: black; /* Assuming black text is desired */
  border: 1px solid var(--color-primary);
}

.profile-details strong {
  margin-right: 8px;
}

.highlight-stat {
  color: red;
  font-size: 1.3em; /* Relative to parent p's font-size */
  font-weight: bold;
}

.coupon-section {
  margin-top: 20px; /* Space above the coupon section */
  padding-top: 15px;
  /* border-top: 1px solid #eee; */ /* Separator line removed */
}

.coupon-section h3 {
  margin-bottom: 10px;
  font-size: 1.2em;
}

.coupon-input-group {
  display: flex;
  align-items: center;
  gap: 10px; /* Space between input and button */
}

.coupon-input {
  width: 200px;
  height: 38px;
  padding: 0 10px; /* Vertical padding 0, horizontal 10px */
  line-height: 36px; /* height (38px) - 1px top border - 1px bottom border */
  border: 1px solid #ccc;
  border-radius: var(--border-radius-md);
  font-size: 16px; /* Explicit font size */
  box-sizing: border-box;
  margin-bottom: 0 !important;
}

.redeem-coupon-button {
  height: 38px;
  padding: 0 15px; /* Vertical padding 0, horizontal 15px */
  background-color: var(--color-secondary, #4CAF50);
  color: var(--color-on-secondary, white);
  border: 1px solid var(--color-secondary, #4CAF50);
  border-radius: var(--border-radius-md);
  font-size: 16px; /* Explicit font size */
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.redeem-coupon-button:hover {
  background-color: var(--color-secondary-dark, #367c39);
}

.loading-message {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
}

/* アンケートセクションのスタイル */
.survey-section {
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-primary, #007bff);
}

.survey-section h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: var(--color-primary, #007bff);
}

.survey-section p {
  margin-bottom: 15px;
  font-size: 0.95em;
  color: #555;
}

.survey-button {
  background-color: var(--color-primary, #007bff);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.survey-button:hover {
  background-color: var(--color-primary-dark, #0056b3);
}
</style>
