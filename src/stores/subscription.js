import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFirebaseDb } from '../firebase'
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useUserStore } from './user'

export const useSubscriptionStore = defineStore('subscription', () => {
  const db = getFirebaseDb()
  const userStore = useUserStore()
  
  const subscriptionData = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchSubscription() {
    if (!userStore.user) return null
    
    loading.value = true
    error.value = null
    
    try {
      const subscriptionRef = doc(db, 'subscriptions', userStore.user.uid)
      const docSnap = await getDoc(subscriptionRef)
      
      if (docSnap.exists()) {
        subscriptionData.value = docSnap.data()
        userStore.updateSubscription(subscriptionData.value.status)
      } else {
        subscriptionData.value = null
      }
    } catch (err) {
      console.error('Error fetching subscription:', err)
      error.value = 'サブスクリプション情報の取得中にエラーが発生しました。'
    } finally {
      loading.value = false
    }
  }
  
  async function upgradeSubscription(paymentInfo) {
    if (!userStore.user) return false
    
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would involve Stripe API calls
      // For demo purposes, we'll simulate a successful payment
      
      const newSubscription = {
        userId: userStore.user.uid,
        stripeCustomerId: 'cus_' + Math.random().toString(36).substr(2, 9),
        status: 'premium',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        pointsUsed: paymentInfo.usePoints || 0,
        updatedAt: serverTimestamp()
      }
      
      await setDoc(doc(db, 'subscriptions', userStore.user.uid), newSubscription)
      
      // Update user's subscription status
      await updateDoc(doc(db, 'users', userStore.user.uid), {
        subscriptionStatus: 'premium',
        subscriptionEnd: newSubscription.currentPeriodEnd,
        points: (userStore.points || 0) - (paymentInfo.usePoints || 0)
      })
      
      userStore.updateSubscription('premium')
      if (paymentInfo.usePoints) {
        userStore.updatePoints((userStore.points || 0) - paymentInfo.usePoints)
      }
      
      subscriptionData.value = newSubscription
      return true
    } catch (err) {
      console.error('Error upgrading subscription:', err)
      error.value = 'サブスクリプションのアップグレード中にエラーが発生しました。'
      return false
    } finally {
      loading.value = false
    }
  }
  
  return {
    subscriptionData,
    loading,
    error,
    fetchSubscription,
    upgradeSubscription
  }
})