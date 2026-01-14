import { useState } from 'react'
import { FiDownload, FiEye, FiXCircle } from 'react-icons/fi'
import '../styles/VendorManagementPage.css'

function VendorManagementPage() {
  // Mock vendor data
  const [vendors, setVendors] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      business: 'AgriTech Solutions',
      email: 'rajesh@agritech.com',
      contact: '+91 9876543210',
      status: 'Active',
      approval: 'Approved'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      business: 'Green Fields Drone Services',
      email: 'priya@greenfields.com',
      contact: '+91 9876543211',
      status: 'Active',
      approval: 'Approved'
    },
    {
      id: 3,
      name: 'Amit Patel',
      business: 'SkyFarm Technologies',
      email: 'amit@skyfarm.com',
      contact: '+91 9876543212',
      status: 'Active',
      approval: 'Approved'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      business: 'CropCare Drones',
      email: 'sneha@cropcare.com',
      contact: '+91 9876543213',
      status: 'Active',
      approval: 'Approved'
    },
    {
      id: 5,
      name: 'Vikram Singh',
      business: 'FarmTech Innovations',
      email: 'vikram@farmtech.com',
      contact: '+91 9876543214',
      status: 'Active',
      approval: 'Approved'
    }
  ])

  const handleDeactivate = (id) => {
    setVendors(vendors.map(vendor =>
      vendor.id === id
        ? { ...vendor, status: 'Inactive' }
        : vendor
    ))
  }

  const handleDownloadExcel = () => {
    // Frontend-only: Just show alert
    alert('Excel download functionality (mock) - All Vendors & Drones data would be exported')
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
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.id}</td>
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
                        vendor.status === 'Active' ? 'active' : 'inactive'
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </td>
                  <td>
                    <span className="vendor-badge approved">
                      {vendor.approval}
                    </span>
                  </td>
                  <td>
                    <div className="vendor-actions">
                      <button className="vendor-action-button blue">
                        <FiEye className="vendor-action-icon" />
                        Details
                      </button>
                      <button
                        onClick={() => handleDeactivate(vendor.id)}
                        className="vendor-action-button red"
                      >
                        <FiXCircle className="vendor-action-icon" />
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VendorManagementPage
