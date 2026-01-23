import { useState, useEffect } from 'react'
import { FiDownload, FiEye, FiTrash2 } from 'react-icons/fi'
import { getAdminUsers, deleteUser, exportUsers } from '../services/api'
import '../styles/UsersManagementPage.css'

function UsersManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAdminUsers()
        if (response.success && response.data) {
          setUsers(response.data)
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      const response = await deleteUser(id)
      if (response.success) {
        // Refresh users list
        const usersResponse = await getAdminUsers()
        if (usersResponse.success && usersResponse.data) {
          setUsers(usersResponse.data)
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to delete user')
    }
  }

  const handleDownloadExcel = async () => {
    try {
      await exportUsers()
    } catch (err) {
      alert(err.message || 'Failed to export Excel file')
    }
  }

  if (loading) {
    return (
      <div className="users-management-container">
        <h1 className="users-management-title">Users</h1>
        <p>Loading...</p>
      </div>
    )
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

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
      )}

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
              {users.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="font-medium">
                      {user.phone}
                    </td>
                    <td className="text-gray-700">{user.otp || 'N/A'}</td>
                    <td className="text-gray-700 max-w-xs">
                      {user.location || 'N/A'}
                    </td>
                    <td>
                      <span
                        className={`users-badge ${
                          user.status === 'ACTIVE' ? 'used' : 'pending'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="text-gray-700">
                      {user.createdDate ? new Date(user.createdDate).toLocaleDateString() : 'N/A'} {user.createdTime || ''}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UsersManagementPage
