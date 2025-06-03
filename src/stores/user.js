import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const subscriptionStatus = ref('free')
  const points = ref(0)
  const freeUsageCount = ref(0)
  const lastFreeUsage = ref(null)
  const isUnlimited = ref(false)
  const role = ref(null) // or 'user' as a default

  function setUser(userData) {
    user.value = userData
    role.value = userData && userData.role ? userData.role : 'user' // Set role, default to 'user'
    // Potentially fetch subscriptionStatus, points, etc., here if not part of initial userData
  }

  function clearUser() {
    user.value = null
    subscriptionStatus.value = 'free'
    points.value = 0
    freeUsageCount.value = 0
    lastFreeUsage.value = null
    isUnlimited.value = false
    role.value = null // or 'user'
  }

  function updateSubscription(status) {
    subscriptionStatus.value = status
  }

  function updatePoints(newPoints) {
    points.value = newPoints
  }

  function incrementFreeUsage() {
    freeUsageCount.value++
    lastFreeUsage.value = new Date()
  }

  function setUnlimited(status) {
    isUnlimited.value = status
  }

  const isAdmin = computed(() => role.value === 'admin')

  return {
    user,
    subscriptionStatus,
    points,
    freeUsageCount,
    lastFreeUsage,
    isUnlimited,
    setUser,
    clearUser,
    updateSubscription,
    updatePoints,
    incrementFreeUsage,
    setUnlimited,
    role, // expose role
    isAdmin // expose isAdmin
  }
})