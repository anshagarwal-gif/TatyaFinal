import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  FiLayout,
  FiUsers,
  FiCheckCircle,
  FiUser,
  FiDollarSign,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi'
import '../styles/AdminLayout.css'

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true) // Open by default on desktop

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: FiLayout },
    { path: '/admin/vendors', label: 'Vendors Management', icon: FiUsers },
    { path: '/admin/approve-vendors', label: 'Approve / Reject Vendors', icon: FiCheckCircle },
    { path: '/admin/users', label: 'Users', icon: FiUser },
    { path: '/admin/finance', label: 'Finance', icon: FiDollarSign },
  ]

  const handleLogout = () => {
    navigate('/adminlogin/101')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="admin-layout-container">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`admin-sidebar ${
          sidebarOpen ? '' : 'mobile-hidden'
        }`}
      >
        <div className="admin-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {sidebarOpen && (
              <h2 className="admin-sidebar-title">Admin Panel</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="admin-sidebar-toggle"
            >
              {sidebarOpen ? (
                <FiX className="admin-sidebar-toggle-icon" />
              ) : (
                <FiMenu className="admin-sidebar-toggle-icon" />
              )}
            </button>
          </div>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false)
                  }
                }}
                className={`admin-nav-item ${active ? 'active' : ''}`}
              >
                <Icon className="admin-nav-icon" />
                {sidebarOpen && (
                  <span className="admin-nav-label">{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="admin-sidebar-logout">
          <button
            onClick={handleLogout}
            className="admin-logout-button"
          >
            <FiLogOut className="admin-logout-icon" />
            {sidebarOpen && <span className="admin-logout-text">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        {/* Mobile Menu Button */}
        <div className="admin-mobile-menu-button">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FiMenu className="admin-mobile-menu-icon" />
          </button>
        </div>
        <div className="admin-content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
