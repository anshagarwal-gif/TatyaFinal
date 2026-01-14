import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'
import { FiArrowLeft } from 'react-icons/fi'
import { saveOnboardingStep4 } from '../services/api'

function VendorLocationPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    baseLocation: '',
    coordinates: '',
    serviceAreas: '',
    hasChargingFacility: false,
    numberOfSpareBatteries: '',
    droneWarehouse: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleToggle = () => {
    setFormData(prev => ({
      ...prev,
      hasChargingFacility: !prev.hasChargingFacility
    }))
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
        serviceAreas: formData.serviceAreas,
        hasChargingFacility: formData.hasChargingFacility,
        numberOfSpareBatteries: formData.numberOfSpareBatteries ? parseInt(formData.numberOfSpareBatteries) : null,
        droneWarehouse: formData.droneWarehouse
      }

      await saveOnboardingStep4(step4Data)
      navigate('/vendor-availability')
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <div className="vendor-form-page">
      {/* Header with Back Button */}
      <div className="form-header">
        <button className="back-button" onClick={handleBack} aria-label="Go back">
          <FiArrowLeft />
        </button>
        <div className="progress-indicator">
          <span className="progress-text">Step 4 of 6</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Location & Logistics</h1>

        <div className="form-fields">
          <div className="form-group">
            <input
              type="text"
              placeholder="Base Location"
              value={formData.baseLocation}
              onChange={(e) => handleInputChange('baseLocation', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Coordinates (lat/lng)"
              value={formData.coordinates}
              onChange={(e) => handleInputChange('coordinates', e.target.value)}
              className="form-input"
            />
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

          <div className="section-title">
            <h3>Storage Information</h3>
          </div>

          <div className="toggle-group">
            <span className="toggle-label">Has Charging Facility</span>
            <div 
              className={`toggle-switch ${formData.hasChargingFacility ? 'active' : ''}`}
              onClick={handleToggle}
            >
              <div className="toggle-thumb"></div>
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Number of Spare Batteries"
              value={formData.numberOfSpareBatteries}
              onChange={(e) => handleInputChange('numberOfSpareBatteries', e.target.value)}
              className="form-input"
              disabled={!formData.hasChargingFacility}
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Drone Warehouse / Field Charging"
              value={formData.droneWarehouse}
              onChange={(e) => handleInputChange('droneWarehouse', e.target.value)}
              className="form-textarea"
              rows="4"
            />
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