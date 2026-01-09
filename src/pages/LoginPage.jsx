import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/LoginPage.css'
import { translate } from '../utils/translations'
import tatyaLogo from '../assets/tatyalogo.png'
import textImage from '../assets/WhiteText.png'
import firstBanner from '../assets/FirstBanner.png'
import whiteText from '../assets/WhiteText.png'
import greenText from '../assets/GreenText.png'
import otpMan from '../assets/OTPMan.png'
import otpBlackText from '../assets/OTPBlackText.png'
import otpBlackSubtext from '../assets/OTPBlackSubtext.png'
import otpOrangeText from '../assets/OTPOrangeText.png'
import { FiPhone, FiArrowRight, FiRefreshCw, FiEdit2, FiCheckCircle, FiUser, FiBriefcase } from 'react-icons/fi'

function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isMarathi, setIsMarathi] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false)
  const [isVendorLogin, setIsVendorLogin] = useState(false)
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
    if (phoneNumber.length >= 10) {
      // Here you would call your API to send OTP
      // For now, simulate API call
      setShowOTP(true)
    }
  }

  const handlePhoneKeyPress = (e) => {
    if (e.key === 'Enter' && phoneNumber.length >= 10) {
      handleGetOTP()
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
      // Navigate based on login type
      if (isVendorLogin) {
        navigate('/vendor-dashboard')
      } else {
        navigate('/location')
      }
    }, 1000)
  }

  const handleResendOTP = () => {
    setOtp(['', '', '', ''])
    setShowOTP(false)
    // Resend OTP logic here
    setTimeout(() => {
      setShowOTP(true)
    }, 300)
  }

  return (
    <>
      {/* Splash Screen */}
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-hero">
            <img
              src={firstBanner}
              alt="Tatya Drone with Farmer"
              className="splash-hero-image"
            />
          </div>
          <div className="splash-bottom">
            <img 
              src={tatyaLogo} 
              alt="Tatya Logo" 
              className="splash-logo-mark"
            />
            <img
              src={whiteText}
              alt="Tatya Marathi Tagline White"
              className="splash-white-text"
            />
            <img
              src={greenText}
              alt="Tatya Marathi Tagline Green"
              className="splash-green-text"
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
              type="button"
              className={`login-type-btn ${!isVendorLogin ? 'active' : ''}`}
              onClick={() => setIsVendorLogin(false)}
              aria-pressed={!isVendorLogin}
            >
              <FiUser className="login-type-icon" />
              <span>{translate('Customer', isMarathi)}</span>
            </button>
            <button 
              type="button"
              className={`login-type-btn ${isVendorLogin ? 'active' : ''}`}
              onClick={() => setIsVendorLogin(true)}
              aria-pressed={isVendorLogin}
            >
              <FiBriefcase className="login-type-icon" />
              <span>{translate('Vendor', isMarathi)}</span>
            </button>
          </div>
        )}
        
        {!showOTP ? (
          <>
            <div className="form-group">
              <label className="form-label" htmlFor="phone-input">
                {translate('Phone Number', isMarathi)}
              </label>
              <div className="phone-input-container">
                <span className="country-code">+91</span>
                <FiPhone className="phone-icon" />
                <input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="tel-national"
                  className="phone-input"
                  placeholder={translate('Enter your phone number', isMarathi)}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  onKeyPress={handlePhoneKeyPress}
                  maxLength="10"
                  aria-label={translate('Phone Number', isMarathi)}
                />
              </div>
              {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                <p className="phone-hint">{translate('Enter 10-digit phone number', isMarathi)}</p>
              )}
            </div>

            <button 
              type="button"
              className="get-otp-button"
              onClick={handleGetOTP}
              disabled={phoneNumber.length < 10}
              aria-label={translate('Get OTP', isMarathi)}
            >
              <span>{translate('Get OTP', isMarathi)}</span>
              <FiArrowRight className="button-icon-right" />
            </button>

            {isVendorLogin && (
              <button 
                type="button"
                className="vendor-register-button"
                onClick={() => navigate('/vendor-onboarding')}
                aria-label={translate('New Vendor? Register Here', isMarathi)}
              >
                {translate('New Vendor? Register Here', isMarathi)}
              </button>
            )}
          </>
        ) : (
          <div className="otp-container">
            <div className="otp-header">
              <div className="otp-title-wrapper">
                <FiCheckCircle className="otp-success-icon" />
                <h2 className="otp-title">{translate('Enter OTP', isMarathi)}</h2>
              </div>
              <p className="otp-subtitle">
                {translate('We\'ve sent a 4-digit code to', isMarathi)}<br />
                <span className="otp-phone">+91 {phoneNumber}</span>
              </p>
            </div>

            {/* OTP Illustration Block */}
            <div className="otp-illustration-card">
              <div className="otp-text-stack">
                <img src={otpBlackText} alt="OTP Title" className="otp-text-line primary" />
                <img src={otpBlackSubtext} alt="OTP Subtext" className="otp-text-line secondary" />
                <img src={otpOrangeText} alt="OTP Hint" className="otp-text-line accent" />
              </div>
              <div className="otp-man-wrapper">
                <img src={otpMan} alt="Mascot waiting" className="otp-man" />
              </div>
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

            <div className="otp-actions">
              <button 
                type="button"
                className="resend-otp-button"
                onClick={handleResendOTP}
                disabled={isVerifying}
                aria-label={translate('Resend OTP', isMarathi)}
              >
                <FiRefreshCw className="button-icon-left" />
                <span>{translate('Resend OTP', isMarathi)}</span>
              </button>
              <button 
                type="button"
                className="change-number-button"
                onClick={() => {
                  setShowOTP(false)
                  setOtp(['', '', '', ''])
                }}
                disabled={isVerifying}
                aria-label={translate('Change Number', isMarathi)}
              >
                <FiEdit2 className="button-icon-left" />
                <span>{translate('Change Number', isMarathi)}</span>
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


