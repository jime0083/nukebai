import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

let firebaseApp
let auth
let db
let storage

export function initializeFirebase() {
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
  firebaseApp = initializeApp(firebaseConfig)
  auth = getAuth(firebaseApp)
  db = getFirestore(firebaseApp)
  storage = getStorage(firebaseApp)
}

export function getFirebaseAuth() {
  return auth
}

export function getFirebaseDb() {
  return db
}

export function getFirebaseStorage() {
  return storage
}