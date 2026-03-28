import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx' // ← Добавь контекст
import ClientPage from './Pages/ClientPage.jsx'
import LoginRegister from './Pages/LoginRegister.jsx'
import Main from './Pages/Main.jsx'
import PaymentCancel from './Pages/PaymentCancel.jsx'
import PaymentSuccess from './Pages/PaymentSuccess.jsx'
import ProtectedRoute from './Components/ProtectedRoute.jsx' // ← Для защиты роутов
import { useTranslation } from 'react-i18next'
import { NotificationProvider } from './context/NotificationContext.jsx'

function App() {
  const { t } = useTranslation()
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/menu/:qrToken" element={<ClientPage />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />
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
