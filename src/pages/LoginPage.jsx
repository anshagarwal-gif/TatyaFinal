import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginPage.css'
import { translate } from '../utils/translations'
import tatyaLogo from '../assets/tatyalogo.png'
import textImage from '../assets/text.jpg'
import { generateOtp, verifyOtp } from '../services/api'

function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMarathi, setIsMarathi] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false)
  const [isVendorLogin, setIsVendorLogin] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  const navigate = useNavigate()

  useEffect(() => {
    if (showOTP) {
      const focusTimer = setTimeout(() => {
        otpInputRefs[0].current?.focus()
      }, 50)
      return () => clearTimeout(focusTimer)
    }
  }, [showOTP])

  // Splash screen animation effect
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setSplashAnimationComplete(true)
    }, 2000) // Logo animation duration

    const hideTimer = setTimeout(() => {
      setShowSplash(false)
    }, 2500) // Total splash duration

    return () => {
      clearTimeout(splashTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  const handleGetOTP = async () => {
    if (phoneNumber.length < 10) {
      setErrorMessage(translate('Please enter a valid 10-digit phone number', isMarathi))
      return
    }

    setIsGenerating(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await generateOtp(phoneNumber)
      if (response.success) {
        setSuccessMessage(response.message || translate('OTP sent successfully', isMarathi))
        setShowOTP(true)
      } else {
        setErrorMessage(response.message || translate('Failed to generate OTP', isMarathi))
      }
    } catch (error) {
      console.error('Error generating OTP:', error)
      setErrorMessage(error.message || translate('Failed to generate OTP. Please try again.', isMarathi))
    } finally {
      setIsGenerating(false)
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
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await verifyOtp(phoneNumber, otpValue)
      if (response.success) {
        setSuccessMessage(response.message || translate('OTP verified successfully', isMarathi))
        // Store phone number in localStorage for session
        localStorage.setItem('userPhone', phoneNumber)
        localStorage.setItem('userType', isVendorLogin ? 'vendor' : 'customer')
        
        // Navigate based on login type
        setTimeout(() => {
          if (isVendorLogin) {
            navigate('/vendor-dashboard')
          } else {
            navigate('/location')
          }
        }, 500)
      } else {
        setErrorMessage(response.message || translate('Invalid or expired OTP', isMarathi))
        // Clear OTP on error
        setOtp(['', '', '', ''])
        otpInputRefs[0].current?.focus()
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setErrorMessage(error.message || translate('Failed to verify OTP. Please try again.', isMarathi))
      // Clear OTP on error
      setOtp(['', '', '', ''])
      otpInputRefs[0].current?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOTP = async () => {
    setOtp(['', '', '', ''])
    setErrorMessage('')
    setSuccessMessage('')
    setIsGenerating(true)

    try {
      const response = await generateOtp(phoneNumber)
      if (response.success) {
        setSuccessMessage(response.message || translate('OTP resent successfully', isMarathi))
        // Keep OTP screen visible
      } else {
        setErrorMessage(response.message || translate('Failed to resend OTP', isMarathi))
        setShowOTP(false)
      }
    } catch (error) {
      console.error('Error resending OTP:', error)
      setErrorMessage(error.message || translate('Failed to resend OTP. Please try again.', isMarathi))
      setShowOTP(false)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <div className="splash-screen">
          <div className={`splash-logo ${splashAnimationComplete ? 'animate-complete' : ''}`}>
            <img 
              src={tatyaLogo} 
              alt="Tatya Logo" 
              className="splash-logo-image"
            />
          </div>
        </div>
      )}

      {/* Main Login Page */}
      <div className={`login-page ${showSplash ? 'hidden' : 'visible'}`}>
        {/* Language Toggle Button */}
        <button 
          type="button"
          className={`language-toggle ${isMarathi ? 'marathi-active' : 'english-active'}`}
          onClick={() => setIsMarathi(!isMarathi)}
          title={isMarathi ? 'Switch to English' : 'Switch to Marathi'}
          aria-pressed={isMarathi}
          aria-label={isMarathi ? 'Switch to English' : 'Switch to Marathi'}
        >
          <span className="language-thumb" aria-hidden="true"></span>
          <span className="language-label english">English</span>
          <span className="language-label marathi">मराठी</span>
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
        <h1 className="login-title">
          {isVendorLogin ? translate('Vendor Login', isMarathi) : translate('Login', isMarathi)}
        </h1>
        
        {/* Login Type Toggle */}
        {!showOTP && (
          <div className="login-type-toggle">
            <button 
              className={`login-type-btn ${!isVendorLogin ? 'active' : ''}`}
              onClick={() => setIsVendorLogin(false)}
            >
              {translate('Customer', isMarathi)}
            </button>
            <button 
              className={`login-type-btn ${isVendorLogin ? 'active' : ''}`}
              onClick={() => setIsVendorLogin(true)}
            >
              {translate('Vendor', isMarathi)}
            </button>
          </div>
        )}
        
        {!showOTP ? (
          <>
            <div className="form-group">
              <label className="form-label">{translate('Phone Number', isMarathi)}</label>
              <div className="phone-input-container">
                <span className="country-code">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="tel-national"
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
              disabled={phoneNumber.length < 10 || isGenerating}
            >
              {isGenerating ? translate('Sending...', isMarathi) : translate('Get OTP', isMarathi)}
            </button>
            
            {errorMessage && (
              <div className="error-message" style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
                {errorMessage}
              </div>
            )}
            
            {successMessage && (
              <div className="success-message" style={{ color: 'green', marginTop: '10px', fontSize: '14px' }}>
                {successMessage}
              </div>
            )}

            {isVendorLogin && (
              <button 
                className="vendor-register-button"
                onClick={() => navigate('/vendor-onboarding')}
              >
                {translate('New Vendor? Register Here', isMarathi)}
              </button>
            )}
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
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
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

            {errorMessage && (
              <div className="error-message" style={{ color: 'red', marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>
                {errorMessage}
              </div>
            )}
            
            {successMessage && (
              <div className="success-message" style={{ color: 'green', marginTop: '10px', fontSize: '14px', textAlign: 'center' }}>
                {successMessage}
              </div>
            )}

            <div className="otp-actions">
              <button 
                className="resend-otp-button"
                onClick={handleResendOTP}
                disabled={isVerifying || isGenerating}
              >
                {isGenerating ? translate('Sending...', isMarathi) : translate('Resend OTP', isMarathi)}
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
    </>
  )
}

export default LoginPage


