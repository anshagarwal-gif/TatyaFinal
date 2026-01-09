import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FiChevronLeft,
  FiTruck,
  FiPercent,
  FiChevronRight,
  FiPhoneCall,
  FiPhoneOff,
  FiShield,
  FiArrowRightCircle,
  FiLoader
} from 'react-icons/fi'
import '../styles/CheckoutPage.css'
import { translate } from '../utils/translations'
import { createPaymentOrder, verifyPayment, getRazorpayKey } from '../services/api'

function CheckoutPage() {
  const [selectedInstruction, setSelectedInstruction] = useState('call')
  const [isMarathi, setIsMarathi] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Get booking data from navigation state or localStorage
  const [bookingData, setBookingData] = useState({
    quantity: 1,
    unit: 'Acre',
    date: '',
    totalPrice: 400,
    pricePerUnit: 400,
    location: null,
    bookingId: null
  })
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

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
        location: stateData.location || null,
        bookingId: stateData.bookingId || null
      })
      // Also save to localStorage for persistence
      localStorage.setItem('bookingData', JSON.stringify({
        quantity: stateData.quantity || 1,
        unit: stateData.unit || 'Acre',
        date: stateData.date || '',
        totalPrice: stateData.totalPrice || 400,
        pricePerUnit: stateData.pricePerUnit || 400,
        location: stateData.location || null,
        bookingId: stateData.bookingId || null
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

  // Handle payment
  const handlePayment = async () => {
    if (!bookingData.bookingId) {
      alert('Booking ID is missing. Please go back and complete the booking first.')
      navigate('/booking')
      return
    }

    setIsProcessingPayment(true)
    try {
      // Create payment order
      const paymentOrderResponse = await createPaymentOrder({
        bookingId: bookingData.bookingId,
        amount: totalPayable
      })

      // Backend returns { orderId, amount } directly
      const orderId = paymentOrderResponse.orderId || paymentOrderResponse.data?.orderId
      const amount = Number(paymentOrderResponse.amount || paymentOrderResponse.data?.amount || totalPayable)

      if (!orderId) {
        throw new Error('Failed to create payment order')
      }

      // Get Razorpay key from backend API
      let razorpayKey
      try {
        const keyResponse = await getRazorpayKey()
        razorpayKey = keyResponse.keyId
        if (!razorpayKey || razorpayKey === 'rzp_test_placeholder') {
          throw new Error('Razorpay key is not configured. Please configure it in the backend application.properties file.')
        }
      } catch (keyError) {
        console.error('Error fetching Razorpay key:', keyError)
        throw new Error('Failed to initialize payment. Please ensure Razorpay is properly configured.')
      }

      // Initialize Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: Math.round(amount * 100), // Convert to paise (amount is in rupees)
        currency: 'INR',
        name: 'Tatya Agricultural Services',
        description: `Payment for booking #${bookingData.bookingId}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })

            if (verification.success) {
              alert('Payment successful! Your booking is confirmed.')
              // Navigate to success page or booking confirmation
              navigate('/booking-success', {
                state: {
                  bookingId: bookingData.bookingId,
                  paymentId: response.razorpay_payment_id
                }
              })
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            alert('Payment verification failed. Please contact support.')
          } finally {
            setIsProcessingPayment(false)
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#000000'
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error)
        alert(`Payment failed: ${response.error.description || 'Unknown error'}`)
        setIsProcessingPayment(false)
      })

      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert(error.message || 'Failed to initiate payment. Please try again.')
      setIsProcessingPayment(false)
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
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiChevronLeft />
        </button>
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
                {translate('Change Date', isMarathi)}
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
            <div className="delivery-person">
              <FiTruck />
            </div>
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
        <div className="offers-icon">
          <FiPercent />
        </div>
        <span className="offers-text">{translate('Avail Offers / Coupons', isMarathi)}</span>
        <div className="offers-arrow">
          <FiChevronRight />
        </div>
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
            <div className="instruction-icon">
              <FiPhoneCall />
            </div>
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
            <div className="instruction-icon">
              <FiPhoneOff />
            </div>
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
        <div className="safety-icon">
          <FiShield />
        </div>
        <div className="safety-text">
          {translate('See how we ensure our Pilot\'s safety', isMarathi)}
        </div>
        <a href="#" className="learn-more-link">{translate('Learn more', isMarathi)}</a>
      </div>

      {/* Continue to Pay Button */}
      <button 
        className="pay-button"
        onClick={handlePayment}
        disabled={isProcessingPayment || !bookingData.bookingId}
      >
        {isProcessingPayment ? (
          <>
            <FiLoader className="spinner" style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
            <span>{translate('Processing...', isMarathi)}</span>
          </>
        ) : (
          <>
            <span className="pay-button-icon">
              <FiArrowRightCircle />
            </span>
            <span>
              {translate('Proceed to Payment', isMarathi)} ₹{Math.round(totalPayable).toLocaleString('en-IN')}
            </span>
          </>
        )}
      </button>
    </div>
  )
}

export default CheckoutPage


