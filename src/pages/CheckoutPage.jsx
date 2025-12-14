import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/CheckoutPage.css'
import { translate } from '../utils/translations'
import { createBooking } from '../services/api'

function CheckoutPage() {
  const [selectedInstruction, setSelectedInstruction] = useState('call')
  const [isMarathi, setIsMarathi] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Get booking data from navigation state or localStorage
  const [bookingData, setBookingData] = useState({
    quantity: 1,
    unit: 'Acre',
    date: '',
    totalPrice: 400,
    pricePerUnit: 400,
    location: null
  })

  useEffect(() => {
    // First try to get from navigation state
    const stateData = location.state
    if (stateData) {
      setBookingData({
        quantity: stateData.quantity || 1,
        unit: stateData.unit || 'Acre',
        date: stateData.date || '',
        totalPrice: stateData.totalPrice || 400,
        pricePerUnit: stateData.pricePerUnit || 400,
        location: stateData.location || null
      })
      // Also save to localStorage for persistence
      localStorage.setItem('bookingData', JSON.stringify({
        quantity: stateData.quantity || 1,
        unit: stateData.unit || 'Acre',
        date: stateData.date || '',
        totalPrice: stateData.totalPrice || 400,
        pricePerUnit: stateData.pricePerUnit || 400,
        location: stateData.location || null
      }))
    } else {
      // Fallback to localStorage
      const savedData = localStorage.getItem('bookingData')
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          setBookingData(parsed)
        } catch (e) {
          console.error('Error parsing booking data:', e)
        }
      }
    }
  }, [location.state])

  // Calculate prices
  const pricePerUnit = bookingData.pricePerUnit || 400
  const quantity = bookingData.quantity || 1
  const itemTotal = bookingData.totalPrice || (pricePerUnit * quantity)
  const deliveryFee = 35
  const travelCost = 20
  const gstRate = 0.18
  const gstAmount = itemTotal * gstRate
  const totalPayable = itemTotal + gstAmount

  const handleProceedToPayment = async () => {
    if (!bookingData.location || !bookingData.date) {
      setErrorMessage(translate('Please complete all booking details', isMarathi))
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    try {
      // Get user phone from localStorage (set during login)
      const userPhone = localStorage.getItem('userPhone') || '1234567890' // Fallback for testing
      
      // Prepare booking data according to backend API
      const bookingPayload = {
        customerId: 1, // TODO: Get from user session/context
        vendorId: 1, // TODO: Get from selected drone/vendor
        droneId: 1, // TODO: Get from selected drone
        serviceType: bookingData.unit === 'Acre' ? 'ACRE' : bookingData.unit === 'Hour' ? 'HOUR' : 'DAY',
        quantity: bookingData.quantity,
        bookingDate: bookingData.date,
        locationLatitude: bookingData.location[0],
        locationLongitude: bookingData.location[1],
        totalAmount: totalPayable,
        instructions: selectedInstruction === 'call' 
          ? 'Call me 1 hour before arrival' 
          : 'No contact - go directly to location'
      }

      const response = await createBooking(bookingPayload)
      
      if (response.success) {
        // Store booking ID for reference
        localStorage.setItem('lastBookingId', response.data?.id || '')
        // Navigate to success page or payment page
        alert(translate('Booking created successfully!', isMarathi))
        // TODO: Navigate to payment page or booking confirmation
        // navigate('/booking-success', { state: { booking: response.data } })
      } else {
        setErrorMessage(response.message || translate('Failed to create booking', isMarathi))
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      setErrorMessage(error.message || translate('Failed to create booking. Please try again.', isMarathi))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="checkout-page">
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
      <div className="checkout-header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <div className="header-right"></div>
      </div>

      {/* Delivery Information Card */}
      <div className="delivery-card">
        <div className="delivery-content">
          <div className="delivery-text">
            <div className="delivery-title">
              {bookingData.date 
                ? `${translate('Delivering to you on', isMarathi)} ${new Date(bookingData.date).toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
                : translate('Delivering to you in 15 mins!', isMarathi)
              }
            </div>
            <div className="delivery-subtitle">
              {bookingData.date 
                ? `${translate('Booking scheduled for', isMarathi)} ${quantity} ${translate(bookingData.unit, isMarathi)}`
                : translate('Delivery time has slightly increased due to heavy rains.', isMarathi)
              }
            </div>
            <div className="delivery-buttons">
              <button 
                className="change-slot-button"
                onClick={() => navigate('/booking')}
              >
                {translate('Change Slot', isMarathi)}
              </button>
              <button 
                className="change-location-button"
                onClick={() => navigate('/location')}
              >
                {translate('Change Location', isMarathi)}
              </button>
            </div>
          </div>
          <div className="delivery-illustration">
            <div className="delivery-person">🚚</div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="order-summary">
        <div className="summary-row">
          <span className="summary-label">{translate('Total Quantity', isMarathi)}</span>
          <span className="summary-value">{quantity} {translate(bookingData.unit, isMarathi)}{quantity > 1 ? (isMarathi ? '' : 's') : ''}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">{translate('Item Total', isMarathi)}</span>
          <span className="summary-value">₹{itemTotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">{translate('Delivery Fee (₹35 Saved)', isMarathi)}</span>
          <span className="summary-value">
            <span className="strikethrough">₹{deliveryFee}</span> ₹0
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">{translate('Travel Cost (₹20 Saved)', isMarathi)}</span>
          <span className="summary-value">
            <span className="strikethrough">₹{travelCost}</span> ₹0
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">{translate('GST', isMarathi)}</span>
          <span className="summary-value">18%</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">{translate('Total GST', isMarathi)}</span>
          <span className="summary-value">₹{Math.round(gstAmount).toLocaleString('en-IN')}</span>
        </div>
        <div className="summary-row total-row">
          <span className="summary-label">{translate('Total Payable', isMarathi)}</span>
          <span className="summary-value total-amount">₹{Math.round(totalPayable).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Offers Section */}
      <div className="offers-section">
        <div className="offers-icon">%</div>
        <span className="offers-text">{translate('Avail Offers / Coupons', isMarathi)}</span>
        <div className="offers-arrow">→</div>
      </div>

      {/* Instructions for Pilots */}
      <div className="instructions-section">
        <h3 className="instructions-title">{translate('Instructions for Pilots', isMarathi)}</h3>
        <p className="instructions-subtitle">{translate('Pilots will be notified', isMarathi)}</p>
        
        <div className="instruction-cards">
          <div 
            className={`instruction-card ${selectedInstruction === 'call' ? 'selected' : ''}`}
            onClick={() => setSelectedInstruction('call')}
          >
            <div className="instruction-icon">🛍️</div>
            <div className="instruction-content">
              <div className="instruction-title">{translate('Call me 1 Hr Before', isMarathi)}</div>
              <div className="instruction-desc">
                {translate('The pilot will call you 1 hour before reaching the selected location', isMarathi)}
              </div>
            </div>
          </div>

          <div 
            className={`instruction-card ${selectedInstruction === 'nocontact' ? 'selected' : ''}`}
            onClick={() => setSelectedInstruction('nocontact')}
          >
            <div className="instruction-icon">🚪</div>
            <div className="instruction-content">
              <div className="instruction-title">{translate('No Contact', isMarathi)}</div>
              <div className="instruction-desc">
                {translate('The pilot will directly go to the selected location without calling', isMarathi)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pilot Safety Section */}
      <div className="safety-section">
        <div className="safety-icon">🚚</div>
        <div className="safety-text">
          {translate('See how we ensure our Pilot\'s safety', isMarathi)}
        </div>
        <a href="#" className="learn-more-link">{translate('Learn more', isMarathi)}</a>
      </div>

      {/* Continue to Pay Button */}
      <button 
        className="pay-button"
        onClick={handleProceedToPayment}
        disabled={isProcessing}
      >
        {isProcessing 
          ? translate('Processing...', isMarathi) 
          : `${translate('Proceed to Payment', isMarathi)} ₹${Math.round(totalPayable).toLocaleString('en-IN')}`
        }
      </button>
      
      {errorMessage && (
        <div style={{ 
          color: 'red', 
          marginTop: '10px', 
          padding: '10px', 
          textAlign: 'center',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {errorMessage}
        </div>
      )}
    </div>
  )
}

export default CheckoutPage


