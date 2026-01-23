import { useState, useEffect } from 'react'
import { FiDollarSign, FiShoppingBag } from 'react-icons/fi'
import { getFinanceStats } from '../services/api'
import '../styles/FinancePage.css'

function FinancePage() {
  const [financeData, setFinanceData] = useState({
    totalOrders: 0,
    totalCollection: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFinanceStats = async () => {
      try {
        const response = await getFinanceStats()
        if (response.success && response.data) {
          setFinanceData({
            totalOrders: response.data.totalOrders || 0,
            totalCollection: response.data.totalCollection || 0
          })
        }
      } catch (error) {
        console.error('Error fetching finance stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFinanceStats()
  }, [])

  if (loading) {
    return (
      <div className="finance-container">
        <h1 className="finance-title">Finance</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="finance-container">
      <h1 className="finance-title">Finance</h1>

      {/* Finance Summary Cards */}
      <div className="finance-grid">
        {/* Total Orders Card */}
        <div className="finance-card">
          <div className="finance-card-header">
            <div className="finance-icon-wrapper">
              <FiShoppingBag className="finance-icon" />
            </div>
          </div>
          <h3 className="finance-label">
            Total Orders
          </h3>
          <p className="finance-value">
            {financeData.totalOrders.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Total Collection Card */}
        <div className="finance-card">
          <div className="finance-card-header">
            <div className="finance-icon-wrapper">
              <FiDollarSign className="finance-icon" />
            </div>
          </div>
          <h3 className="finance-label">
            Total Collection
          </h3>
          <p className="finance-value">
            ₹{financeData.totalCollection.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default FinancePage
