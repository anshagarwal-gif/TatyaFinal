import { useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'
import '../styles/ApproveRejectVendorPage.css'

function ApproveRejectVendorPage() {
  // Mock pending vendors data
  const [pendingVendors, setPendingVendors] = useState([
    {
      id: 1,
      name: 'Anil Desai',
      business: 'Desai Drone Services',
      email: 'anil@desaidrones.com'
    },
    {
      id: 2,
      name: 'Meera Joshi',
      business: 'Joshi Agricultural Tech',
      email: 'meera@joshiagri.com'
    },
    {
      id: 3,
      name: 'Kiran Nair',
      business: 'Nair Farm Solutions',
      email: 'kiran@nairfarms.com'
    }
  ])

  const handleApprove = (id) => {
    setPendingVendors(pendingVendors.filter(vendor => vendor.id !== id))
  }

  const handleReject = (id) => {
    setPendingVendors(pendingVendors.filter(vendor => vendor.id !== id))
  }

  return (
    <div className="approve-vendor-container">
      <h1 className="approve-vendor-title">Pending Vendors</h1>

      {pendingVendors.length === 0 ? (
        <div className="approve-vendor-empty">
          <p className="approve-vendor-empty-text">No pending vendors found.</p>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingVendors.map((vendor) => (
                  <tr key={vendor.id}>
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
                      <div className="approve-vendor-actions">
                        <button
                          onClick={() => handleApprove(vendor.id)}
                          className="approve-vendor-button green"
                        >
                          <FiCheck className="approve-vendor-icon" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(vendor.id)}
                          className="approve-vendor-button red"
                        >
                          <FiX className="approve-vendor-icon" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApproveRejectVendorPage
