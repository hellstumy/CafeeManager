import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser, loginUser } from '../api/api'
import { useAuth } from '../context/AuthContext'
import Loader from '../Components/Loader'
import { getCurrentUser } from '../api/api'
import { useCurrentUser } from '../store/store'
import { useTranslation } from 'react-i18next'

export default function LoginRegister() {
  const { t } = useTranslation()
  const setCurrentUser = useCurrentUser((state) => state.setCurrentUser)
  const [activeTab, setActiveTab] = useState('login')
  const [loginError, setLoginError] = useState('')
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  // Отдельные state для каждой формы (чище)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setIsLoginLoading(true)

    try {
      const response = await loginUser(loginData)

      if (!response?.token) {
        throw new Error('Token was not returned')
      }

      await login(response.token, response.user ?? null)
      const data = await getCurrentUser()
      setCurrentUser(data?.user ?? data ?? null)
      navigate('/main', { replace: true })
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoginLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    try {
      await registerUser({
        email: registerData.email,
        name: registerData.name,
        password: registerData.password,
      })
      alert('Registration successful! Please log in.')
      setActiveTab('login')
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
    } catch (err) {
      console.error(err)
      alert('Registration failed. Please try again.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'auth-tab-active' : ''}`}
            onClick={() => setActiveTab('login')}
            type="button"
          >
            {t('auth.login')}
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'auth-tab-active' : ''}`}
            onClick={() => setActiveTab('register')}
            type="button"
          >
            {t('auth.register')}
          </button>
        </div>

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin} name="login-form">
            <h1>{t('auth.welcomeBack')}</h1>
            <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>

            <label className="auth-label">
              {t('auth.email')}
              <input
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="auth-input"
                placeholder="you@cafemanager.com"
                type="email"
                name="email"
                id="login-email"
                autoComplete="username"
                required
              />
            </label>

            <label className="auth-label">
              {t('auth.password')}
              <input
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="auth-input"
                placeholder="Enter password"
                type="password"
                name="password"
                id="login-password"
                autoComplete="current-password"
                required
              />
            </label>

            <button
              className="auth-submit"
              disabled={isLoginLoading}
              type="submit"
            >
              {isLoginLoading ? (
                <>
                  <Loader inline label="" size="sm" />
                  {t('auth.signingIn')}
                </>
              ) : (
                t('auth.signIn')
              )}
            </button>
            {loginError ? <p className="auth-error">{loginError}</p> : null}
          </form>
        ) : (
          <form
            className="auth-form"
            onSubmit={handleRegister}
            name="register-form"
          >
            <h1> {t('auth.registerTitle')}</h1>
            <p className="auth-subtitle">{t('auth.registerSubtitle')}</p>

            <label className="auth-label">
              {t('auth.name')}
              <input
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                className="auth-input"
                placeholder="Jane Doe"
                type="text"
                name="name"
                id="register-name"
                autoComplete="name"
                required
              />
            </label>

            <label className="auth-label">
              {t('auth.email')}
              <input
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                className="auth-input"
                placeholder="you@cafemanager.com"
                type="email"
                name="email"
                id="register-email"
                autoComplete="username"
                required
              />
            </label>

            <label className="auth-label">
              {t('auth.password')}
              <input
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className="auth-input"
                placeholder="Create password"
                type="password"
                name="password"
                id="register-password"
                autoComplete="new-password"
                required
              />
            </label>

            <label className="auth-label">
              {t('auth.confirmPassword')}
              <input
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
                className="auth-input"
                placeholder="Repeat password"
                type="password"
                name="confirm-password"
                id="register-confirm-password"
                autoComplete="new-password"
                required
              />
            </label>

            <button className="auth-submit" type="submit">
              {t('auth.createAccount')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
