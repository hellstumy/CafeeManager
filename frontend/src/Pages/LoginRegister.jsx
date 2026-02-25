import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser, loginUser } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function LoginRegister() {
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

      login(response.token, response.user ?? null)
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
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'auth-tab-active' : ''}`}
            onClick={() => setActiveTab('register')}
            type="button"
          >
            Register
          </button>
        </div>

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin} name="login-form">
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your cafe dashboard</p>

            <label className="auth-label">
              Email
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
              Password
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

            <button className="auth-submit" type="submit">
              {isLoginLoading ? 'Signing In...' : 'Sign In'}
            </button>
            {loginError ? <p className="auth-error">{loginError}</p> : null}
          </form>
        ) : (
          <form
            className="auth-form"
            onSubmit={handleRegister}
            name="register-form"
          >
            <h1>Create Account</h1>
            <p className="auth-subtitle">
              Register your business and start managing orders
            </p>

            <label className="auth-label">
              Full Name
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
              Email
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
              Password
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
              Confirm Password
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
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
