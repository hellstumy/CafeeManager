import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'
import { useTranslation } from 'react-i18next'

export default function ProtectedRoute({ children }) {
  const { t } = useTranslation()
  const { loading } = useAuth()
  const token = localStorage.getItem('token')

  if (loading) {
    return <Loader fullScreen label={t('loader.checkingSession')} />
  }

  // Если нет токена → редирект на /login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Если токен есть → показываем компонент
  return children
}
