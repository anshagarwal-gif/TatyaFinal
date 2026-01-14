import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'
import { FiArrowLeft } from 'react-icons/fi'

function VendorAvailabilityPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    slaReachTime: '',
    timeBatches: [],
    availabilityStatus: ''
  })
  const [errors, setErrors] = useState({})

  const timeBatchOptions = [
    { value: 'morning', label: 'Morning Batch (6-11 AM)' },
    { value: 'evening', label: 'Evening Batch (4-6 PM)' },
    { value: 'night', label: 'Night Batch (6-11 PM)' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTimeBatchToggle = (batch) => {
    setFormData(prev => ({
      ...prev,
      timeBatches: prev.timeBatches.includes(batch)
        ? prev.timeBatches.filter(b => b !== batch)
        : [...prev.timeBatches, batch]
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Please select start date'
    }
    if (!formData.endDate.trim()) {
      newErrors.endDate = 'Please select end date'
    }
    if (!formData.slaReachTime.trim()) {
      newErrors.slaReachTime = 'Please enter SLA reach time'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBack = () => {
    navigate('/vendor-location')
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // Navigate to final step: Payouts
      navigate('/vendor-payouts')
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
          <span className="progress-text">Step 5 of 6</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Availability & SLA</h1>

        <div className="form-fields">
          <div className="date-row">
            <div className="date-group">
              <label className="date-label">Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
                style={{ marginTop: '8px' }}
              />
              {errors.startDate && <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>{errors.startDate}</span>}
            </div>
            <div className="date-group">
              <label className="date-label">End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="form-input"
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                style={{ marginTop: '8px' }}
              />
              {errors.endDate && <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>{errors.endDate}</span>}
            </div>
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="SLA Reach Time (hours) *"
              value={formData.slaReachTime}
              onChange={(e) => handleInputChange('slaReachTime', e.target.value)}
              className="form-input"
              min="0"
            />
            {errors.slaReachTime && <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>{errors.slaReachTime}</span>}
          </div>

          <div className="section-title">
            <h3>Working Hours</h3>
          </div>

          <div className="checkbox-grid">
            {timeBatchOptions.map((batch) => (
              <label key={batch.value} className="checkbox-item-inline">
                <input
                  type="checkbox"
                  checked={formData.timeBatches.includes(batch.value)}
                  onChange={() => handleTimeBatchToggle(batch.value)}
                />
                <span className="checkbox-label">{batch.label}</span>
              </label>
            ))}
          </div>

          <div className="form-group">
            <select
              value={formData.availabilityStatus}
              onChange={(e) => handleInputChange('availabilityStatus', e.target.value)}
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
              <option value="">Select Availability Status</option>
              <option value="available">Available</option>
            </select>
          </div>
        </div>

        <div className="section-title">
          <p>Calendar & SLA Clock</p>
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

export default VendorAvailabilityPage