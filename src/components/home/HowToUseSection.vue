<template>
  <section class="how-to-use-section">
    <h2 class="section-title">{{ title }}</h2>
    <div class="how-to-use-grid">
      <div v-for="(card, i) in cards" :key="i" class="how-to-use-card">
        <img :src="card.img" :alt="card.alt" />
        <h3>{{ card.heading }}</h3>
        <!-- 段落は <br> を含むため v-html。<p> 自体はテンプレート要素なのでスコープCSSが効く -->
        <p v-for="(para, j) in card.body" :key="j" :class="para.cls" v-html="para.html"></p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  cards: { type: Array, required: true },
});
</script>

<style scoped>
.section-title {
  font-size: 2rem;
  margin-bottom: var(--space-lg);
  color: white;
  text-align: left;
  font-weight: bold;
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

.how-to-use-section {
  padding: var(--space-xl) 0;
}

.how-to-use-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
  margin-top: var(--space-lg);
  justify-content: center;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.how-to-use-card {
  background-color: var(--color-surface);
  padding: var(--space-md);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-elevation-2);
  text-align: left;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
}

.how-to-use-card img {
  width: 100%;
  height: auto;
  object-fit: contain;
  margin-bottom: var(--space-sm);
}

.how-to-use-card h3 {
  font-size: 1.25rem;
  margin-bottom: var(--space-sm);
  color: var(--color-on-surface);
}

.how-to-use-card p {
  font-size: 0.9rem;
  color: var(--color-on-surface-variant);
  line-height: 1.6;
  flex-grow: 1;
}

.disclaimer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.55rem;
  margin-top: 0.5rem;
  text-align: center;
}

.text-left {
  text-align: left;
}

@media (max-width: 1024px) {
  .section-title {
    text-align: left;
    font-size: 1.8rem;
    width: 100%;
  }

  .how-to-use-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    width: 100%;
  }

  .how-to-use-card {
    width: 100%;
    max-width: 100%;
  }

  .how-to-use-card img {
    max-width: 100%;
    height: auto;
  }
}

@media (max-width: 640px) {
  .section-title {
    font-size: 1.3rem;
    padding: 0 10px;
    margin-top: var(--space-md);
  }

  .how-to-use-section {
    padding: var(--space-md) 0;
  }

  .how-to-use-grid {
    gap: var(--space-md);
    margin-top: var(--space-md);
    padding: 0 10px;
  }

  .how-to-use-card {
    padding: var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .how-to-use-card h3 {
    font-size: 1.1rem;
    margin-top: 10px;
  }

  .how-to-use-card p {
    font-size: 0.85rem;
    margin-bottom: 5px;
  }
}

@media (max-width: 576px) {
  .how-to-use-card {
    margin-bottom: 15px;
  }

  .section-title {
    margin-bottom: 15px;
  }
}

@media (max-width: 420px) {
  .section-title {
    font-size: 1.2rem;
  }

  .how-to-use-card h3 {
    font-size: 1rem;
  }

  .how-to-use-card p {
    font-size: 0.8rem;
  }
}
</style>
