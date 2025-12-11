import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/BookingPage.css'
import droneImage from '../assets/Drone.jpg'
import { translate } from '../utils/translations'
import { getAvailableDronesWithSpecifications, getDroneWithSpecifications, getAvailableDates, getAvailableSlotsByDate, createBooking, updateBooking } from '../services/api'

function BookingPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState('Acre')
  const [selectedDate, setSelectedDate] = useState('')
  const [confirmedLocation, setConfirmedLocation] = useState(null)
  const [locationAddress, setLocationAddress] = useState('')
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [isMarathi, setIsMarathi] = useState(false)
  
  // Drone data states
  const [drones, setDrones] = useState([])
  const [selectedDrone, setSelectedDrone] = useState(null)
  const [selectedSpecification, setSelectedSpecification] = useState(null)
  const [loadingDrones, setLoadingDrones] = useState(true)
  const [error, setError] = useState('')
  
  // Availability states
  const [availableDates, setAvailableDates] = useState([])
  const [loadingDates, setLoadingDates] = useState(false)
  const [dateError, setDateError] = useState('')
  
  // Existing booking state (for updates)
  const [existingBookingId, setExistingBookingId] = useState(null)
  const [existingBooking, setExistingBooking] = useState(null)
  const [isChangeSlotMode, setIsChangeSlotMode] = useState(false) // Flag for change slot mode
  
  const navigate = useNavigate()
  const location = useLocation()

  // Get minimum date (today) - keep for reference but not used with DatePicker
  const today = new Date().toISOString().split('T')[0]

  // Price calculation based on selected drone and unit
  const pricePerUnit = selectedDrone 
    ? (selectedUnit === 'Acre' && selectedDrone.pricePerAcre 
        ? parseFloat(selectedDrone.pricePerAcre) 
        : selectedUnit === 'Hour' && selectedDrone.pricePerHour
        ? parseFloat(selectedDrone.pricePerHour)
        : 400)
    : 400
  
  const totalPrice = quantity * pricePerUnit


  // Check for existing booking from navigation state (Change Slot mode)
  useEffect(() => {
    const stateData = location.state
    if (stateData?.bookingId || stateData?.isChangeSlotMode) {
      setExistingBookingId(stateData.bookingId)
      setExistingBooking(stateData.existingBooking)
      setIsChangeSlotMode(true) // Enable change slot mode
      
      // Pre-fill form with existing booking data
      if (stateData.existingBooking) {
        // Convert serviceDate to YYYY-MM-DD format if it's a string
        const serviceDate = stateData.existingBooking.serviceDate || stateData.existingBooking.service_date
        if (serviceDate) {
          setSelectedDate(typeof serviceDate === 'string' ? serviceDate.split('T')[0] : serviceDate)
        }
      }
      
      // Set quantity and unit from state
      if (stateData.quantity) {
        setQuantity(stateData.quantity)
      }
      if (stateData.unit) {
        setSelectedUnit(stateData.unit)
      }
      
      // Set drone and specification from state (preserve original selection)
      if (stateData.drone) {
        setSelectedDrone(stateData.drone)
        // Set specification if provided
        if (stateData.specification) {
          setSelectedSpecification(stateData.specification)
        } else if (stateData.drone.specifications && stateData.drone.specifications.length > 0) {
          // Try to find the specification from the drone
          const firstSpec = stateData.drone.specifications.find(spec => spec.isAvailable) || stateData.drone.specifications[0]
          setSelectedSpecification(firstSpec)
        }
      }
      
      // Set location from state
      if (stateData.location) {
        setConfirmedLocation(stateData.location)
      }
    }
  }, [location.state])

  // Fetch drones with specifications
  useEffect(() => {
    const fetchDrones = async () => {
      setLoadingDrones(true)
      setError('')
      try {
        const response = await getAvailableDronesWithSpecifications()
        if (response.success && response.data && response.data.length > 0) {
          setDrones(response.data)
          // Auto-select first drone if not already selected
          if (!selectedDrone) {
            const firstDrone = response.data[0]
            setSelectedDrone(firstDrone)
            // Auto-select first available specification
            if (firstDrone.specifications && firstDrone.specifications.length > 0) {
              const availableSpec = firstDrone.specifications.find(spec => spec.isAvailable) || firstDrone.specifications[0]
              setSelectedSpecification(availableSpec)
            }
          }
          // Available dates will be fetched automatically via useEffect when selectedDrone is set
        } else {
          setError('No drones available')
        }
      } catch (err) {
        console.error('Error fetching drones:', err)
        setError('Failed to load drones. Please try again.')
      } finally {
        setLoadingDrones(false)
      }
    }

    fetchDrones()
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

  // Fetch available dates when drone is selected
  useEffect(() => {
    const fetchAvailableDates = async () => {
      if (!selectedDrone || !selectedDrone.droneId) return
      
      setLoadingDates(true)
      setDateError('')
      setSelectedDate('') // Reset selected date when drone changes
      
      try {
        const response = await getAvailableDates(selectedDrone.droneId)
        if (response.success && response.data) {
          // Convert date strings to YYYY-MM-DD format
          const dates = response.data.map(date => {
            if (typeof date === 'string') {
              return date.split('T')[0] // Handle ISO date strings
            }
            return date
          })
          setAvailableDates(dates)
        } else {
          setDateError('No available dates found for this drone')
          setAvailableDates([])
        }
      } catch (err) {
        console.error('Error fetching available dates:', err)
        setDateError('Failed to load available dates')
        setAvailableDates([])
      } finally {
        setLoadingDates(false)
      }
    }

    fetchAvailableDates()
  }, [selectedDrone])

  // Handle drone selection
  const handleDroneSelect = async (droneId) => {
    try {
      const response = await getDroneWithSpecifications(droneId)
      if (response.success && response.data) {
        setSelectedDrone(response.data)
        // Auto-select first available specification
        if (response.data.specifications && response.data.specifications.length > 0) {
          const availableSpec = response.data.specifications.find(spec => spec.isAvailable) || response.data.specifications[0]
          setSelectedSpecification(availableSpec)
        }
      }
    } catch (err) {
      console.error('Error fetching drone details:', err)
    }
  }

  // Handle specification selection
  const handleSpecificationSelect = (specification) => {
    setSelectedSpecification(specification)
  }

  // Handle date selection with validation
  const handleDateChange = (date) => {
    setDateError('')
    
    if (!date) {
      setSelectedDate('')
      return
    }
    
    // Convert date to YYYY-MM-DD format
    const selectedDateValue = date.toISOString().split('T')[0]
    
    // Check if selected date is in available dates
    if (availableDates.length > 0 && !availableDates.includes(selectedDateValue)) {
      setDateError('This date is not available. Please select from available dates.')
      setSelectedDate('')
      return
    }
    
    setSelectedDate(selectedDateValue)
  }

  // Check if a date is available
  const isDateAvailable = (date) => {
    if (availableDates.length === 0) return false
    const dateString = date.toISOString().split('T')[0]
    return availableDates.includes(dateString)
  }

  // Filter dates - only allow available dates to be selected
  const filterDate = (date) => {
    if (availableDates.length === 0) return false
    const dateString = date.toISOString().split('T')[0]
    return availableDates.includes(dateString)
  }

  // Get max date from available dates
  const getMaxDate = () => {
    if (availableDates.length === 0) return null
    const maxDateStr = availableDates[availableDates.length - 1]
    return new Date(maxDateStr)
  }

  // Get min date (today)
  const getMinDate = () => {
    return new Date()
  }

  // Convert selectedDate string to Date object for DatePicker
  const selectedDateObj = selectedDate ? new Date(selectedDate) : null

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
    if (!selectedDrone) {
      alert('Please select a drone')
      return
    }
    if (!isChangeSlotMode && !selectedSpecification) {
      alert('Please select a specification option')
      return
    }

    try {
      // Get available slots for the selected date
      const slotsResponse = await getAvailableSlotsByDate(selectedDrone.droneId, selectedDate)
      
      if (!slotsResponse.success || !slotsResponse.data || slotsResponse.data.length === 0) {
        alert('No available time slots found for the selected date. Please choose another date.')
        return
      }

      // Use the first available slot
      const firstSlot = slotsResponse.data[0]
      const startTime = firstSlot.startTime // Format: "HH:mm:ss"
      const endTime = firstSlot.endTime // Format: "HH:mm:ss"

      // Get customer ID from localStorage (set during login/OTP verification)
      // For now, using a default customer ID. In production, get from authenticated user
      const customerId = localStorage.getItem('customerId') || 1 // Default to 1 for demo
      
      // Calculate farm area based on quantity and unit
      let farmAreaAcres = null
      if (selectedUnit === 'Acre') {
        farmAreaAcres = quantity
      } else if (selectedUnit === 'Hour') {
        // Estimate: 1 hour covers approximately 2 acres (adjust as needed)
        farmAreaAcres = quantity * 2
      } else if (selectedUnit === 'Day') {
        // Estimate: 1 day covers approximately 10 acres (adjust as needed)
        farmAreaAcres = quantity * 10
      }

      // Prepare booking data
      const bookingData = {
        customerId: parseInt(customerId),
        droneId: selectedDrone.droneId,
        specificationId: selectedSpecification?.specId || null, // Include specification ID
        serviceDate: selectedDate,
        startTime: startTime,
        endTime: endTime,
        locationLat: confirmedLocation[0].toString(),
        locationLong: confirmedLocation[1].toString(),
        farmAreaAcres: farmAreaAcres ? farmAreaAcres.toString() : null,
        serviceType: 'SPRAYING', // Default to SPRAYING
        totalCost: totalPrice.toString(),
        quantity: quantity,
        unit: selectedUnit
      }

      // Update existing booking or create new one
      let bookingResponse
      if (existingBookingId) {
        // Update existing booking
        const updateData = {
          serviceDate: selectedDate,
          startTime: startTime,
          endTime: endTime,
          farmAreaAcres: farmAreaAcres ? farmAreaAcres.toString() : null,
          totalCost: totalPrice.toString(),
          quantity: quantity,
          unit: selectedUnit
        }
        bookingResponse = await updateBooking(existingBookingId, updateData)
      } else {
        // Create new booking
        bookingResponse = await createBooking(bookingData)
      }
      
      if (bookingResponse.success) {
        // Ensure drone name is included in booking response
        const bookingWithDroneName = {
          ...bookingResponse.data,
          droneName: selectedDrone?.droneModel || bookingResponse.data?.drone?.droneModel || 'Unknown Drone'
        }
        
        // Navigate to checkout with booking data
        navigate('/checkout', {
          state: {
            location: confirmedLocation,
            quantity,
            unit: selectedUnit,
            date: selectedDate,
            totalPrice,
            pricePerUnit,
            drone: selectedDrone,
            droneName: selectedDrone?.droneModel || 'Unknown Drone', // Include drone name explicitly
            specification: selectedSpecification,
            booking: bookingWithDroneName,
            timeSlot: {
              startTime,
              endTime
            }
          }
        })
      } else {
        alert(existingBookingId 
          ? 'Failed to update booking: ' + bookingResponse.message
          : 'Failed to create booking: ' + bookingResponse.message)
      }
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Failed to create booking. Please try again.')
    }
  }

  // Generate service cards from selected specification
  const getServiceCards = () => {
    if (!selectedSpecification) {
      return [
        { icon: '🛢️', value: '10L Tank', desc: 'Sufficient for 1 Acre' },
        { icon: '⏱️', value: '5Min/ Acre', desc: 'Time' },
        { icon: '🌡️', value: 'Cool Season', desc: 'Temp Control' }
      ]
    }

    return [
      {
        icon: '🛢️',
        value: `${selectedSpecification.tankSizeLiters}L Tank`,
        desc: `Tank Capacity`
      },
      {
        icon: '⏱️',
        value: `${selectedSpecification.timePerAcreMinutes} Min/Acre`,
        desc: 'Time per Acre'
      },
      {
        icon: '💧',
        value: `${selectedSpecification.sprayWidthMeters}m Width`,
        desc: 'Spray Width'
      }
    ]
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

      {/* Drone Selection Dropdown - Disabled in Change Slot Mode */}
      {drones.length > 1 && !isChangeSlotMode && (
        <div className="drone-selector" style={{ padding: '10px', margin: '10px', background: '#f5f5f5', borderRadius: '8px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            {translate('Select Drone', isMarathi)}:
          </label>
          <select 
            value={selectedDrone?.droneId || ''} 
            onChange={(e) => handleDroneSelect(parseInt(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            {drones.map(drone => (
              <option key={drone.droneId} value={drone.droneId}>
                {drone.droneModel} - ₹{selectedUnit === 'Acre' && drone.pricePerAcre ? parseFloat(drone.pricePerAcre) : drone.pricePerHour ? parseFloat(drone.pricePerHour) : 'N/A'}/{selectedUnit}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Show selected drone info in Change Slot Mode */}
      {isChangeSlotMode && selectedDrone && (
        <div className="drone-info-display" style={{ padding: '10px', margin: '10px', background: '#e8f5e9', borderRadius: '8px', border: '2px solid #4caf50' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#2e7d32' }}>
            {translate('Selected Drone', isMarathi)}: {selectedDrone.droneModel}
          </div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {translate('Drone cannot be changed in Change Slot mode', isMarathi)}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loadingDrones && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div>Loading drones...</div>
        </div>
      )}

      {/* Error State */}
      {error && !loadingDrones && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
          {error}
        </div>
      )}

      {/* Drone Information Card - Black Section */}
      {selectedDrone && (
        <div className="drone-info-header-black">
          <div className="info-header">
            <div className="drone-name-section">
              <h2 className="drone-name">{selectedDrone.droneModel || translate('Drone Name', isMarathi)}</h2>
              {selectedDrone.vendor?.ratingAvg && (
                <div className="rating">
                  <span className="rating-value">{parseFloat(selectedDrone.vendor.ratingAvg).toFixed(1)}</span>
                  <span className="star-icon">⭐</span>
                </div>
              )}
            </div>
            <div className="price-section">
              <div className="price">₹{pricePerUnit}/-</div>
              <div className="price-unit">
                <span className="unit-label">{translate('Guntha /', isMarathi)}</span>
                <button className="unit-button active">{translate(selectedUnit, isMarathi)}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* White Section - Slideshow and Rest of Content */}
      <div className="booking-content-white">
        <div className="booking-dark-section">
          {/* Specification Selection - Disabled in Change Slot Mode */}
          {selectedDrone && selectedDrone.specifications && selectedDrone.specifications.length > 0 && !isChangeSlotMode && (
            <div className="specification-selector" style={{ marginBottom: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                {translate('Select Specification Option', isMarathi)}:
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {selectedDrone.specifications.filter(spec => spec.isAvailable).map(spec => (
                  <button
                    key={spec.specId}
                    onClick={() => handleSpecificationSelect(spec)}
                    style={{
                      padding: '10px 15px',
                      borderRadius: '8px',
                      border: selectedSpecification?.specId === spec.specId ? '2px solid #4CAF50' : '1px solid #ddd',
                      background: selectedSpecification?.specId === spec.specId ? '#e8f5e9' : 'white',
                      cursor: 'pointer',
                      flex: '1',
                      minWidth: '150px'
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>Option Set {spec.optionSet}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {spec.tankSizeLiters}L • {spec.sprinklerType}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Show selected specification in Change Slot Mode */}
          {isChangeSlotMode && selectedSpecification && (
            <div className="specification-info-display" style={{ marginBottom: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '8px', border: '2px solid #4caf50' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#2e7d32' }}>
                {translate('Selected Specification', isMarathi)}: Option Set {selectedSpecification.optionSet}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                {selectedSpecification.tankSizeLiters}L Tank • {selectedSpecification.sprinklerType}
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {translate('Specification cannot be changed in Change Slot mode', isMarathi)}
              </div>
            </div>
          )}

          {/* Service Details Cards */}
          <div className="service-cards-container">
            {getServiceCards().map((card, index) => {
              const iconText = card.icon === '🛢️' ? 'Tank ICON' : card.icon === '⏱️' ? 'Clock ICON' : 'Temp ICON'
              return (
                <div key={index} className="service-card">
                  <div className="service-icon-text">{card.icon} </div>
                  <div className="service-value">{translate(card.value, isMarathi)}</div>
                  <div className="service-desc">{translate(card.desc, isMarathi)}</div>
                </div>
              )
            })}
          </div>

          {/* Pilot Information */}
          {selectedDrone && selectedDrone.vendor && (
            <div className="pilot-card">
              <div className="pilot-avatar">
                <div className="avatar-placeholder">👨</div>
              </div>
              <div className="pilot-info">
                <div className="pilot-name">
                  {selectedDrone.vendor.user?.fullName || translate('Pilot Name', isMarathi)}
                </div>
                <div className="pilot-details">
                  {selectedDrone.vendor.serviceArea 
                    ? `${translate('Service Area', isMarathi)}: ${selectedDrone.vendor.serviceArea}`
                    : translate('Location and other details regarding the pilot', isMarathi)}
                  {selectedDrone.vendor.experienceYears && (
                    <span> • {selectedDrone.vendor.experienceYears} {translate('Years Experience', isMarathi)}</span>
                  )}
                </div>
              </div>
            </div>
          )}

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
                {isChangeSlotMode && (
                  <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px', fontStyle: 'italic' }}>
                    ({translate('Cannot be changed', isMarathi)})
                  </span>
                )}
              </label>
              <div className="quantity-controls">
                <button 
                  className="quantity-btn minus"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isChangeSlotMode}
                  style={{ opacity: isChangeSlotMode ? 0.5 : 1, cursor: isChangeSlotMode ? 'not-allowed' : 'pointer' }}
                >
                  −
                </button>
                <div className="quantity-display" style={{ opacity: isChangeSlotMode ? 0.7 : 1 }}>
                  <span className="quantity-value">{quantity}</span>
                  <span className="quantity-unit">{selectedUnit}</span>
                </div>
                <button 
                  className="quantity-btn plus"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isChangeSlotMode}
                  style={{ opacity: isChangeSlotMode ? 0.5 : 1, cursor: isChangeSlotMode ? 'not-allowed' : 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>

            <div className="unit-selector">
              <label className="unit-label-text">
                {translate('Select Unit Type', isMarathi)}
                {isChangeSlotMode && (
                  <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px', fontStyle: 'italic' }}>
                    ({translate('Cannot be changed', isMarathi)})
                  </span>
                )}
              </label>
              <div className="unit-buttons">
                <button 
                  className={`unit-select-btn ${selectedUnit === 'Acre' ? 'active' : ''}`}
                  onClick={() => !isChangeSlotMode && setSelectedUnit('Acre')}
                  disabled={isChangeSlotMode}
                  style={{ opacity: isChangeSlotMode ? 0.6 : 1, cursor: isChangeSlotMode ? 'not-allowed' : 'pointer' }}
                >
                  <span className="unit-icon">🌾</span>
                  <span>{translate('Acre', isMarathi)}</span>
                </button>
                <button 
                  className={`unit-select-btn ${selectedUnit === 'Hour' ? 'active' : ''}`}
                  onClick={() => !isChangeSlotMode && setSelectedUnit('Hour')}
                  disabled={isChangeSlotMode}
                  style={{ opacity: isChangeSlotMode ? 0.6 : 1, cursor: isChangeSlotMode ? 'not-allowed' : 'pointer' }}
                >
                  <span className="unit-icon">⏰</span>
                  <span>{translate('Hour', isMarathi)}</span>
                </button>
                <button 
                  className={`unit-select-btn ${selectedUnit === 'Day' ? 'active' : ''}`}
                  onClick={() => !isChangeSlotMode && setSelectedUnit('Day')}
                  disabled={isChangeSlotMode}
                  style={{ opacity: isChangeSlotMode ? 0.6 : 1, cursor: isChangeSlotMode ? 'not-allowed' : 'pointer' }}
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
              {isChangeSlotMode 
                ? translate('Change Booking Date', isMarathi)
                : translate('Select Booking Date', isMarathi)
              }
              {isChangeSlotMode && (
                <span style={{ fontSize: '12px', color: '#4caf50', marginLeft: '10px', fontWeight: 'normal' }}>
                  ({translate('Only date can be changed', isMarathi)})
                </span>
              )}
            </label>
            {loadingDates && (
              <div style={{ padding: '10px', color: '#666', fontSize: '14px' }}>
                {translate('Loading available dates...', isMarathi)}
              </div>
            )}
            {!loadingDates && availableDates.length === 0 && selectedDrone && (
              <div style={{ padding: '10px', color: '#d32f2f', fontSize: '14px' }}>
                {translate('No available dates found for this drone', isMarathi)}
              </div>
            )}
            {!loadingDates && availableDates.length > 0 && (
              <>
                <div className="date-picker">
                  <DatePicker
                    selected={selectedDateObj}
                    onChange={handleDateChange}
                    filterDate={filterDate}
                    minDate={getMinDate()}
                    maxDate={getMaxDate()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText={translate('Select a date', isMarathi)}
                    className={`date-input-custom ${dateError ? 'error' : ''}`}
                    dayClassName={(date) => {
                      const dateString = date.toISOString().split('T')[0]
                      if (availableDates.includes(dateString)) {
                        return 'available-date'
                      }
                      return 'unavailable-date'
                    }}
                    calendarClassName="custom-calendar"
                    popperClassName="custom-datepicker-popper"
                    showPopperArrow={false}
                    disabledKeyboardNavigation
                  />
                  {selectedDate && !dateError && (
                    <div className="date-selected">
                      <span className="date-icon">✓</span>
                      {translate('Selected:', isMarathi)} {new Date(selectedDate).toLocaleDateString(isMarathi ? 'mr-IN' : 'en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </div>
                {dateError && (
                  <div style={{ padding: '10px', color: '#d32f2f', fontSize: '14px', marginTop: '5px' }}>
                    {dateError}
                  </div>
                )}
                {availableDates.length > 0 && (
                  <div style={{ padding: '10px', fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    {translate('Available dates:', isMarathi)} {availableDates.slice(0, 5).join(', ')}
                    {availableDates.length > 5 && ` +${availableDates.length - 5} more`}
                  </div>
                )}
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


