import { useState, useEffect } from 'react'
import { FiDownload, FiEye, FiXCircle, FiCheckCircle } from 'react-icons/fi'
import { getAdminVendors, deactivateVendor, reactivateVendor, exportVendorsAndDrones } from '../services/api'
import '../styles/VendorManagementPage.css'

function VendorManagementPage() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await getAdminVendors()
        if (response.success && response.data) {
          setVendors(response.data)
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch vendors')
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this vendor?')) {
      return
    }

    try {
      const response = await deactivateVendor(id)
      if (response.success) {
        // Refresh vendors list
        const vendorsResponse = await getAdminVendors()
        if (vendorsResponse.success && vendorsResponse.data) {
          setVendors(vendorsResponse.data)
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to deactivate vendor')
    }
  }

  const handleReactivate = async (id) => {
    if (!window.confirm('Are you sure you want to reactivate this vendor?')) {
      return
    }

    try {
      const response = await reactivateVendor(id)
      if (response.success) {
        // Refresh vendors list
        const vendorsResponse = await getAdminVendors()
        if (vendorsResponse.success && vendorsResponse.data) {
          setVendors(vendorsResponse.data)
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to reactivate vendor')
    }
  }

  const handleDownloadExcel = async () => {
    try {
      await exportVendorsAndDrones()
    } catch (err) {
      alert(err.message || 'Failed to export Excel file')
    }
  }

  if (loading) {
    return (
      <div className="vendor-management-container">
        <h1 className="vendor-management-title">Vendors Management</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="vendor-management-container">
      <div className="vendor-management-header">
        <h1 className="vendor-management-title">Vendors Management</h1>
        <button
          onClick={handleDownloadExcel}
          className="vendor-download-button"
        >
          <FiDownload className="vendor-download-icon" />
          Download Excel (All Vendors & Drones)
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
      )}

      {/* Vendors Table */}
      <div className="vendor-table-container">
        <div className="vendor-table-wrapper">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Business</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.vendorId}>
                    <td>{vendor.vendorId}</td>
                    <td className="font-medium">
                      {vendor.name}
                    </td>
                    <td className="text-gray-700">
                      {vendor.business}
                    </td>
                    <td className="text-gray-700">
                      {vendor.email}
                    </td>
                    <td className="text-gray-700">
                      {vendor.contact}
                    </td>
                    <td>
                      <span
                        className={`vendor-badge ${
                          vendor.status === 'ACTIVE' ? 'active' : 'inactive'
                        }`}
                      >
                        {vendor.status}
                      </span>
                    </td>
                    <td>
                      <span className={`vendor-badge ${
                        vendor.approval === 'VERIFIED' ? 'approved' : 
                        vendor.approval === 'REJECTED' ? 'rejected' : 'pending'
                      }`}>
                        {vendor.approval}
                      </span>
                    </td>
                    <td>
                      <div className="vendor-actions">
                        <button className="vendor-action-button blue">
                          <FiEye className="vendor-action-icon" />
                          Details
                        </button>
                        {vendor.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleDeactivate(vendor.vendorId)}
                            className="vendor-action-button red"
                          >
                            <FiXCircle className="vendor-action-icon" />
                            Deactivate
                          </button>
                        )}
                        {vendor.status === 'INACTIVE' && (
                          <button
                            onClick={() => handleReactivate(vendor.vendorId)}
                            className="vendor-action-button green"
                          >
                            <FiCheckCircle className="vendor-action-icon" />
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VendorManagementPage
