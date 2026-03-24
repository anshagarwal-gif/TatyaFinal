import { useState, useEffect } from 'react'
import { FiShoppingBag, FiUsers, FiUser, FiDollarSign } from 'react-icons/fi'
import { getAdminDashboardStats } from '../services/api'
import '../styles/AdminDashboardPage.css'

function AdminDashboardPage() {
  const [stats, setStats] = useState({
    orders: 0,
    activeVendors: 0,
    totalVendors: 0,
    activeUsers: 0,
    totalUsers: 0,
    financeToday: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminDashboardStats()
        if (response.success && response.data) {
          setStats({
            orders: response.data.totalOrders || 0,
            activeVendors: response.data.activeVendors || 0,
            totalVendors: response.data.totalVendors || 0,
            activeUsers: response.data.activeUsers || 0,
            totalUsers: response.data.totalUsers || 0,
            financeToday: response.data.financeToday || 0
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Orders',
      value: stats.orders,
      icon: FiShoppingBag,
      color: 'text-green-600'
    },
    {
      title: 'Total Vendors',
      value: stats.totalVendors,
      icon: FiUsers,
      color: 'text-green-600'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FiUser,
      color: 'text-green-600'
    },
    {
      title: 'Finance (Today)',
      value: `₹${stats.financeToday.toLocaleString('en-IN')}`,
      icon: FiDollarSign,
      color: 'text-green-600'
    }
  ]

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <h1 className="admin-dashboard-title">Dashboard Overview</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-container">
      <h1 className="admin-dashboard-title">Dashboard Overview</h1>

      {/* Stat Cards Grid */}
      <div className="admin-stats-grid">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="admin-stat-card"
            >
              <div className="admin-stat-header">
                <div className="admin-stat-icon-wrapper">
                  <Icon className="admin-stat-icon" />
                </div>
              </div>
              <h3 className="admin-stat-label">
                {card.title}
              </h3>
              <p className="admin-stat-value">
                {card.value}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminDashboardPage
