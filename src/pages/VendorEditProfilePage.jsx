import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorEditProfilePage.css'

function VendorEditProfilePage() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    // Personal Information
    vendorName: 'Sarang Sathe',
    emailAddress: '',
    phoneNumber: '+91 9876543210',
    socialMedia: {
      instagram: '',
      facebook: '',
      linkedin: ''
    },
    
    // Equipment Details
    equipmentType: 'Agricultural Drone',
    droneName: 'DJI Agras T30',
    droneModel: 'T30',
    brand: 'DJI',
    modelName: 'Agras T30',
    yearOfMake: '2023',
    serialNo: 'DJI123456789',
    
    // Drone Specifications
    payload: '30',
    sprayWidth: '9',
    tankSize: '30',
    flightTime: '18',
    batterySwapTime: '5',
    uin: 'UIN123456789',
    uaop: 'UAOP987654321',
    pilotLicense: 'DGCA-RPL-001',
    
    // Safety Features
    safetyFeatures: {
      returnToHome: true,
      terrainFollowing: true,
      obstacleAvoidance: false,
      gpsTracking: true
    },
    
    // Rental & Pricing
    rentalType: 'per_acre',
    pricingPerAcre: '500',
    pricingPerHour: '1200',
    pricingPerDay: '8000',
    
    // Capacity & Coverage
    maxAcresPerDay: '15',
    minBookingAcres: '2',
    serviceRadius: '50',
    operationalMonths: ['march', 'april', 'may', 'june', 'july', 'august'],
    leadTime: '2',
    
    // Location & Logistics
    baseLocation: 'Pune, Maharashtra',
    coordinates: '18.5204, 73.8567',
    serviceAreas: ['pune', 'mumbai', 'nashik'],
    hasChargingFacility: true,
    numberOfSpareBatteries: '4',
    droneWarehouse: 'Climate-controlled warehouse with 24/7 security and charging stations for 10 drones.',
    
    // Availability & SLA
    availabilityStart: '2024-03-01',
    availabilityEnd: '2024-08-31',
    slaReachTime: '2',
    workingHours: {
      start: '06:00',
      end: '18:00'
    },
    
    // Payouts
    upiId: 'sarang@paytm',
    bankIfscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    bankAccountNumber: 'XXXX-XXXX-1234'
  })

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

  const handleSave = () => {
    // Save logic here
    alert('Profile updated successfully!')
    navigate('/vendor-dashboard')
  }

  const handleCancel = () => {
    navigate('/vendor-dashboard')
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
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>

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
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instagram Handle</label>
            <input
              type="text"
              value={formData.socialMedia.instagram}
              onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
              className="form-input"
              placeholder="@username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Facebook Profile</label>
            <input
              type="text"
              value={formData.socialMedia.facebook}
              onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
              className="form-input"
              placeholder="facebook.com/username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">LinkedIn Profile</label>
            <input
              type="text"
              value={formData.socialMedia.linkedin}
              onChange={(e) => handleInputChange('socialMedia.linkedin', e.target.value)}
              className="form-input"
              placeholder="linkedin.com/in/username"
            />
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
            <select
              value={formData.yearOfMake}
              onChange={(e) => handleInputChange('yearOfMake', e.target.value)}
              className="form-select"
              required
            >
              {Array.from({length: 10}, (_, i) => 2024 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
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
                checked={formData.safetyFeatures.returnToHome}
                onChange={() => handleSafetyFeatureChange('returnToHome')}
              />
              <span className="checkbox-label">Return To Home (RTH)</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.safetyFeatures.terrainFollowing}
                onChange={() => handleSafetyFeatureChange('terrainFollowing')}
              />
              <span className="checkbox-label">Terrain Following</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.safetyFeatures.obstacleAvoidance}
                onChange={() => handleSafetyFeatureChange('obstacleAvoidance')}
              />
              <span className="checkbox-label">Obstacle Avoidance</span>
            </label>

            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.safetyFeatures.gpsTracking}
                onChange={() => handleSafetyFeatureChange('gpsTracking')}
              />
              <span className="checkbox-label">GPS Tracking</span>
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
            <select
              multiple
              value={formData.operationalMonths}
              onChange={(e) => handleArrayChange('operationalMonths', Array.from(e.target.selectedOptions, option => option.value).join(','))}
              className="form-select multi-select"
            >
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            </select>
            <small className="form-help">Hold Ctrl/Cmd to select multiple months</small>
          </div>

          <div className="form-group">
            <label className="form-label">Lead Time (Days) *</label>
            <select
              value={formData.leadTime}
              onChange={(e) => handleInputChange('leadTime', e.target.value)}
              className="form-select"
              required
            >
              <option value="1">1 Day</option>
              <option value="2">2 Days</option>
              <option value="3">3 Days</option>
              <option value="7">1 Week</option>
              <option value="14">2 Weeks</option>
            </select>
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
              value={formData.serviceAreas.join(', ')}
              onChange={(e) => handleArrayChange('serviceAreas', e.target.value)}
              className="form-input"
              placeholder="pune, mumbai, nashik"
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
            <select
              value={formData.slaReachTime}
              onChange={(e) => handleInputChange('slaReachTime', e.target.value)}
              className="form-select"
              required
            >
              <option value="1">1 Hour</option>
              <option value="2">2 Hours</option>
              <option value="4">4 Hours</option>
              <option value="8">8 Hours</option>
              <option value="24">24 Hours</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Working Hours Start</label>
              <input
                type="time"
                value={formData.workingHours.start}
                onChange={(e) => handleInputChange('workingHours.start', e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Working Hours End</label>
              <input
                type="time"
                value={formData.workingHours.end}
                onChange={(e) => handleInputChange('workingHours.end', e.target.value)}
                className="form-input"
              />
            </div>
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
            <label className="form-label">Bank Account Number</label>
            <input
              type="text"
              value={formData.bankAccountNumber}
              onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
              className="form-input"
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
    </div>
  )
}

export default VendorEditProfilePage