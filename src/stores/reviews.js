import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { useUserStore } from './user'
import { normalizeVideoId } from '../utils/videoId'

export const useReviewsStore = defineStore('reviews', () => {
  // db is now directly imported and can be used in this scope
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
      // 動画IDを正規化(投稿・検索・拡張で共通ルール。C-1)
      const normalizedVideoId = normalizeVideoId(reviewData.videoId)
      if (!normalizedVideoId) {
        error.value = '有効な動画IDを入力してください。'
        return false
      }

      // 同じユーザーが同じ動画IDを報告していないかチェック
      const postsRef = collection(db, 'posts')
      const q = query(
        postsRef,
        where('videoId', '==', normalizedVideoId),
        where('authorId', '==', userStore.user.uid)
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        error.value = 'あなたは既にこの動画を報告しています。'
        return false
      }

      // 注: 同じ動画IDでも異なるユーザーからの報告は許可する

      // Add new review
      // ポイント付与・reportCount/totalPosts の加算はサーバー(awardPointsOnPost
      // トリガー)が行う。クライアントからは users を書き込まない(B-2 対応)。
      const newReviewData = {
        ...reviewData,
        videoId: normalizedVideoId,
        authorId: userStore.user.uid,
        createdAt: serverTimestamp(),
        reportCount: 0,
        negativeReviewCount: 0,
        source: 'web'
      }

      const docRef = await addDoc(collection(db, 'posts'), newReviewData)

      return {
        success: true,
        postId: docRef.id
      }
    } catch (err) {
      console.error('Error submitting review:', err)
      error.value = 'レビューの投稿中にエラーが発生しました。'
      return false
    } finally {
      loading.value = false
    }
  }

  // サーバー(awardPointsOnPost)が post に書き戻す pointsEarned を待つ。
  // 指定時間内に付与が確認できなければ null を返す(表示用のベストエフォート)。
  function waitForAwardedPoints(postId, timeoutMs = 8000) {
    return new Promise((resolve) => {
      let settled = false
      const finish = (value) => {
        if (settled) return
        settled = true
        if (typeof unsubscribe === 'function') unsubscribe()
        clearTimeout(timer)
        resolve(value)
      }
      const timer = setTimeout(() => finish(null), timeoutMs)
      const unsubscribe = onSnapshot(
        doc(db, 'posts', postId),
        (snap) => {
          const data = snap.data()
          if (data && typeof data.pointsEarned === 'number') {
            finish(data.pointsEarned)
          }
        },
        () => finish(null)
      )
    })
  }

  return {
    reviews,
    loading,
    error,
    fetchReviews,
    getReviewById,
    submitReview,
    waitForAwardedPoints
  }
})