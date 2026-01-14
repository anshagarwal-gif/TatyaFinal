import { FiDollarSign, FiShoppingBag } from 'react-icons/fi'
import '../styles/FinancePage.css'

function FinancePage() {
  // Mock finance data
  const financeData = {
    totalOrders: 1247,
    totalCollection: 1875000
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
