import { useNavigate } from 'react-router-dom'
import '../styles/VendorOnboardingPage.css'
import onboardingImage from '../assets/Onboardlogo.png'

function VendorOnboardingPage() {
  const navigate = useNavigate()

  return (
    <div className="vendor-onboarding-page">
      {/* Main Content */}
      <div className="onboarding-content">
        {/* Illustration Section */}
        <div className="illustration-section">
          <img 
            src={onboardingImage} 
            alt="Onboarding Illustration" 
            className="onboarding-image"
          />
        </div>

        {/* Text Content Section */}
        <div className="text-content-section">
          <h1 className="onboarding-title">Let's onboard your farm equipment to Tatya!</h1>
          <p className="onboarding-subtitle">Please review the details before submission.</p>
          
          {/* Start Onboarding Button */}
          <button 
            className="start-onboarding-button"
            onClick={() => navigate('/vendor-payouts')}
          >
            Start Onboarding
          </button>
        </div>
      </div>
    </div>
  )
}

export default VendorOnboardingPage