<template>
  <div class="submit-review-page">
    <div class="container">
      <div class="submit-review-container">
        <h2>レビュー投稿</h2>
        
        <div v-if="userStore.subscriptionStatus === 'premium'" class="premium-badge">
          <span>プレミアム会員</span>
        </div>
        
        <div class="points-info" v-if="userStore.user">
          <p>現在のポイント: <span class="points">{{ userStore.points || 0 }}</span></p>
          <p class="points-explainer">
            レビューを投稿すると20〜30ポイントが付与されます。
            ポイントはプレミアムサブスクリプションの支払いに利用できます。
          </p>
        </div>
        
        <ReviewForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user'
import ReviewForm from '../components/reviews/ReviewForm.vue'

const userStore = useUserStore()
</script>

<style scoped>
.submit-review-page {
  min-height: calc(100vh - 200px);
}

.submit-review-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl) 0;
  position: relative;
}

h2 {
  margin-bottom: var(--space-xl);
  position: relative;
  display: inline-block;
}

h2:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: var(--color-primary);
}

.premium-badge {
  position: absolute;
  top: var(--space-xl);
  right: 0;
  background-color: var(--color-accent);
  color: var(--color-on-accent);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  font-weight: 500;
}

.points-info {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
  border: 1px solid var(--color-surface-variant);
}

.points {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--color-primary);
}

.points-explainer {
  margin-top: var(--space-sm);
  font-size: 0.9rem;
  color: var(--color-on-surface-variant);
}

@media (max-width: 768px) {
  .premium-badge {
    position: relative;
    top: auto;
    right: auto;
    display: inline-block;
    margin-bottom: var(--space-lg);
  }
}
</style>