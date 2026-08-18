<script setup>
import { onMounted } from 'vue'
import { useAuthState } from './composables/useAuthState'

import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'

// 認証状態の初期化は composable に集約(Work 6-3)
const { isLoading, init } = useAuthState()

onMounted(() => {
  init()
})
</script>

<template>
  <div class="app-wrapper">
    <TheHeader />
    <main class="main-content">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">読み込み中...</p>
      </div>
      <router-view v-else />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: var(--space-md) 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

/* ローディング文言は欧文サンセリフスタック(仕様書 6-2) */
.loading-text {
  font-family: var(--font-sans);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: var(--space-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>