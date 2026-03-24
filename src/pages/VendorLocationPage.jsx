import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'
import { FiArrowLeft, FiMapPin, FiNavigation, FiEdit3 } from 'react-icons/fi'
import { saveOnboardingStep4, getOnboardingData } from '../services/api'
import ProgressBar from '../components/ProgressBar'

function VendorLocationPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    baseLocation: '',
    coordinates: '',
    serviceAreas: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)

  // Load saved data when component mounts
  useEffect(() => {
    const loadSavedData = async () => {
      const vendorId = localStorage.getItem('vendorId')
      if (!vendorId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await getOnboardingData(parseInt(vendorId))
        if (response.success && response.data && response.data.drone) {
          const drone = response.data.drone
          setFormData(prev => ({
            ...prev,
            baseLocation: drone.baseLocation || '',
            coordinates: drone.coordinates || '',
            serviceAreas: drone.serviceAreas || ''
          }))
          
          // If coordinates exist, fetch address
          if (drone.coordinates) {
            fetchAddressFromCoordinates(drone.coordinates)
            setLocationAddress(drone.baseLocation || '')
          }
        }
      } catch (error) {
        console.error('Error loading saved data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedData()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }


  // Get current location using geolocation API
  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true)
    setErrorMessage('')
    
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.')
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const coordinates = `${latitude},${longitude}`
        
        setFormData(prev => ({
          ...prev,
          coordinates: coordinates
        }))
        
        // Fetch address from coordinates
        await fetchAddressFromCoordinates(coordinates)
        setIsGettingLocation(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        setErrorMessage('Unable to get your location. Please allow location access or enter manually.')
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // Set base location (same as current location but with different label)
  const handleSetBaseLocation = () => {
    handleGetCurrentLocation()
  }

  // Fetch address from coordinates using reverse geocoding
  const fetchAddressFromCoordinates = async (coordinates) => {
    try {
      const [lat, lng] = coordinates.split(',')
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat.trim()}&lon=${lng.trim()}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Tatya App'
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.address) {
          const addressParts = []
          if (data.address.house_number) addressParts.push(data.address.house_number)
          if (data.address.road) addressParts.push(data.address.road)
          if (data.address.village || data.address.town || data.address.city) {
            addressParts.push(data.address.village || data.address.town || data.address.city)
          }
          if (data.address.state) addressParts.push(data.address.state)
          if (data.address.postcode) addressParts.push(data.address.postcode)
          
          const fullAddress = addressParts.length > 0 
            ? addressParts.join(', ')
            : data.display_name || `${lat}, ${lng}`
          
          setLocationAddress(fullAddress)
          setFormData(prev => ({
            ...prev,
            baseLocation: fullAddress
          }))
        } else {
          setLocationAddress(`${lat}, ${lng}`)
          setFormData(prev => ({
            ...prev,
            baseLocation: `${lat}, ${lng}`
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error)
      const [lat, lng] = coordinates.split(',')
      setLocationAddress(`${lat}, ${lng}`)
    }
  }

  // Handle manual coordinate input
  const handleManualCoordinatesChange = (value) => {
    // Validate format: lat,lng or lat, lng
    const coordPattern = /^-?\d+\.?\d*,-?\d+\.?\d*$/
    const cleanedValue = value.replace(/\s/g, '')
    
    if (value === '' || coordPattern.test(cleanedValue)) {
      setFormData(prev => ({
        ...prev,
        coordinates: cleanedValue
      }))
      
      // Clear address if coordinates are cleared
      if (value === '') {
        setLocationAddress('')
        setFormData(prev => ({
          ...prev,
          baseLocation: ''
        }))
      } else if (coordPattern.test(cleanedValue)) {
        // If valid coordinates, try to fetch address
        fetchAddressFromCoordinates(cleanedValue)
      }
    }
  }

  const handleBack = () => {
    navigate('/vendor-capacity')
  }

  const handleSubmit = async () => {
    const vendorId = localStorage.getItem('vendorId')
    if (!vendorId) {
      setErrorMessage('Please complete registration first')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      const step4Data = {
        vendorId: parseInt(vendorId),
        baseLocation: formData.baseLocation,
        coordinates: formData.coordinates,
        serviceAreas: formData.serviceAreas
      }

      await saveOnboardingStep4(step4Data)
      navigate('/vendor-availability')
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save. Please try again.')
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="vendor-form-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px' }}>Loading saved data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="vendor-form-page">
      {/* Progress Bar */}
      <ProgressBar 
        currentStep={4} 
        totalSteps={6}
        steps={['Equipment', 'Drone Details', 'Capacity', 'Location', 'Availability', 'Payouts']}
      />

      {/* Header with Back Button */}
      <div className="form-header">
        <button className="back-button" onClick={handleBack} aria-label="Go back">
          <FiArrowLeft />
        </button>
      </div>

      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Location & Logistics</h1>

        <div className="form-fields">
          {/* Location Selection Section */}
          <div className="form-group">
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#333', 
              marginBottom: '12px' 
            }}>
              Base Location
            </label>
            
            {/* Location Action Buttons */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px', 
              marginBottom: '12px' 
            }}>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={isGettingLocation}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 16px',
                  background: isGettingLocation ? '#f0f0f0' : '#fff',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isGettingLocation ? '#999' : '#333',
                  cursor: isGettingLocation ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  if (!isGettingLocation) {
                    e.target.style.borderColor = '#4CAF50'
                    e.target.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.2)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isGettingLocation) {
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <FiNavigation style={{ fontSize: '18px' }} />
                {isGettingLocation ? 'Getting Location...' : 'Share Current Location'}
              </button>
              
              <button
                type="button"
                onClick={handleSetBaseLocation}
                disabled={isGettingLocation}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 16px',
                  background: '#fff',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#2196F3'
                  e.target.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e0e0e0'
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                <FiMapPin style={{ fontSize: '18px' }} />
                Set Base Location
              </button>
            </div>

            {/* Manual Entry Toggle */}
            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '12px 16px',
                background: '#f8f9fa',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#666',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: showManualInput ? '12px' : '0'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f0f0f0'
                e.target.style.borderColor = '#d0d0d0'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#f8f9fa'
                e.target.style.borderColor = '#e0e0e0'
              }}
            >
              <FiEdit3 style={{ fontSize: '16px' }} />
              {showManualInput ? 'Hide Manual Entry' : 'Enter Location Manually'}
            </button>

            {/* Manual Input Field */}
            {showManualInput && (
              <div style={{ marginTop: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter coordinates (lat,lng) e.g., 19.0760,72.8777"
                  value={formData.coordinates}
                  onChange={(e) => handleManualCoordinatesChange(e.target.value)}
                  className="form-input"
                  style={{ marginBottom: '8px' }}
                />
                <p style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  margin: '4px 0 0 0' 
                }}>
                  Format: latitude,longitude (e.g., 19.0760,72.8777)
                </p>
              </div>
            )}

            {/* Display Selected Location */}
            {locationAddress && (
              <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: '#e8f5e9',
                border: '1px solid #4CAF50',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#2e7d32'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <FiMapPin style={{ fontSize: '16px', marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>Selected Location:</div>
                    <div>{locationAddress}</div>
                    {formData.coordinates && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        Coordinates: {formData.coordinates}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="section-title">
            <h3>Service Areas</h3>
          </div>

          <div className="form-group">
            <select
              value={formData.serviceAreas}
              onChange={(e) => handleInputChange('serviceAreas', e.target.value)}
              className="form-input"
              style={{ 
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23333\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 20px center',
                paddingRight: '40px',
                cursor: 'pointer'
              }}
            >
              <option value="">Select Service Radius</option>
              <option value="<15km">&lt; 15 km radius</option>
              <option value="15-25km">15-25 km radius</option>
              <option value="25-50km">25-50 km radius</option>
              <option value=">50km">&gt; 50 km radius</option>
            </select>
          </div>

        </div>

        {errorMessage && (
          <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>
            {errorMessage}
          </div>
        )}

        {/* Submit Button */}
        <button 
          className="submit-button"
          onClick={handleSubmit}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

export default VendorLocationPage