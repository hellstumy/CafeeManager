import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

export default function ProtectedRoute({ children }) {
  const { loading } = useAuth()
  const token = localStorage.getItem('token')

  if (loading) {
    return <Loader fullScreen label="Checking session..." />
  }

  // Если нет токена → редирект на /login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Если токен есть → показываем компонент
  return children
}
