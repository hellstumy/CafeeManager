import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../api/api'
import { useCurrentUser } from '../store/store'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const setCurrentUser = useCurrentUser((state) => state.setCurrentUser)
  const clearCurrentUser = useCurrentUser((state) => state.clearCurrentUser)

  // Проверка авторизации при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      getCurrentUser()
        .then((data) => {
          const resolvedUser = data?.user ?? data ?? null
          setUser(resolvedUser)
          setCurrentUser(resolvedUser)
          setLoading(false)
        })
        .catch(() => {
          localStorage.removeItem('token')
          setUser(null)
          clearCurrentUser()
          setLoading(false)
        })
    } else {
      setUser(null)
      clearCurrentUser()
      setLoading(false)
    }
  }, [clearCurrentUser, setCurrentUser])

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    const resolvedUser = userData?.user ?? userData ?? null
    setUser(resolvedUser)
    setCurrentUser(resolvedUser)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    clearCurrentUser()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Хук для использования в компонентах
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
