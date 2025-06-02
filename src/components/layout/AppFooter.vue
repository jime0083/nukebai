<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-logo">
          <h2>{{ $t('appName') }}</h2>
          <p>{{ $t('tagline') }}</p>
        </div>
        
        <div class="footer-links">
          <div class="link-group">
            <h3>サービス</h3>
            <ul>
              <li><router-link :to="{ name: 'home' }">ホーム</router-link></li>
              <li><router-link :to="{ name: 'search' }">検索</router-link></li>
              <li><router-link :to="{ name: 'review-new' }">レビュー投稿</router-link></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h3>アカウント</h3>
            <ul>
              <li><router-link :to="{ name: 'login' }">{{ $t('login') }}</router-link></li>
              <li><router-link :to="{ name: 'register' }">{{ $t('register') }}</router-link></li>
              <li><router-link :to="{ name: 'subscription' }">{{ $t('subscription') }}</router-link></li>
            </ul>
          </div>
          
          <div class="link-group">
            <h3>法的情報</h3>
            <ul>
              <li><a href="#">{{ $t('terms') }}</a></li>
              <li><a href="#">{{ $t('privacy') }}</a></li>
              <li><a href="#">{{ $t('contact') }}</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p class="copyright">© {{ currentYear }} {{ $t('appName') }}. All rights reserved.</p>
        <p class="age-notice">このサービスは18歳以上を対象としています。</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped>
.app-footer {
  background-color: #333;
  color: white;
  padding: 3rem 1rem 1.5rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-logo {
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
  }
  
  p {
    font-size: 0.875rem;
    opacity: 0.7;
    max-width: 300px;
  }
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
  
  @media (min-width: 576px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.link-group {
  h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 1rem;
    color: #7E57C2;
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    
    li {
      margin-bottom: 0.5rem;
      
      a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        transition: color 0.3s ease;
        font-size: 0.875rem;
        
        &:hover {
          color: white;
        }
      }
    }
  }
}

.footer-bottom {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  p {
    font-size: 0.75rem;
    opacity: 0.5;
    margin: 0;
  }
}
</style>