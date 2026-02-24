import { useState } from 'react'

export default function LoginRegister() {
  const [activeTab, setActiveTab] = useState('login')

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
          <form className="auth-form">
            <h1>Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your cafe dashboard</p>

            <label className="auth-label">
              Email
              <input className="auth-input" placeholder="you@cafemanager.com" type="email" />
            </label>

            <label className="auth-label">
              Password
              <input className="auth-input" placeholder="Enter password" type="password" />
            </label>

            <button className="auth-submit" type="submit">
              Sign In
            </button>
          </form>
        ) : (
          <form className="auth-form">
            <h1>Create Account</h1>
            <p className="auth-subtitle">Register your business and start managing orders</p>

            <label className="auth-label">
              Full Name
              <input className="auth-input" placeholder="Jane Doe" type="text" />
            </label>

            <label className="auth-label">
              Email
              <input className="auth-input" placeholder="you@cafemanager.com" type="email" />
            </label>

            <label className="auth-label">
              Password
              <input className="auth-input" placeholder="Create password" type="password" />
            </label>

            <label className="auth-label">
              Confirm Password
              <input className="auth-input" placeholder="Repeat password" type="password" />
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
