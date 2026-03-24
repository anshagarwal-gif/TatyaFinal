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
import ChatbotIcon from '../components/ChatbotIcon';
import ChatbotWrapper from '../chatbot/ChatbotWrapper';
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  
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
            } 
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
    if (selectedLocation) {
      const newConfirmedStatus = !isConfirmed;
      setIsConfirmed(newConfirmedStatus);
      setError(null);

      // If user is ticking the box AND a drone was already selected earlier
      if (newConfirmedStatus && selectedDrone) {
        // Store location in localStorage
        const locationData = {
          coordinates: selectedLocation,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('confirmedLocation', JSON.stringify(locationData));

        // Redirect immediately
        navigate('/booking', { 
          state: { 
            location: selectedLocation,
            coordinates: selectedLocation,
            droneId: selectedDrone.droneId,
            drone: selectedDrone
          } 
        });
      }
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
      {/* Chatbot Button */}
     <ChatbotIcon onClick={() => {
          setIsChatOpen(true); 
      }} />

      {/*Render the wrapper when the state is true */}
      {isChatOpen && (
        <ChatbotWrapper 
          onClose={() => setIsChatOpen(false)} 
          onNavigateToUserData={() => navigate('/user-data')} 
        />
      )}

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
      {/* Location Confirmation Question and Side-by-Side Buttons */}
      {selectedLocation && (
        <div className="location-confirmation-section">
          <h3 className="confirmation-question">
            {translate('Is the farm location correct?', isMarathi)}
          </h3>
          
          <div className="confirmation-button-row">
            {/* Left Button: WhatsApp */}
            <button 
              type="button"
              className="whatsapp-btn"
              onClick={() => window.location.href = "whatsapp://send?text=Hello!"}
            >
              <span className="whatsapp-icon-green">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1.2em" width="1.2em"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.7 68.9 27.1 106.1 27.1h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.1-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.5 2.4-11.2 2.5-2.4 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
              </span>
              <span>{translate('WhatsApp', isMarathi)}</span>
            </button>

            {/* Right Button: Confirmation */}
            <button
              type="button"
              className={`tick-confirmation-btn ${isConfirmed ? 'confirmed' : ''}`}
              onClick={handleTickConfirmation}
              disabled={!selectedLocation}
              aria-label={translate('Location is correct', isMarathi)}
            >
              <div className={`confirm-checkbox ${isConfirmed ? 'checked' : ''}`}>
                {isConfirmed && <FiCheck className="checkbox-tick" />}
              </div>
              <span>{translate('Location is correct', isMarathi)}</span>
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
                    onClick={() => {

                      setSelectedDrone(drone);

                      if (!isConfirmed) {
                        setError(translate('Please confirm the location is correct first', isMarathi));
                        // Scroll to the confirmation section so they see the checkbox
                        window.scrollTo({ top: 100, behavior: 'smooth' }); 
                        return; 
                      }

                      setError(translate('Select "Selected" button to go ahead', isMarathi));

                      if (selectedLocation) {
                        navigate('/booking', { 
                          state: { 
                            location: selectedLocation,
                            coordinates: selectedLocation,
                            droneId: drone.droneId,
                            drone: drone
                          } 
                        });
                      } else {
                        setError(translate('Please select a location first', isMarathi));
                      }
                    }}
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
                          e.stopPropagation();

                          setSelectedDrone(drone);

                          if (!isConfirmed) {
                            setError(translate('Please confirm the location is correct first', isMarathi));
                            return;
                          }
                          navigate('/booking', { 
                            state: { 
                              location: selectedLocation,
                              coordinates: selectedLocation,
                              droneId: drone.droneId,
                              drone: drone
                            } 
                          });
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

