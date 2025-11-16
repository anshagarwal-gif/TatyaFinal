import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginPage.css'
import { translate } from '../utils/translations'
import tatyaLogo from '../assets/tatyalogo.png'
import textImage from '../assets/text.jpg'

function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isMarathi, setIsMarathi] = useState(false)
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const navigate = useNavigate()

  const handleGetOTP = () => {
    if (phoneNumber.length >= 10) {
      setShowOTP(true)
      // Focus first OTP input after animation
      setTimeout(() => {
        otpInputRefs[0].current?.focus()
      }, 500)
    }
  }

  const handleOTPChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 3) {
      otpInputRefs[index + 1].current?.focus()
    }

    // Auto-verify when all 4 digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4) {
      handleVerifyOTP(newOtp.join(''))
    }
  }

  const handleOTPKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('')
      setOtp(digits)
      otpInputRefs[3].current?.focus()
      // Auto-verify after paste
      setTimeout(() => {
        handleVerifyOTP(pastedData)
      }, 100)
    }
  }

  const handleVerifyOTP = async (otpValue) => {
    if (otpValue.length !== 4) return

    setIsVerifying(true)
    // Simulate OTP verification (replace with actual API call)
    setTimeout(() => {
      setIsVerifying(false)
      // Navigate to next page after successful verification
      navigate('/location')
    }, 1000)
  }

  const handleResendOTP = () => {
    setOtp(['', '', '', ''])
    setShowOTP(false)
    // Resend OTP logic here
    setTimeout(() => {
      setShowOTP(true)
      otpInputRefs[0].current?.focus()
    }, 300)
  }

  return (
    <div className="login-page">
      {/* Language Toggle Button */}
      <button 
        className="language-toggle"
        onClick={() => setIsMarathi(!isMarathi)}
        title={isMarathi ? 'Switch to English' : 'Switch to Marathi'}
      >
        {isMarathi ? 'EN' : 'मराठी'}
      </button>

      {/* Full Page Background Image */}
      <div className="login-background-image"></div>
      <div className="login-background-overlay"></div>

      {/* Logo and Branding Section */}
      <div className="login-logo-section">
        <div className="logo-container">
          <img 
            src={tatyaLogo} 
            alt="Tatya Logo" 
            className="tatya-logo"
          />
        </div>
        <div className="branding-text">
          <img 
            src={textImage} 
            alt="Branding Text" 
            className="branding-text-image"
          />
        </div>
      </div>

      {/* Login Form Panel - OTP Section Only */}
      <div className="login-panel">
        <h1 className="login-title">{translate('Login', isMarathi)}</h1>
        
        {!showOTP ? (
          <>
            <div className="form-group">
              <label className="form-label">{translate('Phone Number', isMarathi)}</label>
              <div className="phone-input-container">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  className="phone-input"
                  placeholder={translate('Enter your phone number', isMarathi)}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength="10"
                />
              </div>
            </div>

            <button 
              className="get-otp-button"
              onClick={handleGetOTP}
              disabled={phoneNumber.length < 10}
            >
              {translate('Get OTP', isMarathi)}
            </button>
          </>
        ) : (
          <div className="otp-container">
            <div className="otp-header">
              <h2 className="otp-title">{translate('Enter OTP', isMarathi)}</h2>
              <p className="otp-subtitle">
                {translate('We\'ve sent a 4-digit code to', isMarathi)}<br />
                <span className="otp-phone">+91 {phoneNumber}</span>
              </p>
            </div>

            <div className="otp-input-group">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={otpInputRefs[index]}
                  type="text"
                  className="otp-input"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  disabled={isVerifying}
                />
              ))}
            </div>

            {isVerifying && (
              <div className="otp-verifying">
                <div className="verifying-spinner"></div>
                <span>{translate('Verifying...', isMarathi)}</span>
              </div>
            )}

            <div className="otp-actions">
              <button 
                className="resend-otp-button"
                onClick={handleResendOTP}
                disabled={isVerifying}
              >
                {translate('Resend OTP', isMarathi)}
              </button>
              <button 
                className="change-number-button"
                onClick={() => {
                  setShowOTP(false)
                  setOtp(['', '', '', ''])
                }}
                disabled={isVerifying}
              >
                {translate('Change Number', isMarathi)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginPage


