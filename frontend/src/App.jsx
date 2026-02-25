import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext' // ← Добавь контекст
import ClientPage from './Pages/ClientPage'
import LoginRegister from './Pages/LoginRegister'
import Main from './Pages/Main'
import ProtectedRoute from './Components/ProtectedRoute' // ← Для защиты роутов

function App() {
  return (
    <AuthProvider>
      {' '}
      {/* ← Оборачиваем в провайдер авторизации */}
      <BrowserRouter>
        <Routes>
          {/* Публичный роут (логин/регистрация) */}
          <Route path="/login" element={<LoginRegister />} />

          {/* Публичный роут (клиентское меню по QR) */}
          <Route path="/client/:qrToken" element={<ClientPage />} />

          {/* Защищенный роут (только для авторизованных) */}
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />

          {/* Редирект с главной страницы */}
          <Route path="/" element={<Navigate to="/main" replace />} />

          {/* 404 - Page Not Found */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
