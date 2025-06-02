<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <router-link :to="{ name: 'home' }">
          <h1>{{ $t('appName') }}</h1>
        </router-link>
      </div>
      
      <nav class="nav-menu" :class="{ 'is-active': menuOpen }">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link :to="{ name: 'home' }">ホーム</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'search' }">検索</router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'review-new' }">レビュー投稿</router-link>
          </li>
          <li v-if="authStore.isAdmin" class="nav-item">
            <router-link :to="{ name: 'admin' }">管理</router-link>
          </li>
        </ul>
      </nav>
      
      <div class="auth-menu">
        <template v-if="authStore.isAuthenticated">
          <div class="user-info">
            <button @click="toggleUserMenu" class="user-button">
              <span class="user-name">{{ authStore.userProfile?.displayName }}</span>
              <span v-if="authStore.isPremium" class="premium-badge">P</span>
              <span class="points-badge">{{ authStore.points }} pts</span>
            </button>
            
            <div v-if="userMenuOpen" class="user-dropdown">
              <ul class="user-menu-list">
                <li>
                  <router-link :to="{ name: 'account' }">
                    {{ $t('myAccount') }}
                  </router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'subscription' }">
                    {{ $t('subscription') }}
                  </router-link>
                </li>
                <li>
                  <button @click="logout" class="logout-button">
                    {{ $t('logout') }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link :to="{ name: 'login' }" class="auth-button login">
            {{ $t('login') }}
          </router-link>
          <router-link :to="{ name: 'register' }" class="auth-button register">
            {{ $t('register') }}
          </router-link>
        </template>
      </div>
      
      <button @click="toggleMenu" class="menu-toggle">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const menuOpen = ref(false)
const userMenuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function toggleUserMenu() {
  userMenuOpen.value = !userMenuOpen.value
}

async function logout() {
  try {
    await authStore.logout()
    userMenuOpen.value = false
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  position: relative;
}

.logo {
  a {
    text-decoration: none;
    color: #7E57C2;
  }
  
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }
}

.nav-menu {
  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    display: none;
    
    &.is-active {
      display: block;
    }
  }
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.nav-item {
  margin-right: 1.5rem;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  a {
    color: #333;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
    
    &:hover, &.router-link-active {
      color: #7E57C2;
    }
  }
}

.auth-menu {
  display: flex;
  align-items: center;
}

.auth-button {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &.login {
    color: #7E57C2;
    margin-right: 0.5rem;
    
    &:hover {
      background-color: rgba(126, 87, 194, 0.1);
    }
  }
  
  &.register {
    background-color: #7E57C2;
    color: white;
    
    &:hover {
      background-color: darken(#7E57C2, 10%);
    }
  }
}

.user-info {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.user-name {
  font-weight: 500;
  margin-right: 0.5rem;
}

.premium-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #F44336;
  color: white;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  margin-right: 0.5rem;
}

.points-badge {
  font-size: 0.875rem;
  color: #666;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 200px;
  z-index: 10;
  margin-top: 0.5rem;
  overflow: hidden;
}

.user-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  
  li {
    a, button {
      display: block;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: #333;
      transition: background-color 0.3s ease;
      text-align: left;
      width: 100%;
      border: none;
      background: none;
      font-size: 1rem;
      cursor: pointer;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
  }
}

.logout-button {
  color: #F44336 !important;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 768px) {
    display: block;
  }
  
  .bar {
    display: block;
    width: 24px;
    height: 2px;
    background-color: #333;
    margin: 5px 0;
    transition: all 0.3s ease;
  }
  
  &:hover .bar {
    background-color: #7E57C2;
  }
}
</style>