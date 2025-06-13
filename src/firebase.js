import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase config - In production, these would be environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBnryukelwlqXf9RmsOmIx_NLDQbm_V6Bs",
  authDomain: "nukebuy.firebaseapp.com",
  projectId: "nukebuy",
  storageBucket: "nukebuy.firebasestorage.app",
  messagingSenderId: "1019921068987",
  appId: "1:1019921068987:web:67890383236748c63a8a9e",
  measurementId: "G-M21BDY0837"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage, firebaseApp };

// The initializeFirebase function is no longer needed as initialization is done at the top level.
// The getter functions (getFirebaseAuth, getFirebaseDb, getFirebaseStorage) 
// are also redundant as instances are exported directly.