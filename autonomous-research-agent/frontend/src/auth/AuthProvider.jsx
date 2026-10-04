import { useEffect, useState } from 'react'
import { getCurrentUser, login as apiLogin, logout as apiLogout, signup as apiSignup } from '../services/api'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

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

    return () => {
      isMounted = false
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

  const logout = async () => {
    try {
      await apiLogout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}