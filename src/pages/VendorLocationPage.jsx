import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'

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

  const handleSubmit = () => {
    navigate('/vendor-capacity')
  }

  return (
    <div className="vendor-form-page">
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
            <input
              type="text"
              placeholder="Select"
              value={formData.serviceAreas}
              onChange={(e) => handleInputChange('serviceAreas', e.target.value)}
              className="form-input"
            />
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

        {/* Submit Button */}
        <button 
          className="submit-button"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default VendorLocationPage