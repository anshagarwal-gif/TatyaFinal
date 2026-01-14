import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'
import { FiArrowLeft } from 'react-icons/fi'
import { saveOnboardingStep3, getOnboardingData } from '../services/api'

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
          
          // Parse operational months and days from JSON string
          let operationalMonths = []
          let operationalDays = []
          
          try {
            if (drone.operationalMonths) {
              operationalMonths = typeof drone.operationalMonths === 'string' 
                ? JSON.parse(drone.operationalMonths) 
                : drone.operationalMonths
            }
            if (drone.operationalDays) {
              operationalDays = typeof drone.operationalDays === 'string'
                ? JSON.parse(drone.operationalDays)
                : drone.operationalDays
            }
          } catch (e) {
            // If JSON parsing fails, try comma-separated
            if (drone.operationalMonths && typeof drone.operationalMonths === 'string') {
              operationalMonths = drone.operationalMonths.split(',').map(m => m.trim()).filter(m => m)
            }
            if (drone.operationalDays && typeof drone.operationalDays === 'string') {
              operationalDays = drone.operationalDays.split(',').map(d => d.trim()).filter(d => d)
            }
          }
          
          setFormData(prev => ({
            ...prev,
            maxAcresPerDay: drone.maxAcresPerDay ? String(drone.maxAcresPerDay) : '',
            minBookingAcres: drone.minBookingAcres ? String(drone.minBookingAcres) : '',
            serviceRadius: drone.serviceRadiusKm ? String(drone.serviceRadiusKm) : '',
            operationalMonths: operationalMonths || [],
            operationalDays: operationalDays || [],
            leadTime: drone.leadTimeDays ? String(drone.leadTimeDays) : ''
          }))
        }
      } catch (error) {
        console.error('Error loading saved data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedData()
  }, [])

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

  const handleSubmit = async () => {
    const vendorId = localStorage.getItem('vendorId')
    if (!vendorId) {
      setErrorMessage('Please complete registration first')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      const step3Data = {
        vendorId: parseInt(vendorId),
        maxAcresPerDay: formData.maxAcresPerDay ? parseInt(formData.maxAcresPerDay) : null,
        minBookingAcres: formData.minBookingAcres ? parseInt(formData.minBookingAcres) : null,
        serviceRadius: formData.serviceRadius ? parseFloat(formData.serviceRadius) : null,
        operationalMonths: formData.operationalMonths,
        operationalDays: formData.operationalDays,
        leadTime: formData.leadTime ? parseInt(formData.leadTime) : null
      }

      await saveOnboardingStep3(step3Data)
      navigate('/vendor-location')
    } catch (error) {
      setErrorMessage(error.message || 'Failed to save. Please try again.')
      setIsSaving(false)
    }
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

export default VendorCapacityPage