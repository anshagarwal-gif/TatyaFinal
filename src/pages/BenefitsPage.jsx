import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/BenefitsPage.css'
import { translate } from '../utils/translations'
import calendarImage from '../assets/Calender.jpg'
import moneyImage from '../assets/Image2.jpg'
import droneImage from '../assets/Image3.jpg'

function BenefitsPage() {
  const navigate = useNavigate()
  const [isMarathi, setIsMarathi] = useState(false)

  const benefits = [
    {
      title: 'Quick Booking',
      titleMarathi: 'त्वरित बुकिंग',
      description: 'Register your number and just tell us when to come, in one click, for life.',
      descriptionMarathi: 'आपला नंबर नोंदवा आणि फक्त आम्हाला सांगा की कधी यायचे, एका क्लिकमध्ये, आयुष्यभरासाठी.',
      imageType: 'calendar' // Calendar with clock
    },
    {
      title: 'Discounting',
      titleMarathi: 'सवलत',
      description: 'Government and CSR funds directed towards discounts for you.',
      descriptionMarathi: 'सरकार आणि CSR निधी आपल्यासाठी सवलतींकडे निर्देशित.',
      imageType: 'money' // Money bag with coins and percentage tag
    },
    {
      title: 'Equipment on time',
      titleMarathi: 'वेळेवर उपकरणे',
      description: 'Machineries comes to your farm directly, as fast as possible.',
      descriptionMarathi: 'यंत्रसामग्री आपल्या शेतावर थेट येते, शक्य तितक्या वेगाने.',
      imageType: 'drone' // Green drone
    }
  ]

  const handleContinue = () => {
    navigate('/location')
  }

  return (
    <div className="benefits-page">
      <div className="benefits-container">
        {/* Main Title */}
        <h1 className="main-title">{translate('What\'s in for you?', isMarathi)}</h1>

        {/* Benefits Cards Section */}
        <div className="benefits-cards-section">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-card-content">
                <div className="benefit-text-section">
                  <h3 className="benefit-title">
                    {isMarathi ? benefit.titleMarathi : benefit.title}
                  </h3>
                  <p className="benefit-description">
                    {isMarathi ? benefit.descriptionMarathi : benefit.description}
                  </p>
                  <button className="details-button">
                    {translate('Details', isMarathi)}
                  </button>
                </div>
                <div className="benefit-image-section">
                  {benefit.imageType === 'calendar' && (
                    <div className="benefit-image calendar-image">
                      <img 
                        src= {calendarImage}
                        alt="Calendar"
                        className="calendar-img"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="image-placeholder calendar-placeholder">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="15" y="20" width="50" height="50" rx="4" fill="#FF6B35"/>
                          <rect x="20" y="30" width="8" height="8" rx="1" fill="white" opacity="0.8"/>
                          <rect x="32" y="30" width="8" height="8" rx="1" fill="white" opacity="0.8"/>
                          <rect x="44" y="30" width="8" height="8" rx="1" fill="white" opacity="0.8"/>
                          <rect x="20" y="42" width="8" height="8" rx="1" fill="white" opacity="0.8"/>
                          <rect x="32" y="42" width="8" height="8" rx="1" fill="white" opacity="0.8"/>
                          <circle cx="50" cy="55" r="8" fill="#000000"/>
                          <line x1="50" y1="51" x2="50" y2="55" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          <line x1="50" y1="55" x2="53" y2="55" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </div>
                    </div>
                  )}
                  {benefit.imageType === 'money' && (
                    <div className="benefit-image money-image">
                      <img 
                        src= {moneyImage}
                        alt="Money"
                        className="money-img"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="image-placeholder money-placeholder">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          {/* Money Bag */}
                          <path d="M40 20C35 20 30 22 28 26L25 35C24 38 25 42 28 44L32 48C35 50 40 50 43 48L47 44C50 42 51 38 50 35L47 26C45 22 45 20 40 20Z" fill="white" stroke="#22C55E" strokeWidth="2"/>
                          <path d="M28 26L32 30L36 26" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"/>
                          {/* Rupee Symbol */}
                          <text x="40" y="38" textAnchor="middle" fill="#22C55E" fontSize="20" fontWeight="bold" fontFamily="Arial">₹</text>
                          {/* Coins */}
                          <circle cx="28" cy="58" r="5" fill="#F59E0B"/>
                          <circle cx="38" cy="60" r="5" fill="#F59E0B"/>
                          <circle cx="48" cy="58" r="5" fill="#F59E0B"/>
                          {/* Percentage Tag */}
                          <rect x="52" y="22" width="14" height="14" rx="2" fill="#FF6B35"/>
                          <text x="59" y="32" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">%</text>
                        </svg>
                      </div>
                    </div>
                  )}
                  {benefit.imageType === 'drone' && (
                    <div className="benefit-image drone-image">
                      <img 
                        src= {droneImage}
                        alt="Drone"
                        className="drone-img"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="image-placeholder drone-placeholder">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <ellipse cx="40" cy="45" rx="25" ry="15" fill="#16A34A"/>
                          <ellipse cx="40" cy="42" rx="20" ry="12" fill="#22C55E"/>
                          <circle cx="30" cy="30" r="6" fill="#16A34A"/>
                          <circle cx="50" cy="30" r="6" fill="#16A34A"/>
                          <circle cx="30" cy="60" r="6" fill="#16A34A"/>
                          <circle cx="50" cy="60" r="6" fill="#16A34A"/>
                          <circle cx="40" cy="42" r="4" fill="#1F2937"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="benefits-actions">
          <button className="continue-button" onClick={handleContinue}>
            {translate('Continue', isMarathi)}
          </button>
        </div>

        {/* Language Toggle */}
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
      </div>
    </div>
  )
}

export default BenefitsPage
