<template>
  <div class="submit-review-page">
    <div class="container">
      <div class="submit-review-container">
        <h2>ヌけなかったアダルト動画の報告</h2>
        
        
        <div class="points-info" v-if="userStore.user">
          <p>現在のポイント: <span class="points">{{ userStore.points || 0 }}</span></p>
          <p class="points-explainer">
            レビューを投稿するとポイントが付与されます。
            ポイントは今後の機能で利用できる予定です。
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
  font-size: 2rem;
  color: white;
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


@media (max-width: 1024px) {
  h2 {
    font-size: 1.8rem;
  }
}

@media (max-width: 640px) {
  h2 {
    font-size: 1.3rem;
  }
}
</style>