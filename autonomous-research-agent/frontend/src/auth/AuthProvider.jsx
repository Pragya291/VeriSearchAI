import { useEffect, useState } from 'react'
import { createAccount, getCurrentUser, login as loginRequest, logout as logoutRequest } from '../services/api'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    getCurrentUser()
      .then(({ data }) => {
        if (isMounted) setUser(data)
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
    const { data } = await createAccount(account)
    return data.user
  }

  const login = async (credentials) => {
    const { data } = await loginRequest(credentials)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    try {
      await logoutRequest()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}