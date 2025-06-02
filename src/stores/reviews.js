import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getFirebaseDb, getFirebaseStorage } from '../services/firebase'
import { useAuthStore } from './auth'
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  updateDoc,
  increment
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

export const useReviewsStore = defineStore('reviews', () => {
  const authStore = useAuthStore()
  
  const reviews = ref([])
  const currentReview = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const categories = ref([])
  
  // Computed
  const userReviews = computed(() => {
    if (!authStore.user) return []
    return reviews.value.filter(review => review.authorId === authStore.user.uid)
  })
  
  // Get reason categories
  async function getReasonCategories() {
    try {
      loading.value = true
      error.value = null
      
      const db = getFirebaseDb()
      const categoriesRef = collection(db, 'reason_categories')
      const q = query(categoriesRef, where('isActive', '==', true), orderBy('sortOrder'))
      
      const querySnapshot = await getDocs(q)
      const categoriesData = []
      
      querySnapshot.forEach(doc => {
        categoriesData.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      categories.value = categoriesData
      return categoriesData
    } catch (err) {
      console.error('Error fetching categories:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Create review
  async function createReview(reviewData, imageFile = null) {
    try {
      loading.value = true
      error.value = null
      
      if (!authStore.user) {
        throw new Error('You must be logged in to create a review')
      }
      
      const db = getFirebaseDb()
      
      // Check if review for this video already exists
      const reviewsRef = collection(db, 'posts')
      const q = query(reviewsRef, where('videoId', '==', reviewData.videoId))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        throw new Error('A review for this video already exists')
      }
      
      // Upload image if provided
      let imageUrl = null
      if (imageFile) {
        const storage = getFirebaseStorage()
        const imageRef = storageRef(storage, `review-images/${authStore.user.uid}/${uuidv4()}`)
        await uploadBytes(imageRef, imageFile)
        imageUrl = await getDownloadURL(imageRef)
      }
      
      // Create review document
      const newReview = {
        authorId: authStore.user.uid,
        videoId: reviewData.videoId,
        videoTitle: reviewData.videoTitle,
        reasons: reviewData.reasons,
        imageUrl,
        createdAt: serverTimestamp(),
        reportCount: 0,
        negativeReviewCount: 0,
        source: 'web'
      }
      
      const docRef = await addDoc(collection(db, 'posts'), newReview)
      
      // Update user's points and post count
      const userRef = doc(db, 'users', authStore.user.uid)
      
      // Random points between 20-30
      const pointsToAdd = Math.floor(Math.random() * 11) + 20
      
      await updateDoc(userRef, {
        points: increment(pointsToAdd),
        totalPosts: increment(1)
      })
      
      // Update local user profile
      if (authStore.userProfile) {
        authStore.userProfile.points += pointsToAdd
        authStore.userProfile.totalPosts += 1
      }
      
      // Get the created review with ID
      const createdReview = {
        id: docRef.id,
        ...newReview
      }
      
      // Add to local reviews
      reviews.value.unshift(createdReview)
      
      return createdReview
    } catch (err) {
      console.error('Error creating review:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Get review by ID
  async function getReviewById(id) {
    try {
      loading.value = true
      error.value = null
      
      const db = getFirebaseDb()
      const reviewRef = doc(db, 'posts', id)
      const reviewSnapshot = await getDoc(reviewRef)
      
      if (!reviewSnapshot.exists()) {
        throw new Error('Review not found')
      }
      
      const reviewData = {
        id: reviewSnapshot.id,
        ...reviewSnapshot.data()
      }
      
      // Convert timestamps to dates
      if (reviewData.createdAt) {
        reviewData.createdAt = reviewData.createdAt.toDate()
      }
      
      currentReview.value = reviewData
      return reviewData
    } catch (err) {
      console.error('Error fetching review:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Search reviews by video ID
  async function searchReviewsByVideoId(videoId) {
    try {
      loading.value = true
      error.value = null
      
      const db = getFirebaseDb()
      const reviewsRef = collection(db, 'posts')
      const q = query(reviewsRef, where('videoId', '==', videoId))
      
      const querySnapshot = await getDocs(q)
      const reviewsData = []
      
      querySnapshot.forEach(doc => {
        const data = doc.data()
        
        // Convert timestamps to dates
        if (data.createdAt) {
          data.createdAt = data.createdAt.toDate()
        }
        
        reviewsData.push({
          id: doc.id,
          ...data
        })
      })
      
      reviews.value = reviewsData
      return reviewsData
    } catch (err) {
      console.error('Error searching reviews:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Get latest reviews
  async function getLatestReviews(count = 10) {
    try {
      loading.value = true
      error.value = null
      
      const db = getFirebaseDb()
      const reviewsRef = collection(db, 'posts')
      const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(count))
      
      const querySnapshot = await getDocs(q)
      const reviewsData = []
      
      querySnapshot.forEach(doc => {
        const data = doc.data()
        
        // Convert timestamps to dates
        if (data.createdAt) {
          data.createdAt = data.createdAt.toDate()
        }
        
        reviewsData.push({
          id: doc.id,
          ...data
        })
      })
      
      reviews.value = reviewsData
      return reviewsData
    } catch (err) {
      console.error('Error fetching latest reviews:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Get user's reviews
  async function getUserReviews(userId = null) {
    try {
      loading.value = true
      error.value = null
      
      const targetUserId = userId || (authStore.user ? authStore.user.uid : null)
      
      if (!targetUserId) {
        throw new Error('User ID is required')
      }
      
      const db = getFirebaseDb()
      const reviewsRef = collection(db, 'posts')
      const q = query(
        reviewsRef, 
        where('authorId', '==', targetUserId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const reviewsData = []
      
      querySnapshot.forEach(doc => {
        const data = doc.data()
        
        // Convert timestamps to dates
        if (data.createdAt) {
          data.createdAt = data.createdAt.toDate()
        }
        
        reviewsData.push({
          id: doc.id,
          ...data
        })
      })
      
      // Only update reviews ref if getting current user's reviews
      if (!userId) {
        reviews.value = reviewsData
      }
      
      return reviewsData
    } catch (err) {
      console.error('Error fetching user reviews:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    reviews,
    currentReview,
    loading,
    error,
    categories,
    userReviews,
    getReasonCategories,
    createReview,
    getReviewById,
    searchReviewsByVideoId,
    getLatestReviews,
    getUserReviews
  }
})