<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // 5秒後にホームページにリダイレクト
  setTimeout(() => {
    router.push('/');
  }, 5000);
});
</script>

<template>
  <div class="success-page">
    <div class="container">
      <div class="success-card">
        <div class="success-icon">✓</div>
        <h2>サブスクリプション登録が完了しました！</h2>
        <p>おめでとうございます！NukeBAIのプレミアム機能がご利用いただけるようになりました。</p>
        <p class="redirect-text">5秒後に自動的にホームページに移動します...</p>
        <router-link to="/" class="btn">ホームページへ</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.success-page {
  padding: 4rem 2rem;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.success-card {
  background-color: #f0fdf4;
  border-radius: 8px;
  padding: 3rem 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #86efac;
}

.success-icon {
  background-color: #10b981;
  color: white;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 2rem;
}

h2 {
  color: #10b981;
  margin-bottom: 1.5rem;
}

p {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 1rem;
}

.redirect-text {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 2rem 0;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #059669;
}
</style>