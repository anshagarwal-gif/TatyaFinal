import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorKycPendingPage.css'
import { getVendorById } from '../services/api'

function VendorKycPendingPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('PENDING')
  const [isChecking, setIsChecking] = useState(false)
  const [message, setMessage] = useState('')

  const vendorId = localStorage.getItem('vendorId')

  useEffect(() => {
    if (!vendorId) {
      navigate('/', { replace: true })
      return
    }

    const cachedVendor = localStorage.getItem('vendor')
    if (cachedVendor) {
      try {
        const v = JSON.parse(cachedVendor)
        if (v?.verifiedStatus) setStatus(v.verifiedStatus)
      } catch {
        // ignore
      }
    }
  }, [vendorId, navigate])

  const handleCheckStatus = async () => {
    if (!vendorId) return
    setIsChecking(true)
    setMessage('')
    try {
      const response = await getVendorById(parseInt(vendorId))
      const vendor = response?.data
      if (vendor) {
        localStorage.setItem('vendor', JSON.stringify(vendor))
        setStatus(vendor.verifiedStatus || 'PENDING')
        if (vendor.verifiedStatus === 'VERIFIED') {
          setMessage('Approved! Please login with email & password to access dashboard.')
          navigate('/', { replace: true })
          return
        }
        if (vendor.verifiedStatus === 'REJECTED') {
          setMessage('Your KYC was rejected. Please contact support.')
          return
        }
        setMessage('Still under processing. Please check again later.')
      }
    } catch (e) {
      setMessage(e?.message || 'Failed to check status')
    } finally {
      setIsChecking(false)
    }
  }

  const title =
    status === 'REJECTED'
      ? 'KYC Rejected'
      : 'KYC Under Processing'

  const subtitle =
    status === 'REJECTED'
      ? 'Your vendor profile was rejected by admin.'
      : 'Your vendor profile is under review by admin. You will get an email once approved.'

  return (
    <div className="vendor-kyc-page">
      <div className="vendor-kyc-card">
        <h1 className="vendor-kyc-title">{title}</h1>
        <p className="vendor-kyc-subtitle">{subtitle}</p>

        <div className="vendor-kyc-actions">
          {status !== 'REJECTED' && (
            <button
              type="button"
              className="vendor-kyc-btn primary"
              onClick={handleCheckStatus}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Check Status'}
            </button>
          )}
          <button
            type="button"
            className="vendor-kyc-btn secondary"
            onClick={() => navigate('/', { replace: true })}
          >
            Back to Login
          </button>
        </div>

        {message && <div className="vendor-kyc-message">{message}</div>}
      </div>
    </div>
  )
}

export default VendorKycPendingPage

