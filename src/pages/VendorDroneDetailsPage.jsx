import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'
import { FiArrowLeft } from 'react-icons/fi'
import { saveOnboardingStep2 } from '../services/api'

function VendorDroneDetailsPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    droneName: '',
    droneType: 'Spraying',
    tankSize: '',
    sprayWidth: '',
    batteryCapacity: '',
    numberOfBatteries: '',
    flightTime: '',
    batterySwapTime: '',
    uin: '',
    uaop: '',
    pilotLicense: '',
    returnToHome: false,
    terrainFollowing: false
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckboxChange = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleBack = () => {
    navigate('/vendor-equipment')
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
      const step2Data = {
        vendorId: parseInt(vendorId),
        droneName: formData.droneName,
        droneType: formData.droneType,
        tankSize: formData.tankSize ? parseFloat(formData.tankSize) : null,
        sprayWidth: formData.sprayWidth ? parseFloat(formData.sprayWidth) : null,
        batteryCapacity: formData.batteryCapacity ? parseInt(formData.batteryCapacity) : null,
        numberOfBatteries: formData.numberOfBatteries ? parseInt(formData.numberOfBatteries) : null,
        flightTime: formData.flightTime ? parseInt(formData.flightTime) : null,
        batterySwapTime: formData.batterySwapTime ? parseInt(formData.batterySwapTime) : null,
        uin: formData.uin || null,
        uaop: formData.uaop || null,
        pilotLicense: formData.pilotLicense || null,
        returnToHome: formData.returnToHome,
        terrainFollowing: formData.terrainFollowing
      }

      await saveOnboardingStep2(step2Data)
      navigate('/vendor-capacity')
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
          <span className="progress-text">Step 2 of 6</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Drone-Specific Details</h1>

        <div className="form-fields">
          <div className="form-group">
            <input
              type="text"
              placeholder="Drone Name"
              value={formData.droneName}
              onChange={(e) => handleInputChange('droneName', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <select
              value={formData.droneType}
              onChange={(e) => handleInputChange('droneType', e.target.value)}
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
              <option value="Spraying">Spraying</option>
              <option value="Surveillance">Surveillance</option>
              <option value="Logistic">Logistic</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Tank Size (Liters)"
              value={formData.tankSize}
              onChange={(e) => handleInputChange('tankSize', e.target.value)}
              className="form-input"
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Spray Width (m)"
              value={formData.sprayWidth}
              onChange={(e) => handleInputChange('sprayWidth', e.target.value)}
              className="form-input"
              min="0"
              step="0.1"
            />
          </div>

          <div className="form-group">
            <select
              value={formData.batteryCapacity}
              onChange={(e) => handleInputChange('batteryCapacity', e.target.value)}
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
              <option value="">Select Battery Capacity</option>
              <option value="36000">36,000 mAh</option>
              <option value="40000">40,000 mAh</option>
              <option value="44000">44,000 mAh</option>
              <option value="50000">50,000 mAh</option>
              <option value="60000">60,000 mAh</option>
            </select>
          </div>

          <div className="form-group">
            <select
              value={formData.numberOfBatteries}
              onChange={(e) => handleInputChange('numberOfBatteries', e.target.value)}
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
              <option value="">Number of Batteries</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Flight Time (min)"
              value={formData.flightTime}
              onChange={(e) => handleInputChange('flightTime', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Battery Swap Time (min)"
              value={formData.batterySwapTime}
              onChange={(e) => handleInputChange('batterySwapTime', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="UIN (optional)"
              value={formData.uin}
              onChange={(e) => handleInputChange('uin', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="UAOP (optional)"
              value={formData.uaop}
              onChange={(e) => handleInputChange('uaop', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Pilot License (optional)"
              value={formData.pilotLicense}
              onChange={(e) => handleInputChange('pilotLicense', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="section-title">
            <h3>Safety Features</h3>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.returnToHome}
                onChange={() => handleCheckboxChange('returnToHome')}
              />
              <span className="checkbox-label">Return To Home (RTH)</span>
            </label>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.terrainFollowing}
                onChange={() => handleCheckboxChange('terrainFollowing')}
              />
              <span className="checkbox-label">Terrain Following</span>
            </label>
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

export default VendorDroneDetailsPage