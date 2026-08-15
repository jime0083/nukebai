<template>
  <section class="about-nukebai-section">
    <div class="about-nukebai-content-wrapper">
      <div class="about-content-left">
        <h2 class="section-title">ヌケバイってなに？</h2>
        <div class="about-text-column increased-spacing">
          <p class="normal-text">
            週3回オナニーする人は、毎週平均2.7本ヌけない動画を見て<br /><br /><span
              class="highlight-red large-text bold-text animate-bg"
              ref="wasteText"
              >2,700円と2.25時間をムダ</span
            ><span class="normal-text">にしています。</span>
          </p>
          <p class="normal-text">ヌケバイは、その時間とお金のムダをなくすサービスです。</p>
        </div>
      </div>
      <div class="about-content-right">
        <img :src="negMan4" alt="説明画像1" class="image-1" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue';
import negMan4 from '../../assets/images/neg-man4.png';

const wasteText = ref(null);

onMounted(() => {
  nextTick(() => setupAnimationObserver());
});

function setupAnimationObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-bg-active');
        }
      });
    },
    { root: null, rootMargin: '0px', threshold: 0.5 }
  );
  if (wasteText.value) observer.observe(wasteText.value);
}
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

.about-nukebai-section {
  margin-bottom: 0;
}

.about-nukebai-content-wrapper {
  display: flex;
  gap: var(--space-xl);
  align-items: stretch;
}

.about-content-left {
  flex: 1.5;
  display: flex;
  flex-direction: column;
}

.about-nukebai-section h2 {
  margin-bottom: var(--space-md);
}

.about-content-right {
  flex: 0.7;
  display: flex;
}

.about-text-column {
  background-color: #121212;
  color: #e0e0e0;
  padding: 15px 0;
  border-radius: var(--border-radius-lg);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.about-text-column p {
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: var(--space-md);
}

.about-text-column p:last-child {
  margin-bottom: 0;
}

.image-1 {
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius-md);
  object-fit: cover;
}

/* Animation for text background */
.animate-bg {
  position: relative;
  z-index: 1;
  padding: 3px 8px;
  border-radius: 4px;
  overflow: hidden;
}

.animate-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background-color: var(--color-primary);
  z-index: -1;
  transition: width 1s ease-out;
}

.animate-bg-active::before {
  width: 100%;
}

.animate-bg.highlight-red {
  color: white;
}

.animate-bg.highlight-red::before {
  background-color: var(--color-primary);
}

.large-text {
  font-size: 2rem;
}

.normal-text {
  font-size: 1.2rem !important;
}

.bold-text {
  font-weight: bold;
}

@media (max-width: 1024px) {
  .about-nukebai-section .about-content-right {
    display: none;
  }

  .about-nukebai-section .about-content-left {
    padding-right: 0;
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
  }

  .about-nukebai-section .about-text-column {
    text-align: left;
    max-width: 100%;
    width: 100%;
  }

  .about-nukebai-content-wrapper {
    flex-direction: column;
    width: 100%;
  }

  .section-title {
    text-align: left;
    font-size: 1.8rem;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .about-nukebai-content-wrapper {
    flex-direction: column;
  }
  .about-content-right {
    order: -1;
    align-items: center;
    margin-top: 0;
    margin-bottom: var(--space-lg);
  }
  .image-1 {
    max-width: 180px;
    width: 100%;
    height: auto;
  }
}

@media (max-width: 640px) {
  .section-title {
    font-size: 1.3rem;
    padding: 0 10px;
    margin-top: var(--space-md);
  }

  .about-nukebai-section {
    padding: var(--space-md);
  }

  .about-text-column p {
    font-size: 1.2rem;
    margin-bottom: 20px;
    line-height: 1.8;
  }

  .about-text-column.increased-spacing p {
    font-size: 1.4rem;
    margin-bottom: 25px;
    line-height: 2;
  }

  .large-text {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .section-title {
    margin-bottom: 15px;
  }
}

@media (max-width: 420px) {
  .section-title {
    font-size: 1.2rem;
  }

  .about-text-column p {
    font-size: 0.85rem;
  }
}
</style>
