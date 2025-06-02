import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getFirebaseAuth, 
  getFirebaseDb 
} from '../services/firebase'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userProfile = ref(null)
  const loading = ref(true)
  const error = ref(null)
  
  const isAuthenticated = computed(() => !!user.value)
  const isPremium = computed(() => userProfile.value?.subscriptionStatus === 'premium')
  const isAdmin = computed(() => userProfile.value?.role === 'admin' || userProfile.value?.role === 'developer')
  const points = computed(() => userProfile.value?.points || 0)
  
  // Initialize auth
  async function initAuth() {
    const auth = getFirebaseAuth()
    
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
          user.value = authUser
          await fetchUserProfile(authUser.uid)
        } else {
          user.value = null
          userProfile.value = null
        }
        
        loading.value = false
        resolve(user.value)
      })
    })
  }
  
  // Fetch user profile from Firestore
  async function fetchUserProfile(uid) {
    try {
      const db = getFirebaseDb()
      const userRef = doc(db, 'users', uid)
      const userSnapshot = await getDoc(userRef)
      
      if (userSnapshot.exists()) {
        userProfile.value = userSnapshot.data()
      } else {
        userProfile.value = null
      }
    } catch (err) {
      console.error('Error fetching user profile:', err)
      error.value = err.message
    }
  }
  
  // Register with email and password
  async function registerWithEmail(email, password, displayName) {
    try {
      loading.value = true
      error.value = null
      
      const auth = getFirebaseAuth()
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user profile in Firestore
      const db = getFirebaseDb()
      await setDoc(doc(db, 'users', newUser.uid), {
        uid: newUser.uid,
        email,
        displayName: displayName || email.split('@')[0],
        createdAt: serverTimestamp(),
        subscriptionStatus: 'free',
        points: 0,
        totalPosts: 0,
        freeUsageCount: 0,
        role: 'user',
        isUnlimited: false
      })
      
      user.value = newUser
      await fetchUserProfile(newUser.uid)
      
      return newUser
    } catch (err) {
      console.error('Registration error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Login with email and password
  async function loginWithEmail(email, password) {
    try {
      loading.value = true
      error.value = null
      
      const auth = getFirebaseAuth()
      const { user: authUser } = await signInWithEmailAndPassword(auth, email, password)
      
      user.value = authUser
      await fetchUserProfile(authUser.uid)
      
      return authUser
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Login with Google
  async function loginWithGoogle() {
    try {
      loading.value = true
      error.value = null
      
      const auth = getFirebaseAuth()
      const provider = new GoogleAuthProvider()
      const { user: authUser } = await signInWithPopup(auth, provider)
      
      // Check if user exists in Firestore
      const db = getFirebaseDb()
      const userRef = doc(db, 'users', authUser.uid)
      const userSnapshot = await getDoc(userRef)
      
      // If user doesn't exist, create profile
      if (!userSnapshot.exists()) {
        await setDoc(userRef, {
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName || authUser.email.split('@')[0],
          createdAt: serverTimestamp(),
          subscriptionStatus: 'free',
          points: 0,
          totalPosts: 0,
          freeUsageCount: 0,
          role: 'user',
          isUnlimited: false
        })
      }
      
      user.value = authUser
      await fetchUserProfile(authUser.uid)
      
      return authUser
    } catch (err) {
      console.error('Google login error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Logout
  async function logout() {
    try {
      loading.value = true
      error.value = null
      
      const auth = getFirebaseAuth()
      await signOut(auth)
      
      user.value = null
      userProfile.value = null
      
      return true
    } catch (err) {
      console.error('Logout error:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    user,
    userProfile,
    loading,
    error,
    isAuthenticated,
    isPremium,
    isAdmin,
    points,
    initAuth,
    fetchUserProfile,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout
  }
})