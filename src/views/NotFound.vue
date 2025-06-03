<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.go(-1)
}
</script>

<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>ページが見つかりません</h2>
        <p>お探しのページは存在しないか、移動した可能性があります。</p>
        
        <div class="not-found-actions">
          <button @click="goBack" class="back-button">前のページに戻る</button>
          <router-link to="/" class="primary">トップページへ</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-content {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--space-xxl);
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 6rem;
  color: var(--color-primary);
  margin-bottom: var(--space-md);
  line-height: 1;
}

h2 {
  font-size: 2rem;
  margin-bottom: var(--space-lg);
}

p {
  margin-bottom: var(--space-xl);
  color: var(--color-on-surface-variant);
}

.not-found-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
}

.back-button {
  background-color: transparent;
  border: 1px solid var(--color-on-surface-variant);
  color: var(--color-on-surface-variant);
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
  .not-found-content {
    padding: var(--space-xl);
  }
  
  h1 {
    font-size: 4rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .not-found-actions {
    flex-direction: column;
  }
  
  .not-found-actions button,
  .not-found-actions a {
    width: 100%;
  }
}
</style>