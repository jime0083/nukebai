import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore'
import { useUserStore } from './user'

export const useSubscriptionStore = defineStore('subscription', () => {
  const userStore = useUserStore()

  const subscriptionData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  let unsubscribe = null; // To hold the onSnapshot listener

  async function fetchSubscription() {
    if (!userStore.user) return null
    if (unsubscribe) unsubscribe(); // Stop any previous listener

    loading.value = true
    error.value = null

    try {
      const subscriptionsRef = collection(db, 'customers', userStore.user.uid, 'subscriptions');
      const q = query(subscriptionsRef, where('status', 'in', ['trialing', 'active']));

      // Use onSnapshot to listen for real-time updates
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          subscriptionData.value = null;
          userStore.updateSubscription(null);
          loading.value = false;
          return;
        }
        
        // Normally there is only one active subscription
        const sub = querySnapshot.docs[0].data();
        subscriptionData.value = {
          id: querySnapshot.docs[0].id,
          ...sub
        };
        userStore.updateSubscription(sub.status);
        loading.value = false;

      }, (err) => {
        console.error('Error in subscription snapshot:', err);
        error.value = 'サブスクリプション情報の取得中にエラーが発生しました。';
        loading.value = false;
      });

    } catch (err) {
      console.error('Error setting up subscription fetch:', err);
      error.value = 'サブスクリプション情報の取得設定中にエラーが発生しました。';
      loading.value = false;
    }
  }

  return {
    subscriptionData,
    loading,
    error,
    fetchSubscription
  }
})