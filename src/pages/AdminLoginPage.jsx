import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiLock } from 'react-icons/fi'
import '../styles/AdminLoginPage.css'

function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    // Frontend-only: Just redirect to dashboard
    navigate('/admin/dashboard')
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        {/* Logo/Title */}
        <div className="admin-login-header">
          <h1 className="admin-login-title">Admin Panel</h1>
          <p className="admin-login-subtitle">Sign in to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="admin-login-form">
          {/* Email Field */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              Admin Email
            </label>
            <div className="admin-input-wrapper">
              <div className="admin-input-icon">
                <FiMail />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="admin@tatya.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              Password
            </label>
            <div className="admin-input-wrapper">
              <div className="admin-input-icon">
                <FiLock />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="admin-login-button"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
