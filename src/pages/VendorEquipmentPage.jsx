import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'
import { FiArrowLeft } from 'react-icons/fi'

function VendorEquipmentPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    equipmentType: '',
    brand: '',
    modelName: '',
    yearOfMake: '',
    serialNo: '',
    uploadImages: '',
    uploadDocuments: ''
  })
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = () => {
    // Navigate to next step: Drone-Specific Details
    navigate('/vendor-drone-details')
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="vendor-form-page">
      {/* Header with Back Button */}
      <div className="form-header">
        <button className="back-button" onClick={handleBack} aria-label="Go back">
          <FiArrowLeft />
        </button>
        <div className="progress-indicator">
          <span className="progress-text">Step 1 of 6</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Equipment Basics</h1>

        <div className="form-fields">
          <div className="form-group">
            <select
              value={formData.equipmentType}
              onChange={(e) => handleInputChange('equipmentType', e.target.value)}
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
              <option value="">Select Equipment Type</option>
              <option value="agricultural-drone">Agricultural Drone</option>
              <option value="spraying-drone">Spraying Drone</option>
              <option value="monitoring-drone">Monitoring Drone</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Model Name"
              value={formData.modelName}
              onChange={(e) => handleInputChange('modelName', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Year of Make"
              value={formData.yearOfMake}
              onChange={(e) => handleInputChange('yearOfMake', e.target.value)}
              className="form-input"
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Serial No (optional)"
              value={formData.serialNo}
              onChange={(e) => handleInputChange('serialNo', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="section-title">
            <h3>Upload Media</h3>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
              Upload Equipment Images (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleInputChange('uploadImages', e.target.files)}
              className="form-input"
              style={{ padding: '12px' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#666' }}>
              Upload Documents (optional)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={(e) => handleInputChange('uploadDocuments', e.target.files)}
              className="form-input"
              style={{ padding: '12px' }}
            />
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

export default VendorEquipmentPage