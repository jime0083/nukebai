<template>
  <section class="hero-section" :class="variant === 'top2' ? 'top-page-top2' : 'top-page-top'">
    <div class="container">
      <div class="hero-content">
        <!-- catchphrase は静的な信頼済みHTML(<br>や .highlight-red を含む)。
             v-html で子コンポーネントのスコープに描画し、:deep で .highlight-red を装飾する -->
        <h1 class="main-catchphrase" v-html="catchphrase"></h1>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  catchphrase: { type: String, required: true },
  variant: { type: String, default: 'top' },
});
</script>

<style scoped>
.hero-section {
  background-image: url('../../assets/images/neg-man9.png');
  background-size: cover;
  background-position: center;
  padding: var(--space-xxl) 0;
  margin-bottom: var(--space-xxl);
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.hero-content {
  text-align: left;
  position: relative;
  z-index: 2;
  animation: fadeInBottom 1s ease-out 0.3s forwards;
  opacity: 0;
}

.hero-content h1.main-catchphrase {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 0, 0, 0.5);
  line-height: 1.3;
  margin: 0;
  padding: var(--space-lg) 0;
}

.hero-content h1.main-catchphrase :deep(.highlight-red) {
  color: var(--color-accent);
  font-size: 4rem;
  font-weight: bolder;
}

.hero-section.top-page-top2 {
  background-image: url('../../assets/images/neg-man8.png');
  margin-top: var(--space-xl);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
  color: var(--color-primary);
}

@keyframes fadeInBottom {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .hero-section.top-page-top .main-catchphrase,
  .hero-section.top-page-top2 .main-catchphrase {
    font-size: 2rem;
    line-height: 1.4;
    width: 100%;
    max-width: 100%;
  }

  .hero-section.top-page-top .main-catchphrase :deep(.highlight-red),
  .hero-section.top-page-top2 .main-catchphrase :deep(.highlight-red) {
    font-size: 3.2rem;
  }
}

@media (max-width: 768px) {
  .hero-content h1.main-catchphrase :deep(.highlight-red) {
    font-size: 2rem;
  }

  .hero-content h1.main-catchphrase {
    font-size: 1.3rem;
  }

  .hero-section {
    padding: var(--space-xl) 0;
  }

  h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 640px) {
  .hero-section.top-page-top,
  .hero-section.top-page-top2 {
    padding: var(--space-lg) 0;
  }

  .hero-section.top-page-top .main-catchphrase,
  .hero-section.top-page-top2 .main-catchphrase {
    font-size: 1.5rem;
    line-height: 1.5;
    padding: 0 10px;
    margin-bottom: 0;
  }

  .hero-section.top-page-top .main-catchphrase :deep(.highlight-red),
  .hero-section.top-page-top2 .main-catchphrase :deep(.highlight-red) {
    font-size: 2.2rem;
  }
}

@media (max-width: 420px) {
  .hero-section.top-page-top .main-catchphrase,
  .hero-section.top-page-top2 .main-catchphrase {
    font-size: 1.3rem;
  }

  .hero-section.top-page-top .main-catchphrase :deep(.highlight-red),
  .hero-section.top-page-top2 .main-catchphrase :deep(.highlight-red) {
    font-size: 1.8rem;
  }
}
</style>
