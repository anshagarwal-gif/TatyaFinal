import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'

function VendorEquipmentPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    select: '',
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
    // Navigate to vendor dashboard after completion
    alert('Vendor onboarding completed successfully!')
    navigate('/vendor-dashboard')
  }

  return (
    <div className="vendor-form-page">
      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Equipment Basics</h1>

        <div className="form-fields">
          <div className="form-group">
            <input
              type="text"
              placeholder="Select"
              value={formData.select}
              onChange={(e) => handleInputChange('select', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="section-title">
            <h3>Details</h3>
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
              type="text"
              placeholder="Year of Make"
              value={formData.yearOfMake}
              onChange={(e) => handleInputChange('yearOfMake', e.target.value)}
              className="form-input"
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
            <input
              type="text"
              placeholder="Upload Images"
              value={formData.uploadImages}
              onChange={(e) => handleInputChange('uploadImages', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Upload Documents"
              value={formData.uploadDocuments}
              onChange={(e) => handleInputChange('uploadDocuments', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Submit Button - Green for final page */}
        <button 
          className="submit-button green"
          onClick={handleSubmit}
        >
          Submit
        </button>

      </div>
    </div>
  )
}

export default VendorEquipmentPage