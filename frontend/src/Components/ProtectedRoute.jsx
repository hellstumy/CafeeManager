import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')

  // Если нет токена → редирект на /login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Если токен есть → показываем компонент
  return children
}
