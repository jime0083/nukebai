<script setup>
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>ヌケバイ</h3>
          <p>ヌけないアダルト動画を見て無駄にするお金と時間をゼロにする</p>
        </div>
        
        <div class="footer-section">
          <h4>リンク</h4>
          <ul>
            <li><router-link to="/">ホーム</router-link></li>
            <li v-if="userStore.user"><router-link to="/submit-review">レビュー投稿</router-link></li>
            <li v-if="userStore.user"><router-link to="/profile">マイページ</router-link></li>
            <li v-else><router-link to="/login">ログイン</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>サービス</h4>
          <ul>
            <li><router-link to="/subscription">プレミアムプラン</router-link></li>
            <li v-if="userStore.isLoggedIn"><router-link to="/contract-management">契約内容の変更</router-link></li>
            <li><a href="#">ポイントシステム</a></li>
            <li><a href="#">Chrome拡張機能</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>法的情報</h4>
          <ul>
            <li><router-link to="/terms">利用規約</router-link></li>
            <li><router-link to="/privacy">プライバシーポリシー</router-link></li>
            <li><a href="#">特定商取引法に基づく表記</a></li>
          </ul>
        </div>
      </div>
      
      <div class="copyright">
        <p>&copy; {{ currentYear }} ヌけないアダルト動画レビュー All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: var(--color-surface);
  padding: var(--space-xl) 0;
  margin-top: var(--space-xxl);
  border-top: 1px solid var(--color-surface-variant);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.footer-section h3 {
  color: var(--color-primary);
  font-size: 1.3rem;
  margin-bottom: var(--space-md);
}

.footer-section h4 {
  font-size: 1.1rem;
  margin-bottom: var(--space-md);
  color: var(--color-on-surface);
}

.footer-section p {
  color: var(--color-on-surface-variant);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: var(--space-sm);
}

.footer-section ul li a {
  color: var(--color-on-surface-variant);
  text-decoration: none;
  transition: color var(--transition-duration) ease;
}

.footer-section ul li a:hover {
  color: var(--color-primary);
}

.copyright {
  text-align: center;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-surface-variant);
}

.copyright p {
  color: var(--color-on-surface-variant);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
  
  .footer-section {
    text-align: center;
  }
}
</style>