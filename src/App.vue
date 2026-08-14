<script setup>
import { onMounted, ref } from 'vue'
import { auth, db } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { useUserStore } from './stores/user'

import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'

const userStore = useUserStore()
const isLoading = ref(true)

onMounted(async () => { // Make onMounted async if needed for top-level await, though onAuthStateChanged callback handles async internally
  // auth is now directly imported
  onAuthStateChanged(auth, async (user) => { // Make the callback async
    if (user) {
      // db is now directly imported
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        // User document exists, merge Auth data with Firestore data
        const firestoreData = docSnap.data();
        userStore.setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || firestoreData.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || firestoreData.photoURL, // Prefer Auth photoURL if available
          role: firestoreData.role || 'user', // Default to 'user' if not set
          subscriptionStatus: firestoreData.subscriptionStatus || 'free',
          points: firestoreData.points || 0,
          reportCount: firestoreData.reportCount || 0,
          searchCount: firestoreData.searchCount || 0,
          // ... any other fields from Firestore
        });
        // Optionally update last login time
        await setDoc(userDocRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      } else {
        // New user or no document, create one in Firestore
        const newUserProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL,
          role: 'user', // Default role
          subscriptionStatus: 'free', // Default subscription
          points: 0,
          reportCount: 0,
          searchCount: 0,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        };
        await setDoc(userDocRef, newUserProfile);
        userStore.setUser(newUserProfile); // Set user store with the new profile
      }
    } else {
      userStore.clearUser()
    }
    isLoading.value = false
  })
})

</script>

<template>
  <div class="app-wrapper">
    <TheHeader />
    <main class="main-content">
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
      <router-view v-else />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: var(--space-md) 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: var(--space-md);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>