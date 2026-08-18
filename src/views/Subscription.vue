<script setup>
// プレミアムプランは当面凍結(Stripe はアダルトコンテンツで利用不可)。
// 課金ページは残し「近日実装予定」の案内のみ表示する(2026-08-14 方針決定)。
// 決済処理・カード入力・クーポン検証・customers への書き込みは全て撤去済み。
</script>

<template>
  <div class="subscription-page">
    <div class="container">
      <div class="coming-soon-card">
        <div class="badge">準備中</div>
        <h2>ヌケバイ プレミアムプラン</h2>
        <p class="lead">プレミアムプランは<strong>近日実装予定</strong>です。</p>
        <p class="desc">
          現在、報告・検索の機能はすべて無料でご利用いただけます。<br />
          プレミアムプランの提供開始まで、いましばらくお待ちください。
        </p>
        <router-link to="/" class="home-link">トップページに戻る</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subscription-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) var(--space-md);
}

.container {
  max-width: 600px;
  width: 100%;
}

.coming-soon-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-surface-variant);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xxl) var(--space-xl);
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.badge {
  display: inline-block;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 999px;
  margin-bottom: var(--space-lg);
}

.coming-soon-card h2 {
  color: var(--color-on-surface);
  margin-bottom: var(--space-lg);
  font-size: 1.6rem;
}

.lead {
  font-size: 1.2rem;
  margin-bottom: var(--space-md);
  color: var(--color-on-surface);
}

.lead strong {
  color: var(--color-primary);
}

.desc {
  color: var(--color-on-surface-variant);
  line-height: 1.8;
  margin-bottom: var(--space-xl);
}

.home-link {
  display: inline-block;
  padding: 12px 28px;
  background-color: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: background-color var(--transition-duration) ease;
}

.home-link:hover {
  background-color: var(--color-primary-hover);
}
</style>
