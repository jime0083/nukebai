<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../../firebase'
import { signOut } from 'firebase/auth'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()
const showMenu = ref(false)

const isLoggedIn = computed(() => !!userStore.user)

async function logout() {
  try {
    await signOut(auth) // Use the imported auth directly
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}

function toggleMenu() {
  showMenu.value = !showMenu.value
}

function closeMenu() {
  showMenu.value = false
}
</script>

<template>
  <header class="site-header">
    <div class="container header-container">
      <div class="logo-container">
        <router-link to="/" class="logo">
          <img src="@/assets/images/logo4.png" alt="ヌケバイ ホーム" class="logo-image">
        </router-link>
      </div>
      
      <button class="menu-toggle" @click="toggleMenu" aria-label="メニュー">
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <nav class="main-nav" :class="{ active: showMenu }">
        <ul class="nav-list">
          <li><router-link to="/submit-review" @click="closeMenu">報告</router-link></li>
          <li><router-link to="/search" @click="closeMenu">検索</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/login" @click="closeMenu">ログイン</router-link></li>
          <!-- デスクトップ: アバター+名前クリックでドロップダウン表示 -->
          <li v-if="isLoggedIn" class="user-menu">
            <img v-if="userStore.user && userStore.user.photoURL" :src="userStore.user.photoURL" alt="User Avatar" class="user-avatar" @click="toggleMenu" />
            <span v-if="userStore.user && userStore.user.displayName" class="user-name" @click="toggleMenu">{{ userStore.user.displayName }}</span>
            <div class="dropdown-menu" v-if="showMenu">
              <router-link :to="{ name: 'UserProfile' }" @click="closeMenu">プロフィール</router-link>
              <a href="#" @click.prevent="logout(); closeMenu();">ログアウト</a>
            </div>
          </li>
          <!-- モバイル(ハンバーガー): 報告/検索と同じ並びでフラットに表示 -->
          <li v-if="isLoggedIn" class="mobile-user-link">
            <router-link :to="{ name: 'UserProfile' }" @click="closeMenu">プロフィール</router-link>
          </li>
          <li v-if="isLoggedIn" class="mobile-user-link">
            <a href="#" @click.prevent="logout(); closeMenu();">ログアウト</a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background-color: var(--color-surface);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  height: 70px;
}

.logo-container {
  flex: 1;
}

.logo {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-on-surface);
  text-decoration: none;
  transition: color var(--transition-duration) ease;
}

.logo:hover {
  color: var(--color-primary);
}

.logo-image {
  height: 60px; /* Adjust as needed */
  width: auto;
  display: block;
}

.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  padding: var(--space-sm);
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px 0;
  background-color: var(--color-on-surface);
  transition: transform var(--transition-duration) ease, 
              opacity var(--transition-duration) ease;
}

.main-nav {
  display: flex;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--space-lg);
}

.nav-list li a {
  color: var(--color-on-surface);
  text-decoration: none;
  font-weight: 500;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-sm);
  transition: color var(--transition-duration) ease,
              background-color var(--transition-duration) ease;
}

.nav-list li a:hover {
  color: var(--color-primary);
}

.nav-list li a.router-link-active {
  color: var(--color-primary);
}

.register-button {
  background-color: var(--color-primary);
  color: var(--color-on-primary) !important;
  padding: var(--space-sm) var(--space-md) !important;
  border-radius: var(--border-radius-sm);
}

.register-button:hover {
  background-color: var(--color-primary-hover);
  color: var(--color-on-primary) !important;
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
  border: 1px solid var(--color-surface-variant);
}

.user-name {
  font-weight: 500;
  color: var(--color-on-surface);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--color-surface);
  border: 1px solid var(--color-surface-variant);
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: var(--space-sm);
  z-index: 110; /* Ensure it's above other nav items if overlapping */
  min-width: 120px;
}

.dropdown-menu a {
  display: block;
  padding: var(--space-xs) var(--space-sm);
  color: var(--color-on-surface);
  text-decoration: none;
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem; /* Smaller font for dropdown items */
  white-space: nowrap; /* 「プロフィール」等が折り返さず常に1行で収まるようにする */
}

.dropdown-menu a:hover {
  background-color: var(--color-surface-variant);
  color: var(--color-primary);
}

/* モバイル用のフラットなユーザーリンクはデスクトップでは非表示 */
.mobile-user-link {
  display: none;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
    z-index: 110;
  }

  /* モバイルではアバター+ドロップダウンをやめ、フラットなリンクに切り替える */
  .user-menu {
    display: none;
  }

  .mobile-user-link {
    display: block;
  }
  
  .main-nav {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 250px;
    background-color: var(--color-surface);
    transform: translateX(100%);
    transition: transform var(--transition-duration) ease;
    z-index: 100;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
    padding-top: 70px;
  }
  
  .main-nav.active {
    transform: translateX(0);
  }
  
  .nav-list {
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-lg);
  }
  
  .nav-list li {
    width: 100%;
  }
  
  .nav-list li a {
    display: block;
    padding: var(--space-sm);
  }
  
  .active .menu-toggle span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 6px);
  }
  
  .active .menu-toggle span:nth-child(2) {
    opacity: 0;
  }
  
  .active .menu-toggle span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -6px);
  }
}
</style>