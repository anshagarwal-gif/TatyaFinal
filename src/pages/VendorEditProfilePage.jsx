import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorEditProfilePage.css'
import { getVendorProfile, updateVendorProfile } from '../services/api'
import Snackbar from '../components/Snackbar'

function VendorEditProfilePage() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    // Personal Information
    vendorName: '',
    emailAddress: '',
    phoneNumber: '',
    
    // Equipment Details
    equipmentType: '',
    brand: '',
    modelName: '',
    yearOfMake: '',
    serialNo: '',
    
    // Drone Specifications
    droneName: '',
    droneType: '',
    tankSize: '',
    sprayWidth: '',
    batteryCapacity: '',
    batteryCount: '',
    flightTime: '',
    batterySwapTime: '',
    uin: '',
    uaop: '',
    pilotLicense: '',
    returnToHome: false,
    terrainFollowing: false,
    
    // Capacity & Coverage
    maxAcresPerDay: '',
    minBookingAcres: '',
    serviceRadius: '',
    operationalMonths: [],
    leadTime: '',
    
    // Location & Logistics
    baseLocation: '',
    coordinates: '',
    serviceAreas: '',
    hasChargingFacility: false,
    numberOfSpareBatteries: '',
    droneWarehouse: '',
    
    // Availability & SLA
    availabilityStart: '',
    availabilityEnd: '',
    slaReachTime: '',
    workingHoursBatches: '',
    availabilityStatus: '',
    
    // Payouts
    upiId: '',
    bankIfscCode: '',
    bankName: '',
    bankAccountNumber: '',
    accountHolderName: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState({ isOpen: false, message: '', type: 'success' })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const vendorId = localStorage.getItem('vendorId')
        if (!vendorId) {
          setError('Please login first')
          setLoading(false)
          return
        }
        
        const response = await getVendorProfile(parseInt(vendorId))
        const profile = response.data
        const drone = profile.drone || {}
        const bankAccount = profile.bankAccount || {}
        
        setFormData({
          vendorName: profile.fullName || '',
          emailAddress: profile.email || '',
          phoneNumber: profile.phone || '',
          equipmentType: drone.equipmentType || '',
          brand: drone.brand || '',
          modelName: drone.modelName || '',
          yearOfMake: drone.yearOfMake ? String(drone.yearOfMake) : '',
          serialNo: drone.serialNo || '',
          droneName: drone.droneName || '',
          droneType: drone.droneType || '',
          tankSize: drone.tankSizeLiters ? String(drone.tankSizeLiters) : '',
          sprayWidth: drone.sprayWidthMeters ? String(drone.sprayWidthMeters) : '',
          batteryCapacity: drone.batteryCapacityMah ? String(drone.batteryCapacityMah) : '',
          batteryCount: drone.batteryCount ? String(drone.batteryCount) : '',
          flightTime: drone.flightTimeMinutes ? String(drone.flightTimeMinutes) : '',
          batterySwapTime: drone.batterySwapTimeMinutes ? String(drone.batterySwapTimeMinutes) : '',
          uin: drone.uin || '',
          uaop: drone.uaop || '',
          pilotLicense: drone.pilotLicense || '',
          returnToHome: drone.returnToHome || false,
          terrainFollowing: drone.terrainFollowing || false,
          maxAcresPerDay: drone.maxAcresPerDay ? String(drone.maxAcresPerDay) : '',
          minBookingAcres: drone.minBookingAcres ? String(drone.minBookingAcres) : '',
          serviceRadius: drone.serviceRadiusKm ? String(drone.serviceRadiusKm) : '',
          operationalMonths: drone.operationalMonths ? (typeof drone.operationalMonths === 'string' ? JSON.parse(drone.operationalMonths) : drone.operationalMonths) : [],
          leadTime: drone.leadTimeDays ? String(drone.leadTimeDays) : '',
          baseLocation: drone.baseLocation || '',
          coordinates: drone.coordinates || '',
          serviceAreas: drone.serviceAreas || '',
          hasChargingFacility: drone.hasChargingFacility || false,
          numberOfSpareBatteries: drone.numberOfSpareBatteries ? String(drone.numberOfSpareBatteries) : '',
          droneWarehouse: drone.droneWarehouseDescription || '',
          availabilityStart: drone.availabilityStartDate || '',
          availabilityEnd: drone.availabilityEndDate || '',
          slaReachTime: drone.slaReachTimeHours ? String(drone.slaReachTimeHours) : '',
          workingHoursBatches: drone.workingHoursBatches || '',
          availabilityStatus: drone.availabilityStatus || '',
          upiId: bankAccount.upiId || '',
          bankIfscCode: bankAccount.bankIfscCode || '',
          bankName: bankAccount.bankName || '',
          bankAccountNumber: bankAccount.accountNumber || '',
          accountHolderName: bankAccount.accountHolderName || ''
        })
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }
    
    loadProfile()
  }, [])

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim())
    }))
  }

  const handleSafetyFeatureChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      safetyFeatures: {
        ...prev.safetyFeatures,
        [feature]: !prev.safetyFeatures[feature]
      }
    }))
  }

  const handleSave = async () => {
    const vendorId = localStorage.getItem('vendorId')
    if (!vendorId) {
      setError('Please login first')
      return
    }

    setSaving(true)
    setError('')

    try {
      const updateData = {
        fullName: formData.vendorName,
        email: formData.emailAddress,
        equipmentType: formData.equipmentType,
        brand: formData.brand,
        modelName: formData.modelName,
        yearOfMake: formData.yearOfMake ? parseInt(formData.yearOfMake) : null,
        serialNo: formData.serialNo,
        droneName: formData.droneName,
        droneType: formData.droneType,
        tankSizeLiters: formData.tankSize ? parseFloat(formData.tankSize) : null,
        sprayWidthMeters: formData.sprayWidth ? parseFloat(formData.sprayWidth) : null,
        batteryCapacityMah: formData.batteryCapacity ? parseInt(formData.batteryCapacity) : null,
        batteryCount: formData.batteryCount ? parseInt(formData.batteryCount) : null,
        flightTimeMinutes: formData.flightTime ? parseInt(formData.flightTime) : null,
        batterySwapTimeMinutes: formData.batterySwapTime ? parseInt(formData.batterySwapTime) : null,
        uin: formData.uin,
        uaop: formData.uaop,
        pilotLicense: formData.pilotLicense,
        returnToHome: formData.returnToHome,
        terrainFollowing: formData.terrainFollowing,
        maxAcresPerDay: formData.maxAcresPerDay ? parseInt(formData.maxAcresPerDay) : null,
        minBookingAcres: formData.minBookingAcres ? parseInt(formData.minBookingAcres) : null,
        serviceRadiusKm: formData.serviceRadius ? parseFloat(formData.serviceRadius) : null,
        operationalMonths: Array.isArray(formData.operationalMonths) ? JSON.stringify(formData.operationalMonths) : formData.operationalMonths,
        leadTimeDays: formData.leadTime ? parseInt(formData.leadTime) : null,
        baseLocation: formData.baseLocation,
        coordinates: formData.coordinates,
        serviceAreas: formData.serviceAreas,
        hasChargingFacility: formData.hasChargingFacility,
        numberOfSpareBatteries: formData.numberOfSpareBatteries ? parseInt(formData.numberOfSpareBatteries) : null,
        droneWarehouseDescription: formData.droneWarehouse,
        availabilityStartDate: formData.availabilityStart,
        availabilityEndDate: formData.availabilityEnd,
        slaReachTimeHours: formData.slaReachTime ? parseInt(formData.slaReachTime) : null,
        workingHoursBatches: formData.workingHoursBatches,
        availabilityStatus: formData.availabilityStatus,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.bankAccountNumber,
        bankIfscCode: formData.bankIfscCode,
        bankName: formData.bankName,
        upiId: formData.upiId
      }

      await updateVendorProfile(parseInt(vendorId), updateData)
      setSnackbar({
        isOpen: true,
        message: 'Profile updated successfully!',
        type: 'success'
      })
      // Navigate after a short delay to show the snackbar
      setTimeout(() => {
        navigate('/vendor-dashboard')
      }, 1500)
    } catch (error) {
      const errorMessage = error.message || 'Failed to update profile. Please try again.'
      setError(errorMessage)
      setSnackbar({
        isOpen: true,
        message: errorMessage,
        type: 'error'
      })
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate('/vendor-dashboard')
  }

  if (loading) {
    return (
      <div className="vendor-edit-profile">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="vendor-edit-profile">
      {/* Header */}
      <div className="edit-header">
        <button className="back-btn" onClick={handleCancel}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
        <h1>Edit Vendor Profile</h1>
        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      {error && (
        <div style={{ padding: '1rem', margin: '1rem', background: '#fee', color: '#c33', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div className="edit-content">
        {/* Personal Information Section */}
        <div className="form-section">
          <h2 className="section-title">Personal Information</h2>
          
          <div className="form-group">
            <label className="form-label">Vendor Name *</label>
            <input
              type="text"
              value={formData.vendorName}
              onChange={(e) => handleInputChange('vendorName', e.target.value)}
              className="form-input"
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
              className="form-input"
              placeholder="vendor@example.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="form-input"
              required
              disabled
              title="Phone number cannot be changed"
            />
            <small className="form-help">Phone number cannot be changed</small>
          </div>
        </div>

        {/* Equipment Details Section */}
        <div className="form-section">
          <h2 className="section-title">Equipment Details</h2>
          
          <div className="form-group">
            <label className="form-label">Equipment Type *</label>
            <select
              value={formData.equipmentType}
              onChange={(e) => handleInputChange('equipmentType', e.target.value)}
              className="form-select"
              required
            >
              <option value="Agricultural Drone">Agricultural Drone</option>
              <option value="Spraying Drone">Spraying Drone</option>
              <option value="Surveillance Drone">Surveillance Drone</option>
              <option value="Mapping Drone">Mapping Drone</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Brand *</label>
            <select
              value={formData.brand}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              className="form-select"
              required
            >
              <option value="DJI">DJI</option>
              <option value="XAG">XAG</option>
              <option value="Yamaha">Yamaha</option>
              <option value="Parrot">Parrot</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Model Name *</label>
            <input
              type="text"
              value={formData.modelName}
              onChange={(e) => handleInputChange('modelName', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Year of Make *</label>
            <input
              type="number"
              value={formData.yearOfMake}
              onChange={(e) => handleInputChange('yearOfMake', e.target.value)}
              className="form-input"
              required
              disabled={saving}
              min="2010"
              max="2025"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Serial Number</label>
            <input
              type="text"
              value={formData.serialNo}
              onChange={(e) => handleInputChange('serialNo', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Drone Specifications Section */}
        <div className="form-section">
          <h2 className="section-title">Drone Specifications</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payload (Liters) *</label>
              <input
                type="number"
                value={formData.payload}
                onChange={(e) => handleInputChange('payload', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Spray Width (m) *</label>
              <input
                type="number"
                value={formData.sprayWidth}
                onChange={(e) => handleInputChange('sprayWidth', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tank Size (Liters) *</label>
              <input
                type="number"
                value={formData.tankSize}
                onChange={(e) => handleInputChange('tankSize', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Flight Time (min) *</label>
              <input
                type="number"
                value={formData.flightTime}
                onChange={(e) => handleInputChange('flightTime', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Battery Swap Time (min)</label>
            <input
              type="number"
              value={formData.batterySwapTime}
              onChange={(e) => handleInputChange('batterySwapTime', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">UIN (Unmanned Aircraft System Identification Number)</label>
            <input
              type="text"
              value={formData.uin}
              onChange={(e) => handleInputChange('uin', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">UAOP (Unmanned Aircraft Operator Permit)</label>
            <input
              type="text"
              value={formData.uaop}
              onChange={(e) => handleInputChange('uaop', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Pilot License</label>
            <input
              type="text"
              value={formData.pilotLicense}
              onChange={(e) => handleInputChange('pilotLicense', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Safety Features Section */}
        <div className="form-section">
          <h2 className="section-title">Safety Features</h2>
          
          <div className="checkbox-grid">
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.returnToHome}
                onChange={() => handleInputChange('returnToHome', !formData.returnToHome)}
                disabled={saving}
              />
              <span className="checkbox-label">Return To Home (RTH)</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.terrainFollowing}
                onChange={() => handleInputChange('terrainFollowing', !formData.terrainFollowing)}
                disabled={saving}
              />
              <span className="checkbox-label">Terrain Following</span>
            </label>
          </div>
        </div>

        {/* Rental & Pricing Section */}
        <div className="form-section">
          <h2 className="section-title">Rental & Pricing</h2>
          
          <div className="form-group">
            <label className="form-label">Primary Rental Type *</label>
            <select
              value={formData.rentalType}
              onChange={(e) => handleInputChange('rentalType', e.target.value)}
              className="form-select"
              required
            >
              <option value="per_acre">Per Acre</option>
              <option value="per_hour">Per Hour</option>
              <option value="per_day">Per Day</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price per Acre (₹)</label>
              <input
                type="number"
                value={formData.pricingPerAcre}
                onChange={(e) => handleInputChange('pricingPerAcre', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price per Hour (₹)</label>
              <input
                type="number"
                value={formData.pricingPerHour}
                onChange={(e) => handleInputChange('pricingPerHour', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Price per Day (₹)</label>
            <input
              type="number"
              value={formData.pricingPerDay}
              onChange={(e) => handleInputChange('pricingPerDay', e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        {/* Capacity & Coverage Section */}
        <div className="form-section">
          <h2 className="section-title">Capacity & Coverage</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Max Acres per Day *</label>
              <input
                type="number"
                value={formData.maxAcresPerDay}
                onChange={(e) => handleInputChange('maxAcresPerDay', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min Booking Acres *</label>
              <input
                type="number"
                value={formData.minBookingAcres}
                onChange={(e) => handleInputChange('minBookingAcres', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Service Radius (km) *</label>
            <input
              type="number"
              value={formData.serviceRadius}
              onChange={(e) => handleInputChange('serviceRadius', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Operational Months</label>
            <input
              type="text"
              value={Array.isArray(formData.operationalMonths) ? formData.operationalMonths.join(', ') : formData.operationalMonths}
              onChange={(e) => handleInputChange('operationalMonths', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
              className="form-input"
              disabled={saving}
              placeholder="march, april, may"
            />
            <small className="form-help">Separate months with commas</small>
          </div>

          <div className="form-group">
            <label className="form-label">Lead Time (Days) *</label>
            <input
              type="number"
              value={formData.leadTime}
              onChange={(e) => handleInputChange('leadTime', e.target.value)}
              className="form-input"
              required
              disabled={saving}
              min="1"
            />
          </div>
        </div>

        {/* Location & Logistics Section */}
        <div className="form-section">
          <h2 className="section-title">Location & Logistics</h2>
          
          <div className="form-group">
            <label className="form-label">Base Location *</label>
            <input
              type="text"
              value={formData.baseLocation}
              onChange={(e) => handleInputChange('baseLocation', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Coordinates (Lat, Lng)</label>
            <input
              type="text"
              value={formData.coordinates}
              onChange={(e) => handleInputChange('coordinates', e.target.value)}
              className="form-input"
              placeholder="18.5204, 73.8567"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Service Areas</label>
            <input
              type="text"
              value={formData.serviceAreas}
              onChange={(e) => handleInputChange('serviceAreas', e.target.value)}
              className="form-input"
              placeholder="pune, mumbai, nashik"
              disabled={saving}
            />
            <small className="form-help">Separate multiple areas with commas</small>
          </div>

          <div className="toggle-group">
            <span className="toggle-label">Has Charging Facility</span>
            <div 
              className={`toggle-switch ${formData.hasChargingFacility ? 'active' : ''}`}
              onClick={() => handleInputChange('hasChargingFacility', !formData.hasChargingFacility)}
            >
              <div className="toggle-thumb"></div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Number of Spare Batteries</label>
            <input
              type="number"
              value={formData.numberOfSpareBatteries}
              onChange={(e) => handleInputChange('numberOfSpareBatteries', e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Drone Warehouse / Field Charging Details</label>
            <textarea
              value={formData.droneWarehouse}
              onChange={(e) => handleInputChange('droneWarehouse', e.target.value)}
              className="form-textarea"
              rows="3"
              placeholder="Describe your storage and charging facilities..."
            />
          </div>
        </div>

        {/* Availability & SLA Section */}
        <div className="form-section">
          <h2 className="section-title">Availability & SLA</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Available From *</label>
              <input
                type="date"
                value={formData.availabilityStart}
                onChange={(e) => handleInputChange('availabilityStart', e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available Until *</label>
              <input
                type="date"
                value={formData.availabilityEnd}
                onChange={(e) => handleInputChange('availabilityEnd', e.target.value)}
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">SLA Reach Time (Hours) *</label>
            <input
              type="number"
              value={formData.slaReachTime}
              onChange={(e) => handleInputChange('slaReachTime', e.target.value)}
              className="form-input"
              required
              disabled={saving}
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Working Hours Batches</label>
            <input
              type="text"
              value={formData.workingHoursBatches}
              onChange={(e) => handleInputChange('workingHoursBatches', e.target.value)}
              className="form-input"
              disabled={saving}
              placeholder="06:00-10:00, 14:00-18:00"
            />
            <small className="form-help">Format: HH:MM-HH:MM (comma-separated for multiple batches)</small>
          </div>
          
          <div className="form-group">
            <label className="form-label">Availability Status</label>
            <input
              type="text"
              value={formData.availabilityStatus}
              onChange={(e) => handleInputChange('availabilityStatus', e.target.value)}
              className="form-input"
              disabled={saving}
              placeholder="Available, Busy, Maintenance"
            />
          </div>
        </div>

        {/* Payouts Section */}
        <div className="form-section">
          <h2 className="section-title">Payouts</h2>
          
          <div className="form-group">
            <label className="form-label">UPI ID *</label>
            <input
              type="text"
              value={formData.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bank IFSC Code *</label>
            <input
              type="text"
              value={formData.bankIfscCode}
              onChange={(e) => handleInputChange('bankIfscCode', e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bank Name</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className="form-input"
              placeholder="Will auto-fetch from IFSC"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Account Holder Name *</label>
            <input
              type="text"
              value={formData.accountHolderName}
              onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
              className="form-input"
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bank Account Number *</label>
            <input
              type="text"
              value={formData.bankAccountNumber}
              onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
              className="form-input"
              required
              disabled={saving}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="save-btn-large" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
      
      <Snackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
        duration={snackbar.type === 'success' ? 3000 : 5000}
      />
    </div>
  )
}

export default VendorEditProfilePage