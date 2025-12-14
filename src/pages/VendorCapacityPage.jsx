import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'

function VendorCapacityPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    maxAcresPerDay: '',
    minBookingAcres: '',
    serviceRadius: '',
    operationalMonths: '',
    leadTime: '',
    estimatedCoverageArea: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    navigate('/vendor-drone-details')
  }

  return (
    <div className="vendor-form-page">
      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Capacity & Coverage</h1>

        <div className="form-fields">
          <div className="form-group">
            <input
              type="text"
              placeholder="Max Acres Per Day"
              value={formData.maxAcresPerDay}
              onChange={(e) => handleInputChange('maxAcresPerDay', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Min Booking Acres"
              value={formData.minBookingAcres}
              onChange={(e) => handleInputChange('minBookingAcres', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Service Radius (km)"
              value={formData.serviceRadius}
              onChange={(e) => handleInputChange('serviceRadius', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="section-title">
            <h3>Operational Months</h3>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Select"
              value={formData.operationalMonths}
              onChange={(e) => handleInputChange('operationalMonths', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Lead Time (Days)"
              value={formData.leadTime}
              onChange={(e) => handleInputChange('leadTime', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="section-title">
            <h3>Estimated Coverage Area</h3>
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

export default VendorCapacityPage