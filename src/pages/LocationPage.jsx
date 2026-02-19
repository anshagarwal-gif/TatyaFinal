import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import EXIF from 'exif-js'
import 'leaflet/dist/leaflet.css'
import '../styles/LocationPage.css'
import { translate } from '../utils/translations'
import { useLanguage } from '../contexts/LanguageContext'
import LanguageToggle from '../components/LanguageToggle'
import PrimaryButton from '../components/PrimaryButton'
import { 
  FiSearch, 
  FiMapPin, 
  FiCamera, 
  FiX, 
  FiRefreshCw, 
  FiCheck, 
  FiChevronLeft,
  FiLoader,
  FiAlertCircle,
  FiImage,
  FiNavigation,
  FiStar,
  FiClock,
  FiPackage,
  FiUser
} from 'react-icons/fi'
import { getAvailableDronesWithSpecifications } from '../services/api'

// Fix for default marker icon in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Component to handle map center updates
function MapCenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  return null
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e)
    },
  })
  return null
}

function LocationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isMarathi } = useLanguage()
  const [userLocation, setUserLocation] = useState(null)
  const [mapCenter, setMapCenter] = useState([19.0760, 72.8777]) // Default: Mumbai
  const [mapZoom, setMapZoom] = useState(13)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeoutRef = useRef(null)
  const searchContainerRef = useRef(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)
  
  // Drone selection states
  const [availableDrones, setAvailableDrones] = useState([])
  const [selectedDrone, setSelectedDrone] = useState(null)
  const [loadingDrones, setLoadingDrones] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  // Check for drone from navigation state (from ServiceSelectionPage)
  useEffect(() => {
    if (location.state?.drone) {
      setSelectedDrone(location.state.drone)
    } else if (location.state?.droneId) {
      // If only droneId is passed, we'll fetch it in the next effect
      const droneId = location.state.droneId
      // Store for later use
      localStorage.setItem('selectedDroneId', droneId.toString())
    }
  }, [location.state])

  // Fetch available drones
  useEffect(() => {
    const fetchDrones = async () => {
      setLoadingDrones(true)
      try {
        const response = await getAvailableDronesWithSpecifications()
        if (response.success && response.data) {
          setAvailableDrones(response.data)
          
          // If drone was passed from navigation state, use it
          if (location.state?.drone) {
            setSelectedDrone(location.state.drone)
          } else if (location.state?.droneId) {
            // Find the drone by ID
            const drone = response.data.find(d => d.droneId === location.state.droneId)
            if (drone) {
              setSelectedDrone(drone)
            } else if (response.data.length > 0 && !selectedDrone) {
              // Fallback to first drone if not found
              setSelectedDrone(response.data[0])
            }
          } else if (response.data.length > 0 && !selectedDrone) {
            // Auto-select first drone if available and no drone was passed
            setSelectedDrone(response.data[0])
          }
        }
      } catch (err) {
        console.error('Error fetching drones:', err)
      } finally {
        setLoadingDrones(false)
      }
    }
    fetchDrones()
  }, [location.state])

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const location = [latitude, longitude]
          setUserLocation(location)
          setMapCenter(location)
          setSelectedLocation(location)
          setLoading(false)
        },
        (err) => {
          console.error('Error getting location:', err)
          setError(translate('Unable to get your location. Please allow location access or select manually.', isMarathi))
          setLoading(false)
          // Keep default location (Mumbai)
          setSelectedLocation(mapCenter)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setError(translate('Geolocation is not supported by your browser.', isMarathi))
      setLoading(false)
      setSelectedLocation(mapCenter)
    }
  }, [])

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  // Search location using Nominatim API
  const searchLocation = async (query) => {
    if (!query || query.trim().length < 3) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Tatya Agricultural App' // Required by Nominatim
          }
        }
      )
      const data = await response.json()
      setSearchResults(data)
      setShowResults(true)
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search location. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(value)
    }, 500) // Wait 500ms after user stops typing
  }

  // Handle selecting a search result
  const handleSelectResult = (result) => {
    const location = [parseFloat(result.lat), parseFloat(result.lon)]
    setSelectedLocation(location)
    setMapCenter(location)
    setMapZoom(15)
    setSearchQuery(result.display_name)
    setShowResults(false)
    setSearchResults([])
  }

  // Handle map click to set location
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng
    const location = [lat, lng]
    setSelectedLocation(location)
    setMapCenter(location)
  }

  // Get current location button handler
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const location = [latitude, longitude]
          setUserLocation(location)
          setMapCenter(location)
          setSelectedLocation(location)
          setLoading(false)
        },
        (err) => {
          setError('Unable to get your location.')
          setLoading(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      )
    }
  }

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      if (!selectedDrone) {
        setError(translate('Please select a drone and pilot first', isMarathi))
        return
      }
      
      if (!isConfirmed) {
        setError(translate('Please confirm the location is correct first', isMarathi))
        return
      }
      
      // Store location in localStorage for persistence
      const locationData = {
        coordinates: selectedLocation,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('confirmedLocation', JSON.stringify(locationData))
      
      // Navigate with location and drone data
      navigate('/booking', { 
        state: { 
          location: selectedLocation,
          coordinates: selectedLocation,
          droneId: selectedDrone.droneId,
          drone: selectedDrone
        } 
      })
    } else {
      setError(translate('Please select a location first', isMarathi))
    }
  }

  // Handle tick button click - just toggle confirmation
  const handleTickConfirmation = () => {
    if (selectedLocation && selectedDrone) {
      setIsConfirmed(!isConfirmed)
    }
  }

  // Handle Photo Based Location
  const handlePhotoBasedLocation = () => {
    // Check if device supports camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setShowCamera(true)
      startCamera()
    } else {
      // Fallback to file input if camera API not available
      fileInputRef.current?.click()
    }
  }

  // Start camera stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions or use file upload.')
      setShowCamera(false)
      // Fallback to file input
      fileInputRef.current?.click()
    }
  }

  // Stop camera stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setShowCamera(false)
    setCapturedImage(null)
  }

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0)
      
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob)
        setCapturedImage(imageUrl)
        extractLocationFromImage(blob)
      }, 'image/jpeg')
    }
  }

  // Handle file input (fallback or direct file selection)
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setCapturedImage(event.target.result)
        extractLocationFromImage(file)
      }
      reader.readAsDataURL(file)
    }
  }

  // Extract GPS location from image EXIF data
  const extractLocationFromImage = (imageFile) => {
    EXIF.getData(imageFile, function() {
      const lat = EXIF.getTag(this, 'GPSLatitude')
      const latRef = EXIF.getTag(this, 'GPSLatitudeRef')
      const lon = EXIF.getTag(this, 'GPSLongitude')
      const lonRef = EXIF.getTag(this, 'GPSLongitudeRef')

      if (lat && lon) {
        // Convert GPS coordinates from degrees/minutes/seconds to decimal
        const latitude = convertDMSToDD(lat, latRef)
        const longitude = convertDMSToDD(lon, lonRef)
        
        const location = [latitude, longitude]
        setSelectedLocation(location)
        setMapCenter(location)
        setMapZoom(16)
        setSearchQuery(`Location from photo: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
        
        // Close camera after successful extraction
        setTimeout(() => {
          stopCamera()
        }, 1000)
      } else {
        setError(translate('No location found in image', isMarathi))
        // Still close camera but show error
        setTimeout(() => {
          stopCamera()
        }, 2000)
      }
    })
  }

  // Convert DMS (Degrees Minutes Seconds) to Decimal Degrees
  const convertDMSToDD = (dms, ref) => {
    let dd = dms[0] + dms[1] / 60 + dms[2] / (60 * 60)
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1
    }
    return dd
  }

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  return (
    <div className="location-page">
      {/* Language Toggle Button */}
      <LanguageToggle />

      {/* Back Button */}
      <button 
        type="button"
        className="back-button-top"
        onClick={() => navigate(-1)}
        title="Go back"
        aria-label="Go back"
      >
        <FiChevronLeft />
      </button>

      {/* Search Bar */}
      <div className="search-container" ref={searchContainerRef}>
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder={translate('Search location', isMarathi)}
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchResults.length > 0 && setShowResults(true)}
            aria-label={translate('Search location', isMarathi)}
          />
          {isSearching && (
            <FiLoader className="search-loading" />
          )}
          <button 
            type="button"
            className="location-btn"
            onClick={handleGetCurrentLocation}
            title="Get current location"
            aria-label="Get current location"
          >
            <FiNavigation />
          </button>
        </div>
        
        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="search-result-item"
                onClick={() => handleSelectResult(result)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSelectResult(result)
                  }
                }}
              >
                <FiMapPin className="result-icon" />
                <div className="result-content">
                  <div className="result-name">{result.display_name}</div>
                  {result.address && (
                    <div className="result-address">
                      {result.address.city || result.address.town || result.address.village || ''}
                      {result.address.state && `, ${result.address.state}`}
                      {result.address.country && `, ${result.address.country}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {showResults && searchResults.length === 0 && searchQuery.length >= 3 && !isSearching && (
          <div className="search-results">
            <div className="search-result-item no-results">
              No results found for "{searchQuery}"
            </div>
          </div>
        )}
      </div>

      {/* Loading/Error Messages */}
      {loading && (
        <div className="location-status">
          <FiLoader className="status-icon" />
          <div className="status-message">{translate('Loading...', isMarathi)}</div>
        </div>
      )}
      {error && (
        <div className="location-status error">
          <FiAlertCircle className="status-icon" />
          <div className="status-message">{error}</div>
        </div>
      )}

      {/* Map Display */}
      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapCenter center={mapCenter} zoom={mapZoom} />
          <MapClickHandler onMapClick={handleMapClick} />
          {selectedLocation && (
            <Marker 
              position={selectedLocation}
              icon={L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>
                {translate('Select a location on the map', isMarathi)}<br />
                {translate('Lat:', isMarathi)} {selectedLocation[0].toFixed(6)}<br />
                {translate('Lng:', isMarathi)} {selectedLocation[1].toFixed(6)}
              </Popup>
            </Marker>
          )}
          {userLocation && userLocation !== selectedLocation && (
            <Marker 
              position={userLocation}
              icon={L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>
                {translate('Select a location on the map', isMarathi)}<br />
                {translate('Lat:', isMarathi)} {userLocation[0].toFixed(6)}<br />
                {translate('Lng:', isMarathi)} {userLocation[1].toFixed(6)}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Location Confirmation Question */}
      {selectedLocation && (
        <div className="location-confirmation-section">
          <h3 className="confirmation-question">
            {translate('Is the farm location correct?', isMarathi)}
          </h3>
          
          {/* Tick Confirmation Button - Normal button that turns green when ticked */}
          <button 
            type="button"
            className={`tick-confirmation-btn ${isConfirmed ? 'confirmed' : ''}`}
            onClick={handleTickConfirmation}
            disabled={!selectedLocation || !selectedDrone}
            aria-label={translate('Yes, that\'s correct!', isMarathi)}
          >
            <div className={`confirm-checkbox ${isConfirmed ? 'checked' : ''}`}>
              {isConfirmed && <FiCheck className="checkbox-tick" />}
            </div>
            <span>{translate('Yes, that\'s correct!', isMarathi)}</span>
          </button>

          {/* Location Input Options */}
          <div className="location-options">
            <button 
              className="location-option-btn" 
              onClick={handlePhotoBasedLocation}
              type="button"
            >
              <div className="option-content">
                <span className="option-text">{translate('Upload from Gallery', isMarathi)}</span>
                <div className="option-icon-wrapper">
                  <FiImage className="option-icon" />
                </div>
              </div>
            </button>

            {/* Hidden file input for photo selection */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
              aria-label="Select photo"
            />

            <button 
              className="location-option-btn"
              type="button"
              onClick={() => {
                // Handle paste from Google Maps
                navigator.clipboard.readText().then(text => {
                  // Try to extract coordinates from clipboard
                  const coordMatch = text.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/)
                  if (coordMatch) {
                    const location = [parseFloat(coordMatch[1]), parseFloat(coordMatch[2])]
                    setSelectedLocation(location)
                    setMapCenter(location)
                    setMapZoom(15)
                    setSearchQuery(`Pasted: ${coordMatch[1]}, ${coordMatch[2]}`)
                  } else {
                    setError(translate('No valid coordinates found in clipboard', isMarathi))
                  }
                }).catch(err => {
                  console.error('Failed to read clipboard:', err)
                  setError(translate('Unable to access clipboard', isMarathi))
                })
              }}
            >
              <div className="option-content">
                <span className="option-text">{translate('Paste from Google Maps', isMarathi)}</span>
                <div className="option-icon-wrapper">
                  <FiMapPin className="option-icon" />
                </div>
              </div>
            </button>

            <button 
              className="location-option-btn"
              type="button"
              onClick={handlePhotoBasedLocation}
            >
              <div className="option-content">
                <span className="option-text">{translate('Take Farm Photo', isMarathi)}</span>
                <div className="option-icon-wrapper">
                  <FiCamera className="option-icon" />
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Drone and Pilot Selection Cards */}
      {selectedLocation && (
        <div className="drone-selection-section" style={{ 
          padding: '16px', 
          backgroundColor: '#f9fafb',
          borderRadius: '16px',
          marginBottom: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: '#111827'
          }}>
            {translate('Select Drone & Pilot', isMarathi)}
          </h3>
          
          {loadingDrones ? (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <FiLoader style={{ animation: 'spin 1s linear infinite', fontSize: '24px' }} />
              <p style={{ marginTop: '8px', fontSize: '0.875rem' }}>Loading drones...</p>
            </div>
          ) : availableDrones.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {availableDrones.map((drone) => {
                const pricePerAcre = drone.pricePerAcre ? Number(drone.pricePerAcre) : 400
                const pilotName = drone.vendor?.user?.fullName || 'Pilot Name'
                const rating = drone.vendor?.ratingAvg ? Number(drone.vendor.ratingAvg).toFixed(1) : '4.3'
                const flightTime = drone.flightTimeMinutes ? `> ${drone.flightTimeMinutes} min` : '> 5 min'
                const capacity = drone.capacityLiters ? `${drone.capacityLiters}L` : '10L'
                const isSelected = selectedDrone?.droneId === drone.droneId

                return (
                  <div
                    key={drone.droneId}
                    onClick={() => setSelectedDrone(drone)}
                    style={{
                      backgroundColor: '#1f2937',
                      border: `2px solid ${isSelected ? '#4caf50' : '#374151'}`,
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      color: 'white',
                      boxShadow: isSelected ? '0 0 0 2px rgba(76, 175, 80, 0.2)' : 'none'
                    }}
                  >
                    {/* Top Section */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Near You</span>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        backgroundColor: '#059669',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem'
                      }}>
                        <span>{rating}</span>
                        <FiStar style={{ fontSize: '12px', fill: '#fbbf24', color: '#fbbf24' }} />
                      </div>
                    </div>

                    {/* Middle Section - Drone Details */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: '600', 
                          marginBottom: '8px',
                          color: 'white'
                        }}>
                          {drone.droneModel || 'Drone Name'}
                        </h4>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#d1d5db' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiClock style={{ fontSize: '14px' }} />
                            <span>{flightTime}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiPackage style={{ fontSize: '14px' }} />
                            <span>{capacity}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>
                          ₹{Math.round(pricePerAcre)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>/Acre</div>
                      </div>
                    </div>

                    {/* Bottom Section - Pilot and Book Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white'
                        }}>
                          <FiUser style={{ fontSize: '16px' }} />
                        </div>
                        <span style={{ fontSize: '0.875rem', color: 'white' }}>{pilotName}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedDrone(drone)
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: isSelected ? '#4caf50' : '#374151',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          transition: 'all 0.2s'
                        }}
                      >
                        {isSelected ? translate('Selected', isMarathi) : translate('Select', isMarathi)}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
              <p>{translate('No drones available at the moment', isMarathi)}</p>
            </div>
          )}
        </div>
      )}

      {/* Confirm Location Button - Fixed at bottom */}
      <div className="fixed-bottom-container">
        <PrimaryButton
          onClick={handleConfirmLocation}
          disabled={!selectedLocation || !selectedDrone || !isConfirmed}
          fullWidth
        >
          {translate('Confirm Location', isMarathi)}
        </PrimaryButton>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="camera-modal">
          <div className="camera-modal-content">
            <div className="camera-header">
              <h3>{translate('Capture Farm Location', isMarathi)}</h3>
              <button 
                type="button"
                className="close-camera-btn" 
                onClick={stopCamera}
                aria-label="Close camera"
              >
                <FiX />
              </button>
            </div>
            
            <div className="camera-preview">
              {capturedImage ? (
                <div className="captured-image-container">
                  <img src={capturedImage} alt="Captured" className="captured-image" />
                  <div className="capture-actions">
                    <button 
                      type="button"
                      className="retake-btn" 
                      onClick={async () => {
                        setCapturedImage(null)
                        // Restart camera
                        if (cameraStream) {
                          cameraStream.getTracks().forEach(track => track.stop())
                        }
                        await startCamera()
                      }}
                    >
                      <FiRefreshCw className="action-icon" />
                      <span>{translate('Retake', isMarathi)}</span>
                    </button>
                    <button 
                      type="button"
                      className="use-photo-btn" 
                      onClick={stopCamera}
                    >
                      <FiCheck className="action-icon" />
                      <span>{translate('Use Photo', isMarathi)}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="camera-video"
                  />
                  <div className="camera-controls">
                    <button 
                      type="button"
                      className="capture-btn" 
                      onClick={capturePhoto}
                      aria-label="Capture photo"
                    >
                      <FiCamera className="capture-icon" />
                    </button>
                  </div>
                </>
              )}
            </div>
            
            <div className="camera-instructions">
              <p>Make sure location services are enabled in your camera settings</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationPage

