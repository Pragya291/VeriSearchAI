import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'verisearchai.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'verisearchai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'verisearchai.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 5 &&
  firebaseConfig.projectId
)

let app = null
let auth = null
let googleProvider = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    })
  } catch (error) {
    console.error('Failed to initialize Firebase client SDK:', error)
  }
} else {
  console.info(
    'Firebase client configuration is not yet fully configured. Set VITE_FIREBASE_API_KEY and VITE_FIREBASE_APP_ID in your frontend .env.'
  )
}

export { auth, googleProvider }

export async function signInWithGoogle() {
  if (!isFirebaseConfigured || !auth || !googleProvider) {
    throw new Error(
      'Firebase client is not configured. Please add VITE_FIREBASE_API_KEY and VITE_FIREBASE_APP_ID to your frontend .env or Vercel environment settings.'
    )
  }

  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    const idToken = await user.getIdToken()
    return { user, idToken }
  } catch (err) {
    // Standardize error codes to clear user-facing messages
    if (err.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled: the Google authentication window was closed before completion.')
    }
    if (err.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in cancelled: another popup is already open.')
    }
    if (err.code === 'auth/popup-blocked') {
      throw new Error('The authentication popup was blocked by your browser. Please allow popups for this site and try again.')
    }
    if (err.code === 'auth/unauthorized-domain') {
      throw new Error(
        `This domain (${window.location.hostname}) is not authorized in Firebase Console. Go to Firebase Console -> Authentication -> Settings -> Authorized Domains and add this domain.`
      )
    }
    if (err.code === 'auth/network-request-failed') {
      throw new Error('Network error during Google sign-in. Please check your internet connection.')
    }
    throw new Error(err.message || 'Google sign-in failed. Please try again.')
  }
}

export async function signOutFirebase() {
  if (auth) {
    try {
      await fbSignOut(auth)
    } catch (err) {
      console.warn('Firebase signOut error:', err)
    }
  }
}

export function subscribeToAuthChanges(callback) {
  if (!auth) {
    return () => {}
  }
  return fbOnAuthStateChanged(auth, callback)
}
