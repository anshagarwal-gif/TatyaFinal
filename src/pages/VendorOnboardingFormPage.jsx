import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorOnboardingFormPage.css'
import { translate } from '../utils/translations'
import { FiPhone, FiCheckCircle, FiEdit2, FiArrowLeft } from 'react-icons/fi'

function VendorOnboardingFormPage() {
  const navigate = useNavigate()
  const [isMarathi, setIsMarathi] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  // Phone verification state
  const [countryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', ''])
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]
  
  // Sign up state - original fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

  useEffect(() => {
    if (showOTP) {
      const focusTimer = setTimeout(() => {
        otpInputRefs[0].current?.focus()
      }, 50)
      return () => clearTimeout(focusTimer)
    }
  }, [showOTP])

  const handleOTPChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 3) {
      otpInputRefs[index + 1].current?.focus()
    }

    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4) {
      handleVerifyOTP(newOtp.join(''))
    }
  }

  const handleOTPKeyDown = (index, e) => {
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
      setTimeout(() => {
        handleVerifyOTP(pastedData)
      }, 100)
    }
  }

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Single OTP send function - validate original fields
  const handleSendOTP = () => {
    // Validate name
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name')
      return
    }
    
    // Validate email
    if (!email.trim()) {
      setErrorMessage('Please enter your email address')
      return
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address')
      return
    }
    
    // Validate select option
    if (!selectedOption.trim()) {
      setErrorMessage('Please select an option')
      return
    }

    // Validate phone number
    const phone = phoneNumber.replace(/\D/g, '')
    if (phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number')
      return
    }

    setIsGenerating(true)
    setErrorMessage('')
    
    // Simulate OTP sending (pure frontend)
    setTimeout(() => {
      setIsGenerating(false)
      setShowOTP(true)
    }, 1500)
  }

  // Single OTP verification function
  const handleVerifyOTP = (otpValue) => {
    if (otpValue.length !== 4) return

    setIsVerifying(true)
    setErrorMessage('')
    
    // Simulate OTP verification (pure frontend)
    setTimeout(() => {
      setIsVerifying(false)
      // Navigate to first step in onboarding sequence: Equipment Basics
      navigate('/vendor-equipment')
    }, 1500)
  }

  const handleResendOTP = () => {
    setIsGenerating(true)
    setErrorMessage('')
    setOtp(['', '', '', ''])
    
    setTimeout(() => {
      setIsGenerating(false)
    }, 1500)
  }

  const handleChangeNumber = () => {
    setShowOTP(false)
    setOtp(['', '', '', ''])
    setErrorMessage('')
  }

  return (
    <div className="vendor-onboarding-form-page">
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

      {/* Header */}
      <div className="form-header">
        <button className="back-button" onClick={() => navigate(-1)} aria-label="Go back">
          <FiArrowLeft />
        </button>
      </div>

      {/* Main Content */}
      <div className="form-content-wrapper">
        {/* Title Section */}
        <div className="title-section">
          <h1 className="main-title">Tatya Mitra</h1>
          <p className="main-subtitle">Smart Farming. Simplified by Tatya.</p>
        </div>

        {!showOTP ? (
          <div className="verification-section">
            <h2 className="signup-title">{translate('Create My Tatya Account', isMarathi)}</h2>
            
            <div className="signup-form">
              <input
                type="text"
                className="form-input"
                placeholder={translate('Full Name', isMarathi)}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              
              <input
                type="email"
                className="form-input"
                placeholder={translate('Email Address', isMarathi)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <div className="phone-input-group">
                <input
                  type="text"
                  className="country-code-input"
                  value={countryCode}
                  readOnly
                />
                <input
                  type="tel"
                  className="phone-input"
                  placeholder="(999) 111-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  maxLength="10"
                />
              </div>
              
              <select
                className="form-input form-select"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="" disabled>
                  {translate('What Defines you the best?', isMarathi)}
                </option>
                <option value="Individual Equipment Owner">
                  {translate('Individual Equipment Owner', isMarathi)}
                </option>
                <option value="Company Appointed Operator">
                  {translate('Company Appointed Operator', isMarathi)}
                </option>
                <option value="Custom Hiring Center (Individual)">
                  {translate('Custom Hiring Center (Individual)', isMarathi)}
                </option>
                <option value="Custom Hiring Center (FPC)">
                  {translate('Custom Hiring Center (FPC)', isMarathi)}
                </option>
                <option value="Chemical Company">
                  {translate('Chemical Company', isMarathi)}
                </option>
                <option value="Krishi Seva Kendra (Chemical Shop)">
                  {translate('Krishi Seva Kendra (Chemical Shop)', isMarathi)}
                </option>
              </select>

              {errorMessage && (
                <p className="error-message" style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem', textAlign: 'center' }}>
                  {errorMessage}
                </p>
              )}

              {isGenerating && (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              )}

              <button 
                className="send-otp-button"
                onClick={handleSendOTP}
                disabled={isGenerating || !fullName.trim() || !email.trim() || !validateEmail(email) || phoneNumber.replace(/\D/g, '').length < 10 || !selectedOption.trim()}
              >
                {isGenerating ? (
                  <>
                    <div className="verifying-spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                    <span>{translate('Sending...', isMarathi)}</span>
                  </>
                ) : (
                  translate('Send OTP', isMarathi)
                )}
              </button>
            </div>
          </div>
        ) : (
          /* OTP Verification Section - shown after sending OTP */
          <div className="otp-verification-section">
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

            {errorMessage && showOTP && (
              <div className="otp-error-message">
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  style={{ marginRight: '8px', flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}
            
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
                disabled={isVerifying || isGenerating}
              >
                {translate('Resend OTP', isMarathi)}
              </button>
              
              <button 
                type="button"
                className="change-number-button"
                onClick={handleChangeNumber}
                disabled={isVerifying}
              >
                <FiEdit2 className="button-icon-left" />
                <span>{translate('Change Number', isMarathi)}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="form-footer">
          <p className="footer-text">
            {translate('By continuing, you agree to Tatya\'s', isMarathi)} <span className="footer-link">{translate('Terms & Privacy Policy.', isMarathi)}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VendorOnboardingFormPage

