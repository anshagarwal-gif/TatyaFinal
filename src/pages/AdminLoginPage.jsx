import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi'
import { adminLogin } from '../services/api'
import '../styles/AdminLoginPage.css'

function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await adminLogin({ email, password })
      if (response.success) {
        // Store admin info in localStorage
        localStorage.setItem('adminToken', response.data.token)
        localStorage.setItem('adminId', response.data.adminId)
        localStorage.setItem('adminEmail', response.data.email)
        navigate('/admin/dashboard')
      }
    } catch (err) {
      // Extract error message from the error
      let errorMessage = 'Login failed. Please check your credentials.'
      
      if (err.message) {
        errorMessage = err.message
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      // Show user-friendly error messages
      if (errorMessage.includes('Invalid admin credentials') || 
          errorMessage.includes('Invalid') || 
          errorMessage.includes('credentials')) {
        errorMessage = 'Invalid email or password. Please try again.'
      } else if (errorMessage.includes('not active')) {
        errorMessage = 'Your admin account is not active. Please contact support.'
      } else if (errorMessage.includes('Failed to login') || 
                 errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
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

          {/* Error Message */}
          {error && (
            <div className="admin-error-message">
              <FiAlertCircle className="admin-error-icon" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage
