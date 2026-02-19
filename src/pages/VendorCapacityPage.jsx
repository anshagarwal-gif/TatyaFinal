import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'
import { FiArrowLeft } from 'react-icons/fi'
import { saveOnboardingStep3, getOnboardingData } from '../services/api'
import ProgressBar from '../components/ProgressBar'

function VendorCapacityPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    batterySets: [
      { id: 1, capacity: '' },
      { id: 2, capacity: '' }
    ],
    acreTargetPerDay: '',
    maxAcresPerDay: '',
    minBookingAcres: '',
    serviceRadius: '',
    operationalMonths: [],
    operationalDays: [],
    leadTime: '',
    hasChargingFacility: false,
    numberOfSpareBatteries: '',
    droneWarehouse: '',
    hasGenerator: false,
    generatorHp: '',
    chargerVoltage: ''
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
          
          // Parse battery sets from JSON or create default
          let batterySets = [
            { id: 1, capacity: '' },
            { id: 2, capacity: '' }
          ]
          
          try {
            if (drone.batterySets) {
              const parsed = typeof drone.batterySets === 'string' 
                ? JSON.parse(drone.batterySets) 
                : drone.batterySets
              if (Array.isArray(parsed) && parsed.length > 0) {
                batterySets = parsed.map((bs, idx) => ({
                  id: bs.id || idx + 1,
                  capacity: bs.capacity ? String(bs.capacity) : ''
                }))
                // Ensure at least 2 primary sets
                while (batterySets.length < 2) {
                  batterySets.push({ id: batterySets.length + 1, capacity: '' })
                }
              }
            } else if (drone.batteryCapacityMah) {
              // Migrate old single capacity to Battery Set 1
              batterySets[0].capacity = String(drone.batteryCapacityMah)
            }
          } catch (e) {
            console.error('Error parsing battery sets:', e)
          }
          
          setFormData(prev => ({
            ...prev,
            batterySets: batterySets,
            acreTargetPerDay: drone.acreTargetPerDay ? String(drone.acreTargetPerDay) : '',
            maxAcresPerDay: drone.maxAcresPerDay ? String(drone.maxAcresPerDay) : '',
            minBookingAcres: drone.minBookingAcres ? String(drone.minBookingAcres) : '',
            serviceRadius: drone.serviceRadiusKm ? String(drone.serviceRadiusKm) : '',
            operationalMonths: operationalMonths || [],
            operationalDays: operationalDays || [],
            leadTime: drone.leadTimeDays ? String(drone.leadTimeDays) : '',
            hasChargingFacility: drone.hasChargingFacility || false,
            numberOfSpareBatteries: drone.numberOfSpareBatteries ? String(drone.numberOfSpareBatteries) : '',
            droneWarehouse: drone.droneWarehouse || '',
            hasGenerator: drone.hasGenerator || false,
            generatorHp: drone.generatorHp ? String(drone.generatorHp) : '',
            chargerVoltage: drone.chargerVoltage ? String(drone.chargerVoltage) : ''
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

  const handleBatterySetCapacityChange = (setId, capacity) => {
    setFormData(prev => ({
      ...prev,
      batterySets: prev.batterySets.map(bs => 
        bs.id === setId ? { ...bs, capacity } : bs
      )
    }))
  }

  const handleAddBatterySet = () => {
    if (formData.batterySets.length < 4) {
      const nextId = formData.batterySets.length + 1
      setFormData(prev => ({
        ...prev,
        batterySets: [...prev.batterySets, { id: nextId, capacity: '' }]
      }))
    }
  }

  const handleRemoveBatterySet = (setId) => {
    // Don't allow removing Battery Set 1 or 2 (primary sets)
    if (setId <= 2) return
    
    setFormData(prev => ({
      ...prev,
      batterySets: prev.batterySets.filter(bs => bs.id !== setId)
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

  const handleChargingFacilityToggle = () => {
    setFormData(prev => ({
      ...prev,
      hasChargingFacility: !prev.hasChargingFacility
    }))
  }

  const handleGeneratorToggle = () => {
    setFormData(prev => ({
      ...prev,
      hasGenerator: !prev.hasGenerator
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
        batterySets: formData.batterySets.map(bs => ({
          id: bs.id,
          capacity: bs.capacity ? parseInt(bs.capacity) : null
        })),
        acreTargetPerDay: formData.acreTargetPerDay ? parseInt(formData.acreTargetPerDay) : null,
        maxAcresPerDay: formData.maxAcresPerDay ? parseInt(formData.maxAcresPerDay) : null,
        minBookingAcres: formData.minBookingAcres ? parseInt(formData.minBookingAcres) : null,
        serviceRadius: formData.serviceRadius ? parseFloat(formData.serviceRadius) : null,
        operationalMonths: formData.operationalMonths,
        operationalDays: formData.operationalDays,
        leadTime: formData.leadTime ? parseInt(formData.leadTime) : null,
        hasChargingFacility: formData.hasChargingFacility,
        numberOfSpareBatteries: formData.numberOfSpareBatteries ? parseInt(formData.numberOfSpareBatteries) : null,
        droneWarehouse: formData.droneWarehouse,
        hasGenerator: formData.hasGenerator,
        generatorHp: formData.generatorHp ? parseFloat(formData.generatorHp) : null,
        chargerVoltage: formData.chargerVoltage ? parseFloat(formData.chargerVoltage) : null
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
      {/* Progress Bar */}
      <ProgressBar 
        currentStep={3} 
        totalSteps={6}
        steps={['Equipment', 'Drone Details', 'Capacity', 'Location', 'Availability', 'Payouts']}
      />

      {/* Header with Back Button */}
      <div className="form-header">
        <button className="back-button" onClick={handleBack} aria-label="Go back">
          <FiArrowLeft />
        </button>
      </div>

      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Capacity & Coverage</h1>

        <div className="form-fields">
          {/* Battery Sets Section */}
          <div className="section-title">
            <h3>Select Battery Set</h3>
          </div>

          {/* Battery Sets Table */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px'
            }}>
              {/* Table Header */}
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#333', padding: '8px 0' }}>Battery Set</div>
              <div style={{ fontWeight: '600', fontSize: '14px', color: '#333', padding: '8px 0' }}>Capacity (mAh)</div>
            </div>

            {/* Battery Set Rows */}
            {formData.batterySets.map((batterySet) => (
              <div key={batterySet.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                marginBottom: '12px',
                alignItems: 'center'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontSize: '14px',
                  color: '#333'
                }}>
                  Battery Set {batterySet.id}
                  {batterySet.id > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBatterySet(batterySet.id)}
                      style={{
                        marginLeft: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '0 4px'
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
                <select
                  value={batterySet.capacity}
                  onChange={(e) => handleBatterySetCapacityChange(batterySet.id, e.target.value)}
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
                  <option value="">Select Capacity</option>
                  <option value="36000">36,000 mAh</option>
                  <option value="40000">40,000 mAh</option>
                  <option value="44000">44,000 mAh</option>
                  <option value="50000">50,000 mAh</option>
                  <option value="60000">60,000 mAh</option>
                </select>
              </div>
            ))}

            {/* Add Battery Set Button - Static */}
            {formData.batterySets.length < 4 && (
              <button
                type="button"
                onClick={handleAddBatterySet}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#F5F5F5',
                  border: '2px dashed #ccc',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#666',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  marginTop: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#EEEEEE'
                  e.target.style.borderColor = '#999'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#F5F5F5'
                  e.target.style.borderColor = '#ccc'
                }}
              >
                <span style={{ fontSize: '18px' }}>+</span>
                Add Battery Set
              </button>
            )}
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Acre Target Per Day"
              value={formData.acreTargetPerDay}
              onChange={(e) => handleInputChange('acreTargetPerDay', e.target.value)}
              className="form-input"
              min="0"
            />
          </div>

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

          <div className="section-title">
            <h3>Storage Information</h3>
          </div>

          <div className="toggle-group">
            <span className="toggle-label">Has Charging Facility</span>
            <div 
              className={`toggle-switch ${formData.hasChargingFacility ? 'active' : ''}`}
              onClick={handleChargingFacilityToggle}
            >
              <div className="toggle-thumb"></div>
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Number of Spare Batteries"
              value={formData.numberOfSpareBatteries}
              onChange={(e) => handleInputChange('numberOfSpareBatteries', e.target.value)}
              className="form-input"
              disabled={!formData.hasChargingFacility}
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Drone Warehouse / Field Charging"
              value={formData.droneWarehouse}
              onChange={(e) => handleInputChange('droneWarehouse', e.target.value)}
              className="form-textarea"
              rows="4"
            />
          </div>

          <div className="toggle-group">
            <span className="toggle-label">Do you have a Generator?</span>
            <div 
              className={`toggle-switch ${formData.hasGenerator ? 'active' : ''}`}
              onClick={handleGeneratorToggle}
            >
              <div className="toggle-thumb"></div>
            </div>
          </div>

          {formData.hasGenerator && (
            <>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Total HP of Generator or On-field Charger Carrying Capacity"
                  value={formData.generatorHp}
                  onChange={(e) => handleInputChange('generatorHp', e.target.value)}
                  className="form-input"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <input
                  type="number"
                  placeholder="Total Voltage of Charger"
                  value={formData.chargerVoltage}
                  onChange={(e) => handleInputChange('chargerVoltage', e.target.value)}
                  className="form-input"
                  min="0"
                  step="0.1"
                />
              </div>
            </>
          )}
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