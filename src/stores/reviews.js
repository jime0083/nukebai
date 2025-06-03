import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getFirebaseDb } from '../firebase'
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useUserStore } from './user'

export const useReviewsStore = defineStore('reviews', () => {
  const db = getFirebaseDb()
  const userStore = useUserStore()
  
  const reviews = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  async function fetchReviews(limitCount = 10) {
    loading.value = true
    error.value = null
    
    try {
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, orderBy('createdAt', 'desc'), limit(limitCount))
      const querySnapshot = await getDocs(q)
      
      reviews.value = querySnapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
    } catch (err) {
      console.error('Error fetching reviews:', err)
      error.value = 'レビューの取得中にエラーが発生しました。'
    } finally {
      loading.value = false
    }
  }
  
  async function getReviewById(id) {
    loading.value = true
    error.value = null
    
    try {
      const docRef = doc(db, 'posts', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        }
      } else {
        error.value = 'レビューが見つかりませんでした。'
        return null
      }
    } catch (err) {
      console.error('Error getting review:', err)
      error.value = 'レビューの取得中にエラーが発生しました。'
      return null
    } finally {
      loading.value = false
    }
  }
  
  async function submitReview(reviewData) {
    loading.value = true
    error.value = null
    
    try {
      // Check if video already has a review
      const postsRef = collection(db, 'posts')
      const q = query(postsRef, where('videoId', '==', reviewData.videoId))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        error.value = 'この動画は既にレビューされています。'
        return false
      }
      
      // Add new review
      const newReviewData = {
        ...reviewData,
        authorId: userStore.user.uid,
        createdAt: serverTimestamp(),
        reportCount: 0,
        negativeReviewCount: 0,
        source: 'web'
      }
      
      await addDoc(collection(db, 'posts'), newReviewData)
      
      // Add random points (20-30)
      const pointsEarned = Math.floor(Math.random() * 11) + 20
      
      // Update user's points in Firestore
      const userRef = doc(db, 'users', userStore.user.uid)
      await updateDoc(userRef, {
        points: (userStore.points || 0) + pointsEarned,
        totalPosts: (userStore.user.totalPosts || 0) + 1
      })
      
      // Update local state
      userStore.updatePoints((userStore.points || 0) + pointsEarned)
      
      return {
        success: true,
        pointsEarned
      }
    } catch (err) {
      console.error('Error submitting review:', err)
      error.value = 'レビューの投稿中にエラーが発生しました。'
      return false
    } finally {
      loading.value = false
    }
  }
  
  return {
    reviews,
    loading,
    error,
    fetchReviews,
    getReviewById,
    submitReview
  }
})