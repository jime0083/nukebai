import { ref } from 'vue';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useUserStore } from '../stores/user';

/**
 * 認証状態の初期化を担う composable (Work 6-3 / E-5)
 * - onAuthStateChanged を購読し、Firestore の users ドキュメントと userStore を同期する。
 * - 読み込み状態(isLoading)を公開し、何が起きても最終的に false にする(App が固まらない)。
 */
export function useAuthState() {
  const userStore = useUserStore();
  const isLoading = ref(true);

  function init() {
    onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const firestoreData = docSnap.data();
            userStore.setUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || firestoreData.displayName || user.email.split('@')[0],
              photoURL: user.photoURL || firestoreData.photoURL,
              role: firestoreData.role || 'user',
              subscriptionStatus: firestoreData.subscriptionStatus || 'free',
              points: firestoreData.points || 0,
              reportCount: firestoreData.reportCount || 0,
              searchCount: firestoreData.searchCount || 0,
            });
            // lastLoginAt の更新は補助的。失敗してもアプリ表示を止めない。
            try {
              await setDoc(userDocRef, { lastLoginAt: serverTimestamp() }, { merge: true });
            } catch (e) {
              console.error('lastLoginAt の更新に失敗しました:', e);
            }
          } else {
            const newUserProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
              photoURL: user.photoURL,
              role: 'user',
              subscriptionStatus: 'free',
              points: 0,
              reportCount: 0,
              searchCount: 0,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            };
            await setDoc(userDocRef, newUserProfile);
            userStore.setUser(newUserProfile);
          }
        } else {
          userStore.clearUser();
        }
      } catch (e) {
        console.error('認証状態の初期化中にエラーが発生しました:', e);
      } finally {
        // 何が起きても読み込み状態を解除し、アプリが固まらないようにする
        isLoading.value = false;
      }
    });
  }

  return { isLoading, init };
}
