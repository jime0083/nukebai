import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

let firebaseApp
let auth
let db
let storage

export function initializeFirebase() {
  // Firebase configuration
  // NOTE: In a production environment, these values should be environment variables
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // Replace with actual Firebase API key
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
  }

  // Initialize Firebase
  firebaseApp = initializeApp(firebaseConfig)
  auth = getAuth(firebaseApp)
  db = getFirestore(firebaseApp)
  storage = getStorage(firebaseApp)

  return { firebaseApp, auth, db, storage }
}

export function getFirebaseAuth() {
  if (!auth) {
    const { auth: newAuth } = initializeFirebase()
    return newAuth
  }
  return auth
}

export function getFirebaseDb() {
  if (!db) {
    const { db: newDb } = initializeFirebase()
    return newDb
  }
  return db
}

export function getFirebaseStorage() {
  if (!storage) {
    const { storage: newStorage } = initializeFirebase()
    return newStorage
  }
  return storage
}