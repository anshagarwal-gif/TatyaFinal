import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FiMapPin,
  FiChevronLeft,
  FiCalendar,
  FiCheckCircle,
  FiArrowRightCircle,
  FiUser,
  FiClipboard,
  FiMaximize2,
  FiDroplet,
  FiClock,
  FiThermometer,
  FiStar
} from 'react-icons/fi'
import '../styles/BookingPage.css'
import droneImage from '../assets/Drone.jpg'
import { translate } from '../utils/translations'

function BookingPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState('Acre')
  const [selectedDate, setSelectedDate] = useState('')
  const [confirmedLocation, setConfirmedLocation] = useState(null)
  const [locationAddress, setLocationAddress] = useState('')
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [isMarathi, setIsMarathi] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()


  // Price calculation
  const pricePerUnit = 400
  const totalPrice = quantity * pricePerUnit

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  // Service cards data
  const serviceCards = [
    {
      icon: <FiDroplet />,
      value: '10L Tank',
      desc: 'Sufficient for 1 Acre'
    },
    {
      icon: <FiClock />,
      value: '5Min/ Acre',
      desc: 'Time'
    },
    {
      icon: <FiThermometer />,
      value: 'Cool Season',
      desc: 'Temp Control'
    }
  ]


  // Fetch location from navigation state or localStorage
  useEffect(() => {
    // First try to get from navigation state
    const locationFromState = location.state?.location || location.state?.coordinates
    
    if (locationFromState) {
      setConfirmedLocation(locationFromState)
      // Store in localStorage as backup
      localStorage.setItem('confirmedLocation', JSON.stringify({
        coordinates: locationFromState,
        timestamp: new Date().toISOString()
      }))
      fetchLocationAddress(locationFromState)
    } else {
      // Try to get from localStorage
      const storedLocation = localStorage.getItem('confirmedLocation')
      if (storedLocation) {
        try {
          const locationData = JSON.parse(storedLocation)
          setConfirmedLocation(locationData.coordinates)
          fetchLocationAddress(locationData.coordinates)
        } catch (err) {
          console.error('Error parsing stored location:', err)
        }
      } else {
        // No location found, redirect to location page
        alert('Please select a location first')
        navigate('/location')
      }
    }
  }, [location.state, navigate])

  // Fetch address from coordinates using reverse geocoding
  const fetchLocationAddress = async (coordinates) => {
    setLoadingAddress(true)
    try {
      const [lat, lng] = coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Tatya Agricultural App'
          }
        }
      )
      const data = await response.json()
      if (data.display_name) {
        setLocationAddress(data.display_name)
      } else {
        setLocationAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
      }
    } catch (err) {
      console.error('Error fetching address:', err)
      if (coordinates) {
        const [lat, lng] = coordinates
        setLocationAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
      }
    } finally {
      setLoadingAddress(false)
    }
  }

  const handleBookNow = () => {
    if (!selectedDate) {
      alert('Please select a date for booking')
      return
    }
    if (!confirmedLocation) {
      alert('Location is missing. Please go back and select a location.')
      navigate('/location')
      return
    }
    navigate('/checkout', {
      state: {
        location: confirmedLocation,
        quantity,
        unit: selectedUnit,
        date: selectedDate,
        totalPrice,
        pricePerUnit
      }
    })
  }

  const handleChangeLocation = () => {
    navigate('/location')
  }

  return (
    <div className="booking-page">
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
      {/* Back Button */}
      <button 
        className="back-button-top"
        onClick={() => navigate(-1)}
        title="Go back"
      >
        <FiChevronLeft />
      </button>

      {/* Drone Image */}
      <div className="drone-image-section">
        <div className="drone-image-container">
          <img 
            src={droneImage} 
            alt="Agricultural Drone" 
            className="drone-image"
            onError={(e) => {
              // Fallback if image doesn't load
              e.target.style.display = 'none'
            }}
          />
        </div>
      </div>

      {/* Drone Information Card - Black Section */}
      <div className="drone-info-header-black">
        <div className="info-header">
          <div className="drone-name-section">
            <p className="breadcrumb-text">
              {translate('Service / Drone Spraying', isMarathi)}
            </p>
            <h2 className="drone-name">
              {translate('Premium Crop Protection Drone', isMarathi)}
            </h2>
            <p className="drone-subtitle">
              {translate('High-precision spraying for faster, uniform coverage', isMarathi)}
            </p>
            <div className="rating">
              <span className="rating-value">4.3</span>
              <span className="star-icon">
                <FiStar />
              </span>
              <span className="rating-text">
                {translate('Rated by local farmers', isMarathi)}
              </span>
            </div>
          </div>
          <div className="price-section">
            <div className="price">400/-</div>
            <div className="price-unit">
              <span className="unit-label">{translate('Guntha /', isMarathi)}</span>
              <button className="unit-button active">{translate('Acre', isMarathi)}</button>
            </div>
          </div>
        </div>
      </div>

      {/* White Section - Slideshow and Rest of Content */}
      <div className="booking-content-white">
        <div className="booking-dark-section">
          {/* Location Summary */}
          <div className="location-card-booking">
            <div className="location-header">
              <div className="location-icon-wrapper">
                <span className="location-icon">
                  <FiMapPin />
                </span>
              </div>
              <button
                type="button"
                className="change-location-btn"
                onClick={handleChangeLocation}
              >
                {translate('Change Location', isMarathi)}
              </button>
            </div>
            <div className="location-info">
              <div className="location-title">
                {translate('Selected Field Location', isMarathi)}
              </div>
              <div className="location-address">
                {loadingAddress
                  ? <span className="loading-address">{translate('Fetching address…', isMarathi)}</span>
                  : locationAddress || translate('Address not available', isMarathi)}
              </div>
              {confirmedLocation && (
                <div className="location-coordinates">
                  {translate('Coordinates', isMarathi)}:{' '}
                  {Array.isArray(confirmedLocation) &&
                    `${confirmedLocation[0].toFixed(6)}, ${confirmedLocation[1].toFixed(6)}`}
                </div>
              )}
            </div>
          </div>

          {/* Service Details Cards */}
          <div className="service-cards-container">
            {serviceCards.map((card, index) => {
              return (
                <div key={index} className="service-card">
                  <div className="service-icon-text">{card.icon}</div>
                  <div className="service-value">{translate(card.value, isMarathi)}</div>
                  <div className="service-desc">{translate(card.desc, isMarathi)}</div>
                </div>
              )
            })}
          </div>

          {/* Pilot Information */}
          <div className="pilot-card">
            <div className="pilot-avatar">
              <div className="avatar-placeholder">
                <FiUser />
              </div>
            </div>
            <div className="pilot-info">
              <div className="pilot-name">{translate('Pilot Name', isMarathi)}</div>
              <div className="pilot-details">
                {translate('Location and other details regarding the pilot', isMarathi)}
              </div>
            </div>
          </div>

          {/* Give us details Section */}
          <div className="details-section">
            <h3 className="section-title">
              <span className="title-icon">
                <FiClipboard />
              </span>
              {translate('Booking Details', isMarathi)}
            </h3>
            
            <div className="quantity-selector">
              <label className="quantity-label">
                <span className="label-icon">
                  <FiMaximize2 />
                </span>
                {translate('Quantity', isMarathi)} ({translate(selectedUnit, isMarathi)})
              </label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn minus"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <div className="quantity-display">
                  <span className="quantity-value">{quantity}</span>
                  <span className="quantity-unit">{selectedUnit}</span>
                </div>
                <button 
                  className="quantity-btn plus"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="unit-selector">
              <label className="unit-label-text">{translate('Select Unit Type', isMarathi)}</label>
              <div className="unit-buttons">
                <button 
                  className={`unit-select-btn ${selectedUnit === 'Acre' ? 'active' : ''}`}
                  onClick={() => setSelectedUnit('Acre')}
                >
                  <span className="unit-icon">
                    <FiMaximize2 />
                  </span>
                  <span>{translate('Acre', isMarathi)}</span>
                </button>
                <button 
                  className={`unit-select-btn ${selectedUnit === 'Hour' ? 'active' : ''}`}
                  onClick={() => setSelectedUnit('Hour')}
                >
                  <span className="unit-icon">
                    <FiClock />
                  </span>
                  <span>{translate('Hour', isMarathi)}</span>
                </button>
                <button 
                  className={`unit-select-btn ${selectedUnit === 'Day' ? 'active' : ''}`}
                  onClick={() => setSelectedUnit('Day')}
                >
                  <span className="unit-icon">
                    <FiCalendar />
                  </span>
                  <span>{translate('Day', isMarathi)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Select Date Section */}
          <div className="date-section">
            <label className="date-label">
              <span className="label-icon">
                <FiCalendar />
              </span>
              {translate('Select Booking Date', isMarathi)}
            </label>
            <div className="date-picker">
              <input 
                type="date" 
                className="date-input" 
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {selectedDate && (
                <div className="date-selected">
                  <span className="date-icon">
                    <FiCheckCircle />
                  </span>
                  {translate('Selected:', isMarathi)} {new Date(selectedDate).toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div className="price-summary">
          <div className="summary-row">
            <span className="summary-label">{translate('Price per', isMarathi)} {translate(selectedUnit, isMarathi)}</span>
            <span className="summary-value">₹{pricePerUnit}</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">{translate('Quantity', isMarathi)}</span>
            <span className="summary-value">{quantity} {translate(selectedUnit, isMarathi)}{quantity > 1 ? (isMarathi ? '' : 's') : ''}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span className="summary-label">{translate('Total Amount', isMarathi)}</span>
            <span className="summary-value total-price">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Book Now Button */}
      <button 
        className={`book-now-button ${!selectedDate ? 'disabled' : ''}`}
        onClick={handleBookNow}
        disabled={!selectedDate}
      >
        <span className="button-icon">
          <FiArrowRightCircle />
        </span>
        <span>{translate('Book Now', isMarathi)} - ₹{totalPrice.toLocaleString('en-IN')}</span>
      </button>
    </div>
  )
}

export default BookingPage


