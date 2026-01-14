import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'
import { FiArrowLeft } from 'react-icons/fi'
import { saveOnboardingStep1, uploadEquipmentImages, uploadDocuments, getOnboardingData } from '../services/api'

function VendorEquipmentPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    equipmentType: '',
    brand: '',
    modelName: '',
    yearOfMake: '',
    serialNo: '',
    uploadImages: null,
    uploadDocuments: null
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  // Load saved data when component mounts
  useEffect(() => {
    const loadSavedData = async () => {
      const vendorId = localStorage.getItem('vendorId')
      if (!vendorId) {
        setIsLoading(false)
        return
      }

      try {
        const response = await getOnboardingData(parseInt(vendorId))
        if (response.success && response.data && response.data.drone) {
          const drone = response.data.drone
          setFormData(prev => ({
            ...prev,
            equipmentType: drone.equipmentType || '',
            brand: drone.brand || '',
            modelName: drone.modelName || '',
            yearOfMake: drone.yearOfMake ? String(drone.yearOfMake) : '',
            serialNo: drone.serialNo || ''
          }))
        }
      } catch (error) {
        console.error('Error loading saved data:', error)
        // Continue even if loading fails - user can still fill the form
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedData()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async () => {
    // Get vendorId from localStorage
    const vendorId = localStorage.getItem('vendorId')
    if (!vendorId) {
      setErrorMessage('Please complete registration first')
      return
    }

    // Validate required fields
    if (!formData.equipmentType || !formData.brand || !formData.modelName || !formData.yearOfMake) {
      setErrorMessage('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      // Save step 1 data
      const step1Data = {
        vendorId: parseInt(vendorId),
        equipmentType: formData.equipmentType,
        brand: formData.brand,
        modelName: formData.modelName,
        yearOfMake: parseInt(formData.yearOfMake),
        serialNo: formData.serialNo || null
      }

      const response = await saveOnboardingStep1(step1Data)
      const droneId = response.data?.droneId || null

      // Upload images if provided
      if (formData.uploadImages && formData.uploadImages.length > 0) {
        try {
          await uploadEquipmentImages(parseInt(vendorId), droneId, formData.uploadImages)
        } catch (error) {
          console.error('Error uploading images:', error)
          // Continue even if image upload fails
        }
      }

      // Upload documents if provided
      if (formData.uploadDocuments && formData.uploadDocuments.length > 0) {
        try {
          await uploadDocuments(parseInt(vendorId), droneId, formData.uploadDocuments)
        } catch (error) {
          console.error('Error uploading documents:', error)
          // Continue even if document upload fails
        }
      }

      // Store droneId for next steps
      if (droneId) {
        localStorage.setItem('droneId', droneId)
      }

      // Navigate to next step
      navigate('/vendor-drone-details')
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save. Please try again.')
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  if (isLoading) {
    return (
      <div className="vendor-form-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px' }}>Loading saved data...</p>
        </div>
      </div>
    )
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
              onChange={(e) => handleInputChange('uploadImages', e.target.files || null)}
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
              onChange={(e) => handleInputChange('uploadDocuments', e.target.files || null)}
              className="form-input"
              style={{ padding: '12px' }}
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

export default VendorEquipmentPage