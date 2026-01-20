import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ServiceSelectionPage.css'
import { translate } from '../utils/translations'
import { 
  FiStar, 
  FiMapPin, 
  FiLoader,
  FiChevronLeft,
  FiClock,
  FiPackage,
  FiUser,
  FiCheckCircle
} from 'react-icons/fi'
import { getAvailableDronesWithSpecifications } from '../services/api'

function ServiceSelectionPage() {
  const navigate = useNavigate()
  const [isMarathi, setIsMarathi] = useState(false)
  const [drones, setDrones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [location, setLocation] = useState('Mumbai') // Default location, can be made dynamic

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Could reverse geocode to get location name
          // For now, keeping default
        },
        () => {
          // Location access denied or failed
        }
      )
    }

    const fetchDrones = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await getAvailableDronesWithSpecifications()
        if (response.success && response.data) {
          setDrones(response.data)
        } else {
          setError('Failed to load services')
        }
      } catch (err) {
        console.error('Error fetching drones:', err)
        setError('Failed to load services. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchDrones()
  }, [])

  const handleBook = (drone) => {
    // Store selected drone and navigate to location page
    localStorage.setItem('selectedDroneId', drone.droneId)
    navigate('/location', {
      state: {
        drone: drone,
        droneId: drone.droneId
      }
    })
  }

  const handleBack = () => {
    navigate('/benefits')
  }

  // Calculate rating and reviews (mock data for now, can be replaced with actual data)
  const getDroneRating = (drone) => {
    // If vendor has rating, use it; otherwise use default
    if (drone.vendor?.ratingAvg) {
      return Number(drone.vendor.ratingAvg).toFixed(1)
    }
    // Mock ratings based on drone ID for demonstration
    return (4.0 + (drone.droneId % 2) * 0.5).toFixed(1)
  }

  const getDroneReviews = (drone) => {
    // Mock reviews count, can be replaced with actual data
    const reviews = [1200, 500, 800, 300, 1500]
    return reviews[drone.droneId % reviews.length] || 100
  }

  const getPrice = (drone) => {
    // Use pricePerAcre if available, otherwise default
    if (drone.pricePerAcre) {
      return Math.round(Number(drone.pricePerAcre))
    }
    // Mock prices for demonstration
    const prices = [12, 14, 10, 15, 11]
    return prices[drone.droneId % prices.length] || 12
  }

  const getPriceUnit = (drone) => {
    // Determine if price is per acre or per hour
    if (drone.pricePerAcre) {
      return translate('Acre', isMarathi)
    }
    if (drone.pricePerHour) {
      return translate('Hour', isMarathi)
    }
    return translate('Acre', isMarathi) // Default
  }

  return (
    <div className="service-selection-page">
      <div className="service-selection-container">
        {/* Header */}
        <div className="service-selection-header">
          <button className="back-button" onClick={handleBack}>
            <FiChevronLeft className="back-icon" />
          </button>
          <h1 className="page-title">
            {translate('Get multiple options', isMarathi)}
          </h1>
        </div>

        {/* Location Display */}
        <div className="location-display">
          <FiMapPin className="location-icon" />
          <span className="location-text">{location}</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <FiLoader className="loading-icon" />
            <p>{translate('Loading services...', isMarathi)}</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              {translate('Retry', isMarathi)}
            </button>
          </div>
        )}

        {/* Services List */}
        {!loading && !error && (
          <div className="services-list">
            {drones.length > 0 ? (
              drones.map((drone) => {
                const rating = getDroneRating(drone)
                const reviews = getDroneReviews(drone)
                const price = getPrice(drone)
                const priceUnit = getPriceUnit(drone)
                const droneName = drone.droneModel || drone.droneName || 'Drone Service'
                const pilotName = drone.vendor?.user?.fullName || translate('Expert Pilot', isMarathi)
                const flightTime = drone.flightTimeMinutes ? `> ${drone.flightTimeMinutes} min` : '> 5 min'
                const capacity = drone.capacityLiters ? `${drone.capacityLiters}L` : '10L'

                return (
                  <div key={drone.droneId} className="service-card">
                    {/* Top Section - Near You Badge and Rating */}
                    <div className="service-card-top">
                      <span className="near-you-badge">{translate('Near You', isMarathi)}</span>
                      <div className="service-rating-badge">
                        <span className="rating-value">{rating}</span>
                        <FiStar className="star-icon-filled" />
                      </div>
                    </div>

                    {/* Middle Section - Service Details */}
                    <div className="service-card-middle">
                      <div className="service-info-section">
                        <h3 className="service-name">{droneName}</h3>
                        <div className="service-specs">
                          <div className="spec-item">
                            <FiClock className="spec-icon" />
                            <span>{flightTime}</span>
                          </div>
                          <div className="spec-item">
                            <FiPackage className="spec-icon" />
                            <span>{capacity}</span>
                          </div>
                        </div>
                        <div className="service-pilot">
                          <div className="pilot-avatar">
                            <FiUser className="pilot-icon" />
                          </div>
                          <span className="pilot-name">{pilotName}</span>
                        </div>
                        <div className="service-reviews">
                          <span className="reviews-count">
                            {reviews} {translate('reviews', isMarathi)}
                          </span>
                        </div>
                      </div>
                      <div className="service-price-section">
                        <div className="price-display">
                          <span className="price-currency">₹</span>
                          <span className="price-value">{price}</span>
                        </div>
                        <div className="price-unit">/{priceUnit}</div>
                      </div>
                    </div>

                    {/* Bottom Section - Book Button */}
                    <button 
                      className="book-button"
                      onClick={() => handleBook(drone)}
                    >
                      {translate('Book +', isMarathi)}
                    </button>
                  </div>
                )
              })
            ) : (
              <div className="no-services">
                <p>{translate('No services available at the moment', isMarathi)}</p>
              </div>
            )}
          </div>
        )}

        {/* Transparency Message */}
        {!loading && !error && drones.length > 0 && (
          <div className="transparency-message">
            <FiCheckCircle className="transparency-icon" />
            <p>
              {translate('Get ratings on each drone, see what you\'re getting, find the best options, and make informed decisions.', isMarathi)}
            </p>
          </div>
        )}

        {/* Language Toggle */}
        <button 
          className="language-toggle"
          onClick={() => setIsMarathi(!isMarathi)}
        >
          {isMarathi ? 'English' : 'मराठी'}
        </button>
      </div>
    </div>
  )
}

export default ServiceSelectionPage
