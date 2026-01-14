import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorFormsPage.css'
import { FiArrowLeft } from 'react-icons/fi'
import { saveOnboardingStep6, getOnboardingData } from '../services/api'

function VendorPayoutsPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    accountHolderName: '',
    accountNumber: '',
    upiId: '',
    bankIfscCode: '',
    bankName: ''
  })
  const [errors, setErrors] = useState({})
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
        if (response.success && response.data) {
          const bankAccount = response.data.bankAccount
          if (bankAccount) {
            setFormData(prev => ({
              ...prev,
              accountHolderName: bankAccount.accountHolderName || '',
              accountNumber: bankAccount.accountNumber || '',
              upiId: bankAccount.upiId || '',
              bankIfscCode: bankAccount.bankIfscCode || '',
              bankName: bankAccount.bankName || ''
            }))
          }
        }
      } catch (error) {
        console.error('Error loading saved data:', error)
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

  const validateForm = () => {
    const newErrors = {}
    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Please enter account holder name'
    }
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Please enter account number'
    }
    if (!formData.bankIfscCode.trim()) {
      newErrors.bankIfscCode = 'Please enter IFSC code'
    }
    // Bank account is required, UPI is optional
    // Validation already checks accountNumber above
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBack = () => {
    navigate('/vendor-availability')
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    const vendorId = localStorage.getItem('vendorId')
    if (!vendorId) {
      setErrorMessage('Please complete registration first')
      return
    }

    setIsSaving(true)
    setErrorMessage('')

    try {
      const step6Data = {
        vendorId: parseInt(vendorId),
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        bankIfscCode: formData.bankIfscCode,
        bankName: formData.bankName || null,
        upiId: formData.upiId || null
      }

      await saveOnboardingStep6(step6Data)
      alert('Account created successfully! Your account is pending approval.')
      navigate('/vendor-dashboard')
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
          <span className="progress-text">Step 6 of 6</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="form-content">
        <h1 className="form-title">Payouts</h1>

        <div className="form-fields">
          <div className="section-title">
            <h3>Bank Account Details</h3>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Account Holder Name *"
              value={formData.accountHolderName}
              onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
              className="form-input"
            />
            {errors.accountHolderName && <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>{errors.accountHolderName}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Account Number *"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
              className="form-input"
              maxLength="18"
            />
            {errors.accountNumber && <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>{errors.accountNumber}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Bank IFSC Code *"
              value={formData.bankIfscCode}
              onChange={(e) => handleInputChange('bankIfscCode', e.target.value.toUpperCase())}
              className="form-input"
              maxLength="11"
              style={{ textTransform: 'uppercase' }}
            />
            {errors.bankIfscCode && <span style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '4px', display: 'block' }}>{errors.bankIfscCode}</span>}
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

          <div className="section-title" style={{ marginTop: '24px' }}>
            <h3>UPI Details (Optional)</h3>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="UPI ID (e.g., yourname@paytm)"
              value={formData.upiId}
              onChange={(e) => handleInputChange('upiId', e.target.value)}
              className="form-input"
            />
          </div>

        </div>

        <div className="info-text">
          <p>Tatya will send your payouts securely every 7 days.</p>
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
          {isSaving ? 'Submitting...' : 'Submit'}
        </button>

      </div>
    </div>
  )
}

export default VendorPayoutsPage