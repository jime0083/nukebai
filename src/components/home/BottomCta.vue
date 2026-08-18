<template>
  <div class="fixed-bottom-cta-container">
    <router-link to="/login" class="fixed-bottom-try-free-button"> 無料で使ってみる </router-link>
  </div>
</template>

<script setup></script>

<style scoped>
@keyframes slideAndFadeInFromBottom {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fixed-bottom-cta-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  transform: translateY(100%);
  animation: slideAndFadeInFromBottom 0.7s 0.2s ease-out forwards;
  box-sizing: border-box;
}

.fixed-bottom-try-free-button {
  background-color: var(--color-primary);
  color: white;
  padding: 15px 30px;
  border-radius: var(--border-radius-lg, 8px);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.fixed-bottom-try-free-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .fixed-bottom-cta-container {
    padding: 12px;
  }

  .fixed-bottom-try-free-button {
    padding: 10px 20px;
    font-size: 0.95rem;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }
}
</style>
