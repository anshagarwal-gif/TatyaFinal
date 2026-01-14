import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'
import { FiArrowLeft } from 'react-icons/fi'

function VendorCapacityPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    maxAcresPerDay: '',
    minBookingAcres: '',
    serviceRadius: '',
    operationalMonths: [],
    operationalDays: [],
    leadTime: ''
  })

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const days = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMonthToggle = (month) => {
    setFormData(prev => ({
      ...prev,
      operationalMonths: prev.operationalMonths.includes(month)
        ? prev.operationalMonths.filter(m => m !== month)
        : [...prev.operationalMonths, month]
    }))
  }

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      operationalDays: prev.operationalDays.includes(day)
        ? prev.operationalDays.filter(d => d !== day)
        : [...prev.operationalDays, day]
    }))
  }

  const handleBack = () => {
    navigate('/vendor-drone-details')
  }

  const handleSubmit = () => {
    // Navigate to next step: Location & Logistics
    navigate('/vendor-location')
  }

  return (
    <div className="vendor-form-page">
      {/* Header with Back Button */}
      <div className="form-header">
        <button className="back-button" onClick={handleBack} aria-label="Go back">
          <FiArrowLeft />
        </button>
        <div className="progress-indicator">
          <span className="progress-text">Step 3 of 6</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Capacity & Coverage</h1>

        <div className="form-fields">
          <div className="form-group">
            <input
              type="number"
              placeholder="Max Acres Per Day"
              value={formData.maxAcresPerDay}
              onChange={(e) => handleInputChange('maxAcresPerDay', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Min Booking Acres"
              value={formData.minBookingAcres}
              onChange={(e) => handleInputChange('minBookingAcres', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Service Radius (km)"
              value={formData.serviceRadius}
              onChange={(e) => handleInputChange('serviceRadius', e.target.value)}
              className="form-input"
              min="0"
              step="0.1"
            />
          </div>

          <div className="section-title">
            <h3>Operational Months</h3>
          </div>

          <div className="checkbox-grid">
            {months.map((month) => (
              <label key={month} className="checkbox-item-inline">
                <input
                  type="checkbox"
                  checked={formData.operationalMonths.includes(month)}
                  onChange={() => handleMonthToggle(month)}
                />
                <span className="checkbox-label">{month}</span>
              </label>
            ))}
          </div>

          <div className="section-title">
            <h3>Operational Days</h3>
          </div>

          <div className="checkbox-grid">
            {days.map((day) => (
              <label key={day} className="checkbox-item-inline">
                <input
                  type="checkbox"
                  checked={formData.operationalDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
                <span className="checkbox-label">{day}</span>
              </label>
            ))}
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Lead Time (Days)"
              value={formData.leadTime}
              onChange={(e) => handleInputChange('leadTime', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <label style={{ fontSize: '0.875rem', color: '#666', marginBottom: '8px', display: 'block' }}>Estimated Coverage Area</label>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          className="submit-button"
          onClick={handleSubmit}
        >
          Continue
        </button>

      </div>
    </div>
  )
}

export default VendorCapacityPage