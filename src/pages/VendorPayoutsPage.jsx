import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'

function VendorPayoutsPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    upiId: '',
    bankIfscCode: '',
    bankName: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    navigate('/vendor-availability')
  }

  return (
    <div className="vendor-form-page">
      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Payouts</h1>

        <div className="form-fields">
          <div className="form-group">
            <input
              type="text"
              placeholder="UPI ID"
              value={formData.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Bank IFSC Code"
              value={formData.bankIfscCode}
              onChange={(e) => handleInputChange('bankIfscCode', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Bank Name (optional, auto-fetch)"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div className="info-text">
          <p>Tatya will send your payouts securely every 7 days.</p>
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

export default VendorPayoutsPage