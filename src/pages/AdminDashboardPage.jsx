import { FiShoppingBag, FiUsers, FiUser, FiDollarSign } from 'react-icons/fi'
import '../styles/AdminDashboardPage.css'

function AdminDashboardPage() {
  // Mock data
  const stats = {
    orders: 1247,
    activeVendors: 89,
    activeUsers: 3421,
    financeToday: 125000
  }

  const statCards = [
    {
      title: 'Orders',
      value: stats.orders,
      icon: FiShoppingBag,
      color: 'text-green-600'
    },
    {
      title: 'Active Vendors',
      value: stats.activeVendors,
      icon: FiUsers,
      color: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
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
