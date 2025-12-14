import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorOnboardingFormPage.css'
import { translate } from '../utils/translations'

function VendorOnboardingFormPage() {
  const navigate = useNavigate()
  const [isMarathi, setIsMarathi] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  
  // Phone verification state
  const [countryCode] = useState('+91')
  const [phoneNumber, setPhoneNumber] = useState('')
  
  // Sign up state
  const [fullName, setFullName] = useState('')
  const [signUpPhone, setSignUpPhone] = useState('')
  const [selectedOption, setSelectedOption] = useState('')

  const handleVerifyContinue = () => {
    setIsVerifying(true)
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      // Navigate to next form in sequence (vendor-payouts)
      navigate('/vendor-payouts')
    }, 2000)
  }

  const handleSendOTP = () => {
    setIsVerifying(true)
    // Simulate OTP sending
    setTimeout(() => {
      setIsVerifying(false)
      // Navigate to next form in sequence (vendor-payouts)
      navigate('/vendor-payouts')
    }, 2000)
  }

  const handleResendOTP = () => {
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
    }, 1500)
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
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
      </div>

      {/* Main Content */}
      <div className="form-content-wrapper">
        {/* Title Section */}
        <div className="title-section">
          <h1 className="main-title">Tatya Mitra</h1>
          <p className="main-subtitle">Smart Farming. Simplified by Tatya.</p>
        </div>

        {/* Phone Verification Section */}
        <div className="verification-section">
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
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {isVerifying && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}

          <button 
            className="verify-button"
            onClick={handleVerifyContinue}
            disabled={isVerifying || !phoneNumber}
          >
            {translate('Verify & Continue', isMarathi)}
          </button>

          <button 
            className="resend-otp-button"
            onClick={handleResendOTP}
            disabled={isVerifying}
          >
            {translate('Resend OTP', isMarathi)}
          </button>
        </div>

        {/* Sign Up Section */}
        <div className="signup-section">
          <p className="signup-prompt">
            {translate('New to Tatya?', isMarathi)} <span className="signup-link" onClick={() => setShowSignUp(!showSignUp)}>{translate('Sign Up here.', isMarathi)}</span>
          </p>

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
              type="tel"
              className="form-input"
              placeholder={translate('Phone Number', isMarathi)}
              value={signUpPhone}
              onChange={(e) => setSignUpPhone(e.target.value)}
            />
            
            <input
              type="text"
              className="form-input"
              placeholder={translate('Select', isMarathi)}
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            />

            {isVerifying && (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            )}

            <button 
              className="send-otp-button"
              onClick={handleSendOTP}
              disabled={isVerifying || !fullName || !signUpPhone || !selectedOption}
            >
              {translate('Send OTP', isMarathi)}
            </button>
          </div>
        </div>

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

