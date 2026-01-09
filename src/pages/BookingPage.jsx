import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
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
  FiStar,
  FiLoader
} from 'react-icons/fi'
import '../styles/BookingPage.css'
import droneImage from '../assets/Drone.jpg'
import { translate } from '../utils/translations'
import { 
  getDroneWithSpecifications, 
  getAvailableDates,
  getAvailableSlotsByDate,
  createBooking
} from '../services/api'

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
  const [searchParams] = useSearchParams()

  // API data states
  const [drone, setDrone] = useState(null)
  const [loading, setLoading] = useState(true)
  const [availableDates, setAvailableDates] = useState([])
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState(null)

  // Get droneId from URL params, navigation state, or localStorage
  const droneId = searchParams.get('droneId') || location.state?.droneId || location.state?.drone?.droneId || localStorage.getItem('selectedDroneId')

  // Price calculation - will be updated from drone data
  const pricePerUnit = selectedUnit === 'Acre' 
    ? (drone?.pricePerAcre ? Number(drone.pricePerAcre) : 400)
    : selectedUnit === 'Hour'
    ? (drone?.pricePerHour ? Number(drone.pricePerHour) : 400)
    : 400
  const totalPrice = quantity * pricePerUnit

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  // Service cards data
  const [serviceCards, setServiceCards] = useState([
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
  ])


  // Fetch drone data from API
  useEffect(() => {
    const fetchDroneData = async () => {
      setLoading(true)
      setError(null)

      try {
        let droneData = null
        let selectedDroneId = droneId

        // Check if drone data was passed from LocationPage
        if (location.state?.drone) {
          droneData = location.state.drone
          selectedDroneId = droneData.droneId
        } else if (selectedDroneId) {
          // Fetch specific drone
          const response = await getDroneWithSpecifications(selectedDroneId)
          if (response.success && response.data) {
            droneData = response.data
          } else {
            setError('Drone not found')
            setLoading(false)
            return
          }
        } else {
          setError('Please select a drone from the location page. Go back and select a drone.')
          setLoading(false)
          return
        }

        if (droneData) {
          setDrone(droneData)

          // Update service cards with actual drone specifications from database
          // Extract values from database, handling both direct values and nested structures
          const capacity = droneData.capacityLiters != null && droneData.capacityLiters !== undefined 
            ? Math.round(Number(droneData.capacityLiters)) 
            : null
          const flightTime = droneData.flightTimeMinutes != null && droneData.flightTimeMinutes !== undefined 
            ? Number(droneData.flightTimeMinutes) 
            : null
          const batteries = droneData.batteryCount != null && droneData.batteryCount !== undefined 
            ? Number(droneData.batteryCount) 
            : null
          
          // Create service cards with database values
          const updatedCards = [
            {
              icon: <FiDroplet />,
              value: capacity != null ? `${capacity}L Tank` : 'N/A',
              desc: 'Capacity'
            },
            {
              icon: <FiClock />,
              value: flightTime != null ? `${flightTime}Min/ Acre` : 'N/A',
              desc: 'Flight Time'
            },
            {
              icon: <FiThermometer />,
              value: batteries != null ? `${batteries} Batteries` : 'N/A',
              desc: 'Battery Count'
            }
          ]
          setServiceCards(updatedCards)
          
          // Debug log to verify data is coming from database
          console.log('Drone data from database:', {
            capacityLiters: droneData.capacityLiters,
            flightTimeMinutes: droneData.flightTimeMinutes,
            batteryCount: droneData.batteryCount,
            formatted: { capacity, flightTime, batteries }
          })

          // Fetch available dates and limit to 1 week (7 days)
          const datesResponse = await getAvailableDates(selectedDroneId)
          if (datesResponse.success && datesResponse.data) {
            // Limit to first 7 dates (1 week)
            const limitedDates = datesResponse.data.slice(0, 7)
            setAvailableDates(limitedDates)
          }
        }
      } catch (err) {
        console.error('Error fetching drone data:', err)
        setError('Failed to load drone information. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDroneData()
  }, [droneId, location.state])


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


  const handleBookNow = async () => {
    if (!selectedDate) {
      alert('Please select a date for booking')
      return
    }
    if (!confirmedLocation) {
      alert('Location is missing. Please go back and select a location.')
      navigate('/location')
      return
    }
    if (!drone) {
      alert('Drone information is not loaded. Please try again.')
      return
    }

    setIsBooking(true)
    try {
      // Get first available slot for the selected date (or use default times)
      let startTime = '06:00:00'
      let endTime = '18:00:00'
      
      try {
        const slotsResponse = await getAvailableSlotsByDate(drone.droneId, selectedDate)
        if (slotsResponse.success && slotsResponse.data && slotsResponse.data.length > 0) {
          const firstSlot = slotsResponse.data[0]
          startTime = firstSlot.startTime || firstSlot.start_time || '06:00:00'
          endTime = firstSlot.endTime || firstSlot.end_time || '18:00:00'
        }
      } catch (err) {
        console.warn('Could not fetch slots, using default times:', err)
      }

      // Get customer ID from localStorage or use default (for testing)
      // In production, this should come from authentication
      const customerId = localStorage.getItem('userId') || localStorage.getItem('customerId') || 1

      // Calculate farm area in acres based on quantity and unit
      let farmAreaAcres = null
      if (selectedUnit === 'Acre') {
        farmAreaAcres = quantity
      } else if (selectedUnit === 'Hour') {
        // Convert hours to approximate acres (assuming 1 hour = 2 acres for estimation)
        farmAreaAcres = quantity * 2
      } else if (selectedUnit === 'Day') {
        // Convert days to approximate acres (assuming 1 day = 10 acres for estimation)
        farmAreaAcres = quantity * 10
      }

      // Prepare booking data
      const bookingData = {
        customerId: Number(customerId),
        droneId: drone.droneId,
        serviceDate: selectedDate,
        startTime: startTime,
        endTime: endTime,
        locationLat: Number(confirmedLocation[0]),
        locationLong: Number(confirmedLocation[1]),
        farmAreaAcres: farmAreaAcres ? Number(farmAreaAcres) : null,
        serviceType: 'SPRAYING', // Default service type
        totalCost: Number(totalPrice.toFixed(2)),
        quantity: quantity,
        unit: selectedUnit
      }

      // Create booking via API
      const response = await createBooking(bookingData)
      
      if (response.success) {
        // Booking created successfully
        alert('Booking created successfully!')
        // Navigate to checkout with booking data
        navigate('/checkout', {
          state: {
            location: confirmedLocation,
            quantity,
            unit: selectedUnit,
            date: selectedDate,
            totalPrice,
            pricePerUnit,
            droneId: drone.droneId,
            bookingId: response.data?.bookingId || response.data?.booking_id
          }
        })
      } else {
        alert(response.message || 'Failed to create booking. Please try again.')
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert(error.message || 'Failed to create booking. Please try again.')
    } finally {
      setIsBooking(false)
    }
  }

  const handleChangeLocation = () => {
    navigate('/location')
  }

  // Loading state
  if (loading) {
    return (
      <div className="booking-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <FiLoader className="spinner" style={{ fontSize: '48px', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '16px' }}>Loading drone information...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || (!drone && !loading)) {
    return (
      <div className="booking-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '16px' }}>{error || 'Drone not found'}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/location')} 
              style={{ padding: '12px 24px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              {translate('Go to Location Page', isMarathi)}
            </button>
            <button 
              onClick={() => navigate(-1)} 
              style={{ padding: '12px 24px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              {translate('Go Back', isMarathi)}
            </button>
          </div>
        </div>
      </div>
    )
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
            alt={drone.droneModel || 'Agricultural Drone'} 
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
            <h2 className="drone-name">
              {drone.droneModel || translate('Premium Crop Protection Drone', isMarathi)}
            </h2>
            {drone.vendor?.user && (
              <div className="rating">
                <span className="rating-value">
                  {drone.vendor.ratingAvg ? Number(drone.vendor.ratingAvg).toFixed(1) : '4.3'}
                </span>
                <span className="star-icon">
                  <FiStar />
                </span>
                <span className="rating-text">
                  {translate('Rated by local farmers', isMarathi)}
                </span>
              </div>
            )}
          </div>
          <div className="price-section">
            <div className="price">₹{pricePerUnit}/-</div>
            <div className="price-unit">
              <span className="unit-label">{translate('Per', isMarathi)} </span>
              <button className="unit-button active">{translate(selectedUnit, isMarathi)}</button>
            </div>
          </div>
        </div>
      </div>

      {/* White Section - Slideshow and Rest of Content */}
      <div className="booking-content-white">
        <div className="booking-dark-section">

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


          {/* Pilot/Vendor Information */}
          {drone.vendor?.user && (
            <div className="pilot-card" style={{ marginBottom: '24px' }}>
              <div className="pilot-avatar">
                <div className="avatar-placeholder">
                  <FiUser />
                </div>
              </div>
              <div className="pilot-info" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <div className="pilot-name">
                    {drone.vendor.user.fullName || translate('Vendor', isMarathi)}
                  </div>
                  {drone.vendor.verifiedStatus === 'VERIFIED' && (
                    <span style={{ color: '#059669', fontSize: '0.75rem' }}>✓ Verified</span>
                  )}
                  {drone.vendor.ratingAvg && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
                      <FiStar style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                      <span>{Number(drone.vendor.ratingAvg).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="pilot-details">
                  {drone.vendor.serviceArea && (
                    <div style={{ marginBottom: '4px' }}>
                      <strong>{translate('Service Area:', isMarathi)}</strong> {drone.vendor.serviceArea}
                    </div>
                  )}
                  {drone.vendor.experienceYears && (
                    <div style={{ marginBottom: '4px' }}>
                      <strong>{translate('Experience:', isMarathi)}</strong> {drone.vendor.experienceYears} {translate('years', isMarathi)}
                    </div>
                  )}
                  {drone.vendor.licenseNo && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {translate('License:', isMarathi)} {drone.vendor.licenseNo}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
            
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <FiLoader style={{ animation: 'spin 1s linear infinite', fontSize: '24px', color: '#10b981' }} />
                <p style={{ marginTop: '8px', fontSize: '0.875rem', color: '#6b7280' }}>Loading available dates...</p>
              </div>
            ) : availableDates.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                gap: '12px',
                marginTop: '12px'
              }}>
                {availableDates.map((date, index) => {
                  const dateObj = new Date(date)
                  const isSelected = selectedDate === date
                  const dayName = dateObj.toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', { weekday: 'short' })
                  const dayNumber = dateObj.getDate()
                  const monthName = dateObj.toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', { month: 'short' })
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSelectedDate(date)
                      }}
                      style={{
                        padding: '12px 8px',
                        border: `2px solid ${isSelected ? '#10b981' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        backgroundColor: isSelected ? '#f0fdf4' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        minWidth: '90px'
                      }}
                    >
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: isSelected ? '#10b981' : '#6b7280',
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {dayName}
                      </div>
                      <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700',
                        color: isSelected ? '#059669' : '#111827'
                      }}>
                        {dayNumber}
                      </div>
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: isSelected ? '#10b981' : '#9ca3af',
                        textTransform: 'uppercase'
                      }}>
                        {monthName}
                      </div>
                      {isSelected && (
                        <FiCheckCircle style={{ 
                          fontSize: '16px', 
                          color: '#10b981',
                          marginTop: '2px'
                        }} />
                      )}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                marginTop: '12px'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {translate('No available dates for this drone', isMarathi)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Price Summary - Final Data Display */}
        <div className="price-summary">
          <div className="summary-row">
            <span className="summary-label">{translate('Price per Acre', isMarathi)}</span>
            <span className="summary-value">₹{pricePerUnit.toLocaleString('en-IN')}</span>
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
        className={`book-now-button ${!selectedDate || isBooking ? 'disabled' : ''}`}
        onClick={handleBookNow}
        disabled={!selectedDate || isBooking}
      >
        {isBooking ? (
          <>
            <FiLoader className="spinner" style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} />
            <span>{translate('Creating Booking...', isMarathi)}</span>
          </>
        ) : (
          <>
            <span className="button-icon">
              <FiArrowRightCircle />
            </span>
            <span>{translate('Book Now', isMarathi)} - ₹{totalPrice.toLocaleString('en-IN')}</span>
          </>
        )}
      </button>
    </div>
  )
}

export default BookingPage


