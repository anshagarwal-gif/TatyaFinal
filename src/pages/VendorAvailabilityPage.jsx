import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'

function VendorAvailabilityPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    startDate: 'Tue, Oct 24',
    endDate: 'Wed, Oct 25',
    slaReachTime: '',
    select: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    navigate('/vendor-location')
  }

  return (
    <div className="vendor-form-page">
      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Availability & SLA</h1>

        <div className="form-fields">
          <div className="date-row">
            <div className="date-group">
              <label className="date-label">Start</label>
              <div className="date-value">{formData.startDate}</div>
            </div>
            <div className="date-group">
              <label className="date-label">End</label>
              <div className="date-value">{formData.endDate}</div>
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="SLA Reach Time (hours)"
              value={formData.slaReachTime}
              onChange={(e) => handleInputChange('slaReachTime', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Select"
              value={formData.select}
              onChange={(e) => handleInputChange('select', e.target.value)}
              className="form-input"
            />
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
          Submit
        </button>

      </div>
    </div>
  )
}

export default VendorAvailabilityPage