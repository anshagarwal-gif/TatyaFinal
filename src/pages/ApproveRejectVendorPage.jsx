import { useState, useEffect } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'
import { getPendingVendors, approveOrRejectVendor } from '../services/api'
import '../styles/ApproveRejectVendorPage.css'

function ApproveRejectVendorPage() {
  const [pendingVendors, setPendingVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPendingVendors = async () => {
      try {
        const response = await getPendingVendors()
        if (response.success && response.data) {
          setPendingVendors(response.data)
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch vendors')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingVendors()
  }, [])

  const refreshVendors = async () => {
    try {
      const response = await getPendingVendors()
      if (response.success && response.data) {
        setPendingVendors(response.data)
      }
    } catch (err) {
      console.error('Error refreshing vendors:', err)
    }
  }

  const handleApprove = async (vendorId) => {
    try {
      const response = await approveOrRejectVendor({
        vendorId,
        action: 'VERIFIED'
      })
      if (response.success) {
        // Refresh the list instead of removing
        await refreshVendors()
      }
    } catch (err) {
      alert(err.message || 'Failed to approve vendor')
    }
  }

  const handleReject = async (vendorId) => {
    if (!window.confirm('Are you sure you want to reject this vendor?')) {
      return
    }

    try {
      const response = await approveOrRejectVendor({
        vendorId,
        action: 'REJECTED'
      })
      if (response.success) {
        // Refresh the list instead of removing
        await refreshVendors()
      }
    } catch (err) {
      alert(err.message || 'Failed to reject vendor')
    }
  }

  if (loading) {
    return (
      <div className="approve-vendor-container">
        <h1 className="approve-vendor-title">Vendor Approval</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="approve-vendor-container">
      <h1 className="approve-vendor-title">Vendor Approval</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
      )}

      {pendingVendors.length === 0 ? (
        <div className="approve-vendor-empty">
          <p className="approve-vendor-empty-text">No vendors found.</p>
        </div>
      ) : (
        <div className="approve-vendor-table-container">
          <div className="approve-vendor-table-wrapper">
            <table className="approve-vendor-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Business</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingVendors.map((vendor) => {
                  const isPending = vendor.approval === 'PENDING'
                  const isVerified = vendor.approval === 'VERIFIED'
                  const isRejected = vendor.approval === 'REJECTED'

                  return (
                    <tr key={vendor.vendorId}>
                      <td className="font-medium">
                        {vendor.name}
                      </td>
                      <td className="text-gray-700">
                        {vendor.business}
                      </td>
                      <td className="text-gray-700">
                        {vendor.email}
                      </td>
                      <td>
                        <span className={`approve-vendor-badge ${
                          isVerified ? 'approved' : 
                          isRejected ? 'rejected' : 
                          'pending'
                        }`}>
                          {vendor.approval || 'PENDING'}
                        </span>
                      </td>
                      <td>
                        <div className="approve-vendor-actions">
                          {isPending ? (
                            <>
                              <button
                                onClick={() => handleApprove(vendor.vendorId)}
                                className="approve-vendor-button green"
                              >
                                <FiCheck className="approve-vendor-icon" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(vendor.vendorId)}
                                className="approve-vendor-button red"
                              >
                                <FiX className="approve-vendor-icon" />
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className="approve-vendor-status-text">
                              {isVerified ? '✅ Approved' : '❌ Rejected'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApproveRejectVendorPage
