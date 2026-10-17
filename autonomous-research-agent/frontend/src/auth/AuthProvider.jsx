import { useEffect, useState, useCallback } from 'react'
import {
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  signup as apiSignup,
  loginWithGoogleToken,
  setAuthToken,
} from '../services/api'
import {
  signInWithGoogle as fbSignInWithGoogle,
  signOutFirebase,
  subscribeToAuthChanges,
  isFirebaseConfigured,
} from './firebase'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // 1. If Firebase is configured, subscribe to Firebase Auth state changes
    let unsubscribe = () => {}
    if (isFirebaseConfigured) {
      unsubscribe = subscribeToAuthChanges(async (fbUser) => {
        if (!isMounted) return

        if (fbUser) {
          try {
            const idToken = await fbUser.getIdToken()
            setAuthToken(idToken)
            const syncUser = await loginWithGoogleToken(idToken, fbUser)
            if (isMounted) setUser(syncUser)
          } catch (err) {
            console.warn('Error synchronizing Firebase user with backend:', err)
            if (isMounted) {
              const fallback = {
                id: fbUser.uid,
                uid: fbUser.uid,
                full_name: fbUser.displayName || 'Google User',
                email: fbUser.email,
                profilePhoto: fbUser.photoURL || '',
                avatar_url: fbUser.photoURL || '',
                provider: 'google.com',
                role: 'Researcher',
              }
              setUser(fallback)
            }
          } finally {
            if (isMounted) setIsLoading(false)
          }
        } else {
          // No active Firebase user; check local session / cookie
          getCurrentUser()
            .then((userData) => {
              if (isMounted) setUser(userData)
            })
            .catch(() => {
              if (isMounted) setUser(null)
            })
            .finally(() => {
              if (isMounted) setIsLoading(false)
            })
        }
      })
    } else {
      // Firebase not yet initialized; verify standard session / local user
      getCurrentUser()
        .then((userData) => {
          if (isMounted) setUser(userData)
        })
        .catch(() => {
          if (isMounted) setUser(null)
        })
        .finally(() => {
          if (isMounted) setIsLoading(false)
        })
    }

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const signup = async (account) => {
    const newUser = await apiSignup(account)
    setUser(newUser)
    return newUser
  }

  const login = async (credentials) => {
    const loggedInUser = await apiLogin(credentials)
    setUser(loggedInUser)
    return loggedInUser
  }

  const loginWithGoogle = async () => {
    const { user: fbUser, idToken } = await fbSignInWithGoogle()
    setAuthToken(idToken)
    const verifiedUser = await loginWithGoogleToken(idToken, fbUser)
    const finalUser = verifiedUser || {
      id: fbUser.uid,
      uid: fbUser.uid,
      full_name: fbUser.displayName || fbUser.email.split('@')[0],
      email: fbUser.email,
      profilePhoto: fbUser.photoURL || '',
      avatar_url: fbUser.photoURL || '',
      provider: 'google.com',
      role: 'Researcher',
    }
    setUser(finalUser)
    return finalUser
  }

  const logout = async () => {
    try {
      await signOutFirebase()
    } catch (fbErr) {
      console.warn('Firebase signout error:', fbErr)
    }
    try {
      await apiLogout()
    } finally {
      setAuthToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        signup,
        login,
        loginWithGoogle,
        logout,
        isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}