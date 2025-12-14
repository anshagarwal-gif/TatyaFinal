import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'

function VendorDroneDetailsPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    droneName: '',
    select: '',
    payload: '',
    sprayWidth: '',
    tankSize: '',
    flightTime: '',
    batterySwapTime: '',
    selectOption: '',
    uin: '',
    uaop: '',
    pilotLicense: '',
    returnToHome: false,
    terrainFollowing: false
  })

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

  const handleSubmit = () => {
    navigate('/vendor-equipment')
  }

  return (
    <div className="vendor-form-page">
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
            <input
              type="text"
              placeholder="Select"
              value={formData.select}
              onChange={(e) => handleInputChange('select', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Payload (Liters)"
              value={formData.payload}
              onChange={(e) => handleInputChange('payload', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Spray Width (m)"
              value={formData.sprayWidth}
              onChange={(e) => handleInputChange('sprayWidth', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Tank Size (Liters)"
              value={formData.tankSize}
              onChange={(e) => handleInputChange('tankSize', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Flight Time (min)"
              value={formData.flightTime}
              onChange={(e) => handleInputChange('flightTime', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Battery Swap Time (min)"
              value={formData.batterySwapTime}
              onChange={(e) => handleInputChange('batterySwapTime', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Select"
              value={formData.selectOption}
              onChange={(e) => handleInputChange('selectOption', e.target.value)}
              className="form-input"
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

export default VendorDroneDetailsPage