import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // ← Добавь контекст
import ClientPage from './Pages/ClientPage'
import LoginRegister from './Pages/LoginRegister'
import Main from './Pages/Main'
import ProtectedRoute from './Components/ProtectedRoute' // ← Для защиты роутов
import { useTranslation } from 'react-i18next'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  const { t } = useTranslation()
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/menu/:qrToken" element={<ClientPage />} />
            <Route
              path="/main"
              element={
                <ProtectedRoute>
                  <Main />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/main" replace />} />
            <Route path="*" element={<div>{t('app.notFound')}</div>} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
