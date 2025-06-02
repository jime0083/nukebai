<template>
  <div class="app-container">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
    <AgeVerificationModal v-if="showAgeVerification" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import AgeVerificationModal from './components/modals/AgeVerificationModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const showAgeVerification = ref(false)

onMounted(async () => {
  // Check if user has verified age
  const hasVerifiedAge = localStorage.getItem('age-verified')
  if (!hasVerifiedAge) {
    showAgeVerification.value = true
  }
  
  // Initialize auth state
  await authStore.initAuth()
})
</script>

<style lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>