import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/BookingPage.css'
import droneImage from '../assets/Drone.jpg'
import { translate } from '../utils/translations'
import { 
  getAvailableDrones, 
  getAvailableDronesWithSpecifications,
  getDroneById, 
  getDroneWithSpecifications,
  getAvailableDates, 
  getAvailableSlotsByDate,
  getAvailableDroneSpecificationsByDroneId
} from '../services/api'

function BookingPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState('Acre')
  const [selectedDate, setSelectedDate] = useState('')
  const [confirmedLocation, setConfirmedLocation] = useState(null)
  const [locationAddress, setLocationAddress] = useState('')
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [isMarathi, setIsMarathi] = useState(false)
  const [drones, setDrones] = useState([])
  const [selectedDrone, setSelectedDrone] = useState(null)
  const [droneSpecifications, setDroneSpecifications] = useState([])
  const [selectedSpecification, setSelectedSpecification] = useState(null)
  const [availableDates, setAvailableDates] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingDrones, setLoadingDrones] = useState(false)
  const [loadingAvailability, setLoadingAvailability] = useState(false)
  const [loadingSpecifications, setLoadingSpecifications] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()


  // Price calculation based on selected unit and drone pricing
  const getPricePerUnit = () => {
    if (!selectedDrone) return 400
    
    if (selectedUnit === 'Acre' && selectedDrone.pricePerAcre) {
      return parseFloat(selectedDrone.pricePerAcre)
    } else if (selectedUnit === 'Hour' && selectedDrone.pricePerHour) {
      return parseFloat(selectedDrone.pricePerHour)
    } else if (selectedUnit === 'Day' && selectedDrone.pricePerHour) {
      // Assuming 8 hours per day
      return parseFloat(selectedDrone.pricePerHour) * 8
    }
    return 400 // Default fallback
  }

  const pricePerUnit = getPricePerUnit()
  const totalPrice = quantity * pricePerUnit

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  // Service cards data - dynamically generated from specifications
  const getServiceCards = () => {
    if (selectedSpecification) {
      return [
        {
          icon: '🛢️',
          value: `${selectedSpecification.tankSizeLiters}L Tank`,
          desc: selectedSpecification.sprinklerType || 'Tank Capacity'
        },
        {
          icon: '⏱️',
          value: `${selectedSpecification.timePerAcreMinutes || '5'} Min/Acre`,
          desc: 'Time per Acre'
        },
        {
          icon: '📏',
          value: `${selectedSpecification.sprayWidthMeters}m Width`,
          desc: 'Spray Width'
        }
      ]
    }
    // Default fallback
    return [
      {
        icon: '🛢️',
        value: '10L Tank',
        desc: 'Sufficient for 1 Acre'
      },
      {
        icon: '⏱️',
        value: '5Min/ Acre',
        desc: 'Time'
      },
      {
        icon: '🌡️',
        value: 'Cool Season',
        desc: 'Temp Control'
      }
    ]
  }

  const serviceCards = getServiceCards()


  // Fetch available drones on component mount
  useEffect(() => {
    fetchAvailableDrones()
  }, [])

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

  // Fetch drone details with specifications when drone is selected
  useEffect(() => {
    if (selectedDrone && selectedDrone.droneId) {
      const droneId = selectedDrone.droneId
      
      // Only fetch if specifications are not already loaded
      if (!selectedDrone.specifications || selectedDrone.specifications.length === 0) {
        fetchDroneWithSpecifications(droneId)
      } else {
        // Use existing specifications
        setDroneSpecifications(selectedDrone.specifications)
        const availableSpec = selectedDrone.specifications.find(spec => spec.isAvailable) || selectedDrone.specifications[0]
        setSelectedSpecification(availableSpec)
      }
      
      fetchAvailableDatesForDrone(droneId)
    }
  }, [selectedDrone])

  // Fetch available slots when date is selected
  useEffect(() => {
    if (selectedDrone && selectedDrone.droneId && selectedDate) {
      fetchAvailableSlotsForDate(selectedDrone.droneId, selectedDate)
    }
  }, [selectedDate, selectedDrone])

  // Fetch available drones with specifications
  const fetchAvailableDrones = async () => {
    setLoadingDrones(true)
    try {
      // Use getAvailableDronesWithSpecifications to get everything in one call
      const response = await getAvailableDronesWithSpecifications()
      console.log('Drones response:', response)
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setDrones(response.data)
        // Auto-select first drone if available
        if (response.data.length > 0) {
          const firstDrone = response.data[0]
          setSelectedDrone(firstDrone)
          console.log('Selected drone:', firstDrone)
          
          // If drone already has specifications, set them
          if (firstDrone.specifications && Array.isArray(firstDrone.specifications) && firstDrone.specifications.length > 0) {
            setDroneSpecifications(firstDrone.specifications)
            const availableSpec = firstDrone.specifications.find(spec => spec.isAvailable) || firstDrone.specifications[0]
            setSelectedSpecification(availableSpec)
            console.log('Selected specification:', availableSpec)
          }
        } else {
          console.warn('No drones available')
        }
      } else {
        console.error('Failed to fetch drones:', response.message || 'Unknown error')
        // Fallback to regular API if the with-specifications fails
        const fallbackResponse = await getAvailableDrones()
        console.log('Fallback response:', fallbackResponse)
        if (fallbackResponse.success && fallbackResponse.data) {
          setDrones(fallbackResponse.data)
          if (fallbackResponse.data.length > 0) {
            setSelectedDrone(fallbackResponse.data[0])
          }
        }
      }
    } catch (error) {
      console.error('Error fetching drones:', error)
      // Fallback to regular API if the with-specifications fails
      try {
        const fallbackResponse = await getAvailableDrones()
        if (fallbackResponse.success && fallbackResponse.data) {
          setDrones(fallbackResponse.data)
          if (fallbackResponse.data.length > 0) {
            setSelectedDrone(fallbackResponse.data[0])
          }
        }
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
      }
    } finally {
      setLoadingDrones(false)
    }
  }

  // Fetch drone with specifications
  const fetchDroneWithSpecifications = async (droneId) => {
    setLoadingSpecifications(true)
    try {
      console.log('Fetching drone with specifications for ID:', droneId)
      const response = await getDroneWithSpecifications(droneId)
      console.log('Drone with specs response:', response)
      
      if (response.success && response.data) {
        const droneData = response.data
        // Update selected drone with full details
        setSelectedDrone(droneData)
        
        // Get specifications
        if (droneData.specifications && droneData.specifications.length > 0) {
          setDroneSpecifications(droneData.specifications)
          // Auto-select first available specification
          const availableSpec = droneData.specifications.find(spec => spec.isAvailable) || droneData.specifications[0]
          setSelectedSpecification(availableSpec)
          console.log('Loaded specifications:', droneData.specifications)
        } else {
          // If no specifications in drone data, fetch separately
          console.log('No specifications in drone data, fetching separately...')
          const specResponse = await getAvailableDroneSpecificationsByDroneId(droneId)
          console.log('Separate specs response:', specResponse)
          
          if (specResponse.success && specResponse.data) {
            setDroneSpecifications(specResponse.data)
            if (specResponse.data.length > 0) {
              setSelectedSpecification(specResponse.data[0])
            }
          }
        }
      } else {
        console.error('Failed to fetch drone:', response.message)
      }
    } catch (error) {
      console.error('Error fetching drone specifications:', error)
    } finally {
      setLoadingSpecifications(false)
    }
  }

  // Fetch available dates for a drone
  const fetchAvailableDatesForDrone = async (droneId) => {
    setLoadingAvailability(true)
    try {
      const response = await getAvailableDates(droneId)
      if (response.success && response.data) {
        // Convert dates to YYYY-MM-DD format strings
        const dateStrings = response.data.map(date => {
          if (typeof date === 'string') {
            return date.split('T')[0] // Handle ISO string format
          }
          // If it's already a date object, format it
          const dateObj = new Date(date)
          return dateObj.toISOString().split('T')[0]
        })
        setAvailableDates(dateStrings)
        console.log('Available dates:', dateStrings)
      }
    } catch (error) {
      console.error('Error fetching available dates:', error)
    } finally {
      setLoadingAvailability(false)
    }
  }

  // Check if a date is available
  const isDateAvailable = (dateString) => {
    if (!dateString || availableDates.length === 0) return false
    // Normalize date string to YYYY-MM-DD format
    const normalizedDate = dateString.split('T')[0]
    return availableDates.some(availDate => {
      const normalizedAvail = availDate.split('T')[0]
      return normalizedAvail === normalizedDate
    })
  }

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (e) {
      return dateString
    }
  }

  // Get vendor/pilot name from selected drone
  const getVendorName = () => {
    if (!selectedDrone || !selectedDrone.vendor) return translate('Pilot Name', isMarathi)
    if (selectedDrone.vendor.user && selectedDrone.vendor.user.fullName) {
      return selectedDrone.vendor.user.fullName
    }
    return translate('Pilot Name', isMarathi)
  }

  // Get vendor details
  const getVendorDetails = () => {
    if (!selectedDrone || !selectedDrone.vendor) {
      return translate('Location and other details regarding the pilot', isMarathi)
    }
    const vendor = selectedDrone.vendor
    const details = []
    
    if (vendor.serviceArea) {
      details.push(`Service Area: ${vendor.serviceArea}`)
    }
    if (vendor.experienceYears) {
      details.push(`${vendor.experienceYears} years experience`)
    }
    if (vendor.ratingAvg) {
      details.push(`Rating: ${vendor.ratingAvg}`)
    }
    
    return details.length > 0 
      ? details.join(' • ') 
      : translate('Location and other details regarding the pilot', isMarathi)
  }

  // Fetch available slots for a specific date
  const fetchAvailableSlotsForDate = async (droneId, date) => {
    try {
      const response = await getAvailableSlotsByDate(droneId, date)
      if (response.success && response.data) {
        setAvailableSlots(response.data)
      }
    } catch (error) {
      console.error('Error fetching available slots:', error)
    }
  }

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
      alert(translate('Please select a date for booking', isMarathi))
      return
    }
    if (!isDateAvailable(selectedDate)) {
      alert(translate('Please select an available date', isMarathi))
      return
    }
    if (!confirmedLocation) {
      alert(translate('Location is missing. Please go back and select a location.', isMarathi))
      navigate('/location')
      return
    }
    if (!selectedDrone) {
      alert(translate('Please wait for drone information to load', isMarathi))
      return
    }
    navigate('/checkout', {
      state: {
        location: confirmedLocation,
        quantity,
        unit: selectedUnit,
        date: selectedDate,
        totalPrice,
        pricePerUnit,
        drone: selectedDrone,
        specification: selectedSpecification,
        vendor: selectedDrone.vendor
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
        ←
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

      {/* Drone Selector (if multiple drones available) - Single selector */}
      {drones.length > 1 && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f9f9f9', 
          marginBottom: '10px',
          borderRadius: '8px',
          margin: '10px'
        }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: '500', 
            fontSize: '14px',
            color: '#333'
          }}>
            {translate('Select Drone', isMarathi)}:
          </label>
          <select
            value={selectedDrone?.droneId || ''}
            onChange={(e) => {
              const droneId = parseInt(e.target.value)
              const drone = drones.find(d => d.droneId === droneId)
              if (drone) {
                setSelectedDrone(drone)
              }
            }}
            disabled={loadingDrones || loadingSpecifications}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            {drones.map((drone) => (
              <option key={drone.droneId} value={drone.droneId}>
                {drone.droneModel || `Drone #${drone.droneId}`} 
                {drone.capacityLiters ? ` (${drone.capacityLiters}L)` : ''}
                {drone.pricePerAcre ? ` - ₹${drone.pricePerAcre}/Acre` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Drone Information Card - Black Section */}
      <div className="drone-info-header-black">
        <div className="info-header">
          <div className="drone-name-section">
            <h2 className="drone-name">
              {loadingDrones || loadingSpecifications 
                ? translate('Loading...', isMarathi)
                : selectedDrone?.droneModel || translate('Drone Name', isMarathi)
              }
            </h2>
            <div className="rating">
              <span className="rating-value">4.3</span>
              <span className="star-icon">⭐</span>
            </div>
          </div>
          <div className="price-section">
            <div className="price">₹{pricePerUnit.toFixed(0)}/-</div>
            <div className="price-unit">
              <span className="unit-label">{translate('Per', isMarathi)}</span>
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
            {loadingSpecifications ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                {translate('Loading specifications...', isMarathi)}
              </div>
            ) : (
              serviceCards.map((card, index) => {
                return (
                  <div key={index} className="service-card">
                    <div className="service-icon-text">{card.icon} </div>
                    <div className="service-value">{card.value}</div>
                    <div className="service-desc">{card.desc}</div>
                  </div>
                )
              })
            )}
          </div>

          {/* Specification Selector (if multiple specifications available) */}
          {droneSpecifications.length > 1 && (
            <div className="specification-selector" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <label className="unit-label-text" style={{ marginBottom: '10px', display: 'block' }}>
                {translate('Select Specification Option', isMarathi)}
              </label>
              <div className="spec-options" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {droneSpecifications.map((spec) => (
                  <button
                    key={spec.specId}
                    className={`spec-option-btn ${selectedSpecification?.specId === spec.specId ? 'active' : ''}`}
                    onClick={() => setSelectedSpecification(spec)}
                    style={{
                      padding: '10px 15px',
                      border: selectedSpecification?.specId === spec.specId ? '2px solid #4CAF50' : '1px solid #ddd',
                      borderRadius: '6px',
                      backgroundColor: selectedSpecification?.specId === spec.specId ? '#e8f5e9' : 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Option Set {spec.optionSet}
                    {spec.isAvailable ? ' ✓' : ' (Unavailable)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pilot Information */}
          <div className="pilot-card">
            <div className="pilot-avatar">
              <div className="avatar-placeholder">👨</div>
            </div>
            <div className="pilot-info">
              <div className="pilot-name">
                {loadingDrones || loadingSpecifications 
                  ? translate('Loading...', isMarathi)
                  : getVendorName()
                }
              </div>
              <div className="pilot-details">
                {loadingDrones || loadingSpecifications 
                  ? translate('Loading details...', isMarathi)
                  : getVendorDetails()
                }
              </div>
            </div>
          </div>

          {/* Give us details Section */}
          <div className="details-section">
            <h3 className="section-title">
              <span className="title-icon">📋</span>
              {translate('Booking Details', isMarathi)}
            </h3>
            
            <div className="quantity-selector">
              <label className="quantity-label">
                <span className="label-icon">📏</span>
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
                  <span className="unit-icon">🌾</span>
                  <span>{translate('Acre', isMarathi)}</span>
                </button>
                <button 
                  className={`unit-select-btn ${selectedUnit === 'Hour' ? 'active' : ''}`}
                  onClick={() => setSelectedUnit('Hour')}
                >
                  <span className="unit-icon">⏰</span>
                  <span>{translate('Hour', isMarathi)}</span>
                </button>
                <button 
                  className={`unit-select-btn ${selectedUnit === 'Day' ? 'active' : ''}`}
                  onClick={() => setSelectedUnit('Day')}
                >
                  <span className="unit-icon">📅</span>
                  <span>{translate('Day', isMarathi)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Select Date Section */}
          <div className="date-section">
            <label className="date-label">
              <span className="label-icon">📅</span>
              {translate('Select Booking Date', isMarathi)}
            </label>
            {loadingAvailability ? (
              <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                {translate('Loading available dates...', isMarathi)}
              </div>
            ) : availableDates.length === 0 ? (
              <div style={{ padding: '10px', textAlign: 'center', color: '#d32f2f' }}>
                {translate('No available dates for this drone', isMarathi)}
              </div>
            ) : (
              <>
                <div className="date-picker">
                  <input 
                    type="date" 
                    className="date-input" 
                    min={today}
                    value={selectedDate}
                    onChange={(e) => {
                      const selected = e.target.value
                      if (isDateAvailable(selected)) {
                        setSelectedDate(selected)
                      } else {
                        alert(translate('This date is not available. Please select from available dates.', isMarathi))
                        // Reset to empty or keep previous selection
                        e.target.value = selectedDate || ''
                      }
                    }}
                    onFocus={(e) => {
                      // Show available dates hint
                      e.target.title = translate('Only available dates can be selected', isMarathi)
                    }}
                    style={{
                      borderColor: selectedDate && !isDateAvailable(selectedDate) ? '#d32f2f' : undefined
                    }}
                  />
                  {selectedDate && (
                    <div className="date-selected" style={{
                      color: isDateAvailable(selectedDate) ? 'inherit' : '#d32f2f'
                    }}>
                      <span className="date-icon">{isDateAvailable(selectedDate) ? '✓' : '⚠'}</span>
                      {translate('Selected:', isMarathi)} {formatDateForDisplay(selectedDate)}
                      {!isDateAvailable(selectedDate) && (
                        <span style={{ color: '#d32f2f', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                          {translate('(Not available)', isMarathi)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {/* Show available dates list */}
                <div style={{ 
                  marginTop: '10px', 
                  fontSize: '12px', 
                  color: '#666',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '5px'
                }}>
                  <span style={{ fontWeight: '500' }}>{translate('Available dates:', isMarathi)}</span>
                  {availableDates.slice(0, 5).map((date, idx) => (
                    <span 
                      key={idx}
                      onClick={() => setSelectedDate(date)}
                      style={{
                        cursor: 'pointer',
                        padding: '2px 8px',
                        backgroundColor: selectedDate === date ? '#4CAF50' : '#e0e0e0',
                        color: selectedDate === date ? 'white' : '#333',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    >
                      {new Date(date + 'T00:00:00').toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  ))}
                  {availableDates.length > 5 && (
                    <span style={{ color: '#999' }}>+{availableDates.length - 5} more</span>
                  )}
                </div>
              </>
            )}
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
        <span className="button-icon">✈️</span>
        <span>{translate('Book Now', isMarathi)} - ₹{totalPrice.toLocaleString('en-IN')}</span>
      </button>
    </div>
  )
}

export default BookingPage


