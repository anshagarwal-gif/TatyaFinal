import { useState } from 'react'
import { FiDownload, FiEye, FiTrash2 } from 'react-icons/fi'
import '../styles/UsersManagementPage.css'

function UsersManagementPage() {
  // Mock users data
  const [users, setUsers] = useState([
    {
      id: 1,
      phone: '+91 9876543210',
      otp: '1234',
      location: '123, Main Street, Sector 5, Noida, Uttar Pradesh - 201301',
      status: 'Used',
      createdDate: '2024-01-15',
      createdTime: '10:30 AM'
    },
    {
      id: 2,
      phone: '+91 9876543211',
      otp: '5678',
      location: '456, Park Avenue, Andheri West, Mumbai, Maharashtra - 400053',
      status: 'Used',
      createdDate: '2024-01-16',
      createdTime: '11:45 AM'
    },
    {
      id: 3,
      phone: '+91 9876543212',
      otp: '9012',
      location: '789, MG Road, Koramangala, Bangalore, Karnataka - 560095',
      status: 'Pending',
      createdDate: '2024-01-17',
      createdTime: '02:15 PM'
    },
    {
      id: 4,
      phone: '+91 9876543213',
      otp: '3456',
      location: '321, Civil Lines, Near Railway Station, Pune, Maharashtra - 411001',
      status: 'Used',
      createdDate: '2024-01-18',
      createdTime: '09:20 AM'
    },
    {
      id: 5,
      phone: '+91 9876543214',
      otp: '7890',
      location: '654, Ring Road, Adarsh Nagar, Jaipur, Rajasthan - 302004',
      status: 'Pending',
      createdDate: '2024-01-19',
      createdTime: '04:50 PM'
    }
  ])

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id))
  }

  const handleDownloadExcel = () => {
    // Frontend-only: Just show alert
    alert('Excel download functionality (mock) - All Users Details would be exported')
  }

  return (
    <div className="users-management-container">
      <div className="users-management-header">
        <h1 className="users-management-title">Users</h1>
        <button
          onClick={handleDownloadExcel}
          className="users-download-button"
        >
          <FiDownload className="users-download-icon" />
          Download Excel (All Users Details)
        </button>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Phone</th>
                <th>OTP</th>
                <th>Location</th>
                <th>Status</th>
                <th>Created Date & Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td className="font-medium">
                    {user.phone}
                  </td>
                  <td className="text-gray-700">{user.otp}</td>
                  <td className="text-gray-700 max-w-xs">
                    {user.location}
                  </td>
                  <td>
                    <span
                      className={`users-badge ${
                        user.status === 'Used' ? 'used' : 'pending'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="text-gray-700">
                    {user.createdDate} {user.createdTime}
                  </td>
                  <td>
                    <div className="users-actions">
                      <button className="users-action-button blue">
                        <FiEye className="users-action-icon" />
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="users-action-button red"
                      >
                        <FiTrash2 className="users-action-icon" />
                        Delete
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

export default UsersManagementPage
