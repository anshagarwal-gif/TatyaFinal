import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiLock, FiArrowRight } from 'react-icons/fi'
import { getVendorPasswordSetupStatus, vendorSetInitialPassword } from '../services/api'
import '../styles/LoginPage.css'
import '../styles/VendorSetPasswordPage.css'

function VendorSetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [checking, setChecking] = useState(true)
  const [linkValid, setLinkValid] = useState(false)
  const [emailHint, setEmailHint] = useState('')

  const [temporaryPassword, setTemporaryPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function check() {
      if (!token.trim()) {
        setChecking(false)
        setLinkValid(false)
        return
      }
      try {
        const res = await getVendorPasswordSetupStatus(token.trim())
        const status = res?.data
        if (!cancelled && status?.valid) {
          setLinkValid(true)
          setEmailHint(status.emailHint || '')
        } else if (!cancelled) {
          setLinkValid(false)
        }
      } catch {
        if (!cancelled) setLinkValid(false)
      } finally {
        if (!cancelled) setChecking(false)
      }
    }
    check()
    return () => {
      cancelled = true
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const temp = temporaryPassword.trim()
    if (!temp) {
      setErrorMessage('Enter the temporary password from your email.')
      return
    }

    if (!/^\d{6}$/.test(newPassword)) {
      setErrorMessage('New password must be exactly 6 digits.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.')
      return
    }

    setSubmitting(true)
    try {
      await vendorSetInitialPassword({
        token: token.trim(),
        temporaryPassword: temp,
        newPassword,
      })
      navigate('/', { replace: true, state: { vendorPasswordSet: true } })
    } catch (err) {
      setErrorMessage(err.message || 'Could not set password. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page visible vendor-set-password-page">
      <div className="login-background-image" aria-hidden />
      <div className="login-background-overlay" aria-hidden />

      <div className="login-panel vendor-set-password-panel">
        <h1 className="login-title">Set vendor password</h1>
        <p className="vendor-set-password-subtitle">
          Use the temporary password from your approval email, then choose a new 6-digit password for login.
        </p>

        {checking && <p className="vendor-set-password-status">Checking your link…</p>}

        {!checking && !linkValid && (
          <div className="vendor-set-password-invalid">
            <p>This link is invalid or has expired.</p>
            <button type="button" className="get-otp-button" onClick={() => navigate('/', { replace: true })}>
              Back to login
            </button>
          </div>
        )}

        {!checking && linkValid && (
          <form onSubmit={handleSubmit} className="vendor-set-password-form">
            {emailHint && (
              <p className="vendor-set-password-hint">
                Account: <strong>{emailHint}</strong>
              </p>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="temp-pw">
                Temporary password (from email)
              </label>
              <div className="phone-input-container">
                <FiLock className="phone-icon" />
                <input
                  id="temp-pw"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="phone-input"
                  placeholder="e.g. 1234"
                  value={temporaryPassword}
                  onChange={(e) => setTemporaryPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="new-pw">
                New 6-digit password
              </label>
              <div className="phone-input-container">
                <FiLock className="phone-icon" />
                <input
                  id="new-pw"
                  type="password"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  autoComplete="new-password"
                  className="phone-input"
                  placeholder="6 digits"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-pw">
                Confirm 6-digit password
              </label>
              <div className="phone-input-container">
                <FiLock className="phone-icon" />
                <input
                  id="confirm-pw"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  autoComplete="new-password"
                  className="phone-input"
                  placeholder="6 digits"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
            </div>

            {errorMessage && <p className="vendor-set-password-error">{errorMessage}</p>}

            <button type="submit" className="get-otp-button" disabled={submitting}>
              <span>{submitting ? 'Saving…' : 'Save password'}</span>
              {!submitting && <FiArrowRight className="button-icon-right" />}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default VendorSetPasswordPage
