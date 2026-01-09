import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorDashboardPage.css'
import '../styles/VendorCoverage.css'

function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState('map') // 'map', 'details', 'profile', 'coverage'
  const navigate = useNavigate()

  return (
    <div className="vendor-dashboard">
      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === 'map' && <MapView />}
        {activeTab === 'details' && <DetailsView />}
        {activeTab === 'profile' && <ProfileView navigate={navigate} />}
        {activeTab === 'coverage' && <CoverageView />}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </button>
        <button
          className={`nav-item ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        </button>
        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </button>
        <button
          className={`nav-item ${activeTab === 'coverage' ? 'active' : ''}`}
          onClick={() => setActiveTab('coverage')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </button>
      </div>

    </div>
  )
}

// Map View Component
function MapView() {
  return (
    <div className="map-view">
      <div className="map-header">
        <div className="hamburger-menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </div>
        <h2>Dashboard</h2>
      </div>

      <div className="greeting-section">
        <div className="greeting-text">
          <h3>Hi, Sarang</h3>
          <p className="greeting-subtitle">Welcome back to your dashboard</p>
        </div>
        <div className="earnings-card">
          <div className="earnings-header">
            <span className="earnings-label">Total Earnings</span>
            <span className="earnings-period">This Month</span>
          </div>
          <div className="total-earning">
            <span className="currency">₹</span>
            <span className="amount">186,889.56</span>
          </div>
          <div className="earnings-change">
            <span className="change-indicator positive">+12.5%</span>
            <span className="change-text">from last month</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">4.8</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H7v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9h-2M9 11V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">127</div>
            <div className="stat-label">Jobs Completed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">98%</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-btn primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z" />
          </svg>
          <span className="text">Add Equipment</span>
        </button>
        <button className="action-btn secondary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
          </svg>
          <span className="text">Boost Income</span>
        </button>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">
            <h4>Weekly Performance</h4>
            <span className="chart-subtitle">Acres covered this week</span>
          </div>
          <div className="chart-period">
            <select className="period-select">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <div className="bar-chart">
          <div className="chart-bars">
            <div className="bar" style={{ height: '40%' }} data-value="12"></div>
            <div className="bar" style={{ height: '60%' }} data-value="18"></div>
            <div className="bar" style={{ height: '80%' }} data-value="24"></div>
            <div className="bar active" style={{ height: '100%' }} data-value="30"></div>
            <div className="bar" style={{ height: '90%' }} data-value="27"></div>
            <div className="bar" style={{ height: '70%' }} data-value="21"></div>
            <div className="bar" style={{ height: '85%' }} data-value="25"></div>
          </div>
          <div className="chart-labels">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
        </div>
        <div className="chart-summary">
          <div className="summary-item">
            <span className="summary-label">Total Acres</span>
            <span className="summary-value">157</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Avg per Day</span>
            <span className="summary-value">22.4</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h4 className="section-title">Quick Actions</h4>
        <div className="action-grid">
          <button className="quick-action-btn">
            <div className="quick-action-icon warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
              </svg>
            </div>
            <div className="quick-action-content">
              <div className="quick-action-title">Report Issue</div>
              <div className="quick-action-subtitle">Equipment problems</div>
            </div>
          </button>

          <button className="quick-action-btn">
            <div className="quick-action-icon info">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
              </svg>
            </div>
            <div className="quick-action-content">
              <div className="quick-action-title">Find Support</div>
              <div className="quick-action-subtitle">Contact administrator</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// Details View Component
function DetailsView() {
  return (
    <div className="details-view">
      <div className="details-header">
        <div className="hamburger-menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </div>
        <h2>Schedule & Bookings</h2>
      </div>

      <div className="date-selector">
        <div className="date-header">
          <h3>March 2024</h3>
          <button className="date-nav-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </button>
        </div>
        <div className="date-tabs">
          <button className="date-tab">Today</button>
          <button className="date-tab active">Tomorrow</button>
          <button className="date-tab">This Week</button>
        </div>
      </div>

      <div className="calendar-section">
        <div className="calendar-grid">
          <div className="calendar-days">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          <div className="calendar-dates">
            <span>12</span>
            <span>13</span>
            <span>14</span>
            <span className="selected">15</span>
            <span>16</span>
            <span>17</span>
            <span>18</span>
          </div>
        </div>
      </div>

      <div className="daily-summary">
        <div className="summary-card">
          <div className="summary-header">
            <h4>Today's Summary</h4>
            <span className="date-text">March 15, 2024</span>
          </div>
          <div className="progress-section">
            <div className="progress-info">
              <span className="progress-label">Daily Progress</span>
              <span className="progress-text">60% Complete</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-number">15</span>
              <span className="stat-label">Acres Planned</span>
            </div>
            <div className="summary-stat">
              <span className="stat-number">9</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="summary-stat">
              <span className="stat-number">6</span>
              <span className="stat-label">Remaining</span>
            </div>
          </div>
        </div>
      </div>

      <div className="schedule-section">
        <div className="schedule-header">
          <h4>Today's Schedule</h4>
          <button className="add-booking-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add Booking
          </button>
        </div>

        <div className="schedule-timeline">
          <div className="schedule-item morning">
            <div className="time-badge">
              <div className="time-info">
                <span className="period">Morning Session</span>
                <span className="time">08:00 - 10:00</span>
              </div>
              <span className="duration">2h</span>
            </div>
            <div className="bookings">
              <div className="booking-item">
                <div className="booking-info">
                  <div className="booking-main">
                    <span className="acres">3 Acres</span>
                    <span className="crop-type">Wheat Field</span>
                  </div>
                  <div className="booking-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>Pune, Maharashtra</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn-small">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="booking-item">
                <div className="booking-info">
                  <div className="booking-main">
                    <span className="acres">2 Acres</span>
                    <span className="crop-type">Cotton Field</span>
                  </div>
                  <div className="booking-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>Nashik, Maharashtra</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn-small">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="booking-item">
                <div className="booking-info">
                  <div className="booking-main">
                    <span className="acres">3 Acres</span>
                    <span className="crop-type">Rice Field</span>
                  </div>
                  <div className="booking-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>Satara, Maharashtra</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn-small">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="schedule-item evening">
            <div className="time-badge">
              <div className="time-info">
                <span className="period">Evening Session</span>
                <span className="time">18:00 - 19:00</span>
              </div>
              <span className="duration">1h</span>
            </div>
            <div className="bookings">
              <div className="booking-item">
                <div className="booking-info">
                  <div className="booking-main">
                    <span className="acres">7 Acres</span>
                    <span className="crop-type">Sugarcane Field</span>
                  </div>
                  <div className="booking-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span>Kolhapur, Maharashtra</span>
                  </div>
                </div>
                <div className="booking-actions">
                  <button className="action-btn-small">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Profile View Component
function ProfileView({ navigate }) {
  return (
    <div className="profile-view">
      <div className="profile-content">

        <div className="profile-header">
          <h2>Sarang Sathe</h2>
          <div className="status-indicator active">
            <span>●</span>
            Active Vendor
          </div>
        </div>

        <div className="profile-info-grid">
          {/* Personal Information */}
          <div className="profile-card personal-info-card">
            <div className="profile-section-header">
              <div className="section-title">Personal Information</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Email Address</div>
              <div className="section-value">sarang.sathe@email.com</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Phone Number</div>
              <div className="section-value">+91 98765 43210</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Social Media</div>
              <div className="section-value">Instagram | Facebook | LinkedIn</div>
            </div>

            <div className="profile-actions">
              <button className="edit-profile-btn" onClick={() => navigate('/vendor-edit-profile')}>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Equipment Details */}
          <div className="profile-card equipment-card">
            <div className="profile-section-header">
              <div className="section-title">Equipment Details</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Equipment Type</div>
              <div className="section-value">Agricultural Drone</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Brand & Model</div>
              <div className="section-value">DJI Agras T30</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Payload Capacity</div>
              <div className="value-highlight">
                <div className="section-value">30 Liters</div>
              </div>
            </div>

            <div className="profile-actions">
              <button className="edit-equipment-btn" onClick={() => navigate('/vendor-edit-profile')}>
                Edit Equipment
              </button>
            </div>
          </div>

          {/* Rental & Pricing */}
          <div className="profile-card pricing-card">
            <div className="profile-section-header">
              <div className="section-title">Rental & Pricing</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Primary Rental Type</div>
              <div className="section-value">Per Acre</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Rate per Acre</div>
              <div className="value-highlight">
                <div className="section-value">₹500</div>
              </div>
            </div>

            <div className="profile-section">
              <div className="section-title">Rate per Hour</div>
              <div className="section-value">₹1,200</div>
            </div>
          </div>

          {/* Capacity & Coverage */}
          <div className="profile-card capacity-card">
            <div className="profile-section-header">
              <div className="section-title">Capacity & Coverage</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Max Acres per Day</div>
              <div className="value-highlight">
                <div className="section-value">15 Acres</div>
              </div>
            </div>

            <div className="profile-section">
              <div className="section-title">Service Radius</div>
              <div className="section-value">50 km</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Min Booking</div>
              <div className="section-value">2 Acres</div>
            </div>
          </div>

          {/* Location & Logistics */}
          <div className="profile-card location-card">
            <div className="profile-section-header">
              <div className="section-title">Location & Logistics</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Base Location</div>
              <div className="section-value">Pune, Maharashtra</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Service Areas</div>
              <div className="section-value">Pune, Mumbai, Nashik</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Charging Facility</div>
              <div className="section-value">
                <span className="status-indicator active">
                  <span>●</span>
                  Available
                </span>
              </div>
            </div>
          </div>

          {/* Availability & SLA */}
          <div className="profile-card availability-card">
            <div className="profile-section-header">
              <div className="section-title">Availability & SLA</div>
            </div>

            <div className="profile-section">
              <div className="section-title">SLA Reach Time</div>
              <div className="value-highlight">
                <div className="section-value">2 Hours</div>
              </div>
            </div>

            <div className="profile-section">
              <div className="section-title">Working Hours</div>
              <div className="section-value">06:00 AM - 06:00 PM</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Lead Time</div>
              <div className="section-value">2 Days</div>
            </div>
          </div>

          {/* Payouts */}
          <div className="profile-card payouts-card">
            <div className="profile-section-header">
              <div className="section-title">Payout Information</div>
            </div>

            <div className="profile-section">
              <div className="section-title">UPI ID</div>
              <div className="section-value">sarang@paytm</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Bank Account</div>
              <div className="section-value">HDFC Bank - XXXX1234</div>
            </div>

            <div className="profile-section">
              <div className="section-title">IFSC Code</div>
              <div className="section-value">HDFC0001234</div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="settings-btn">Go to Settings</button>
        </div>
      </div>
    </div>
  )
}


// Coverage View Component
function CoverageView() {
  const [file, setFile] = useState(null);
  const [params, setParams] = useState({
    alpha: 1.0,
    beta: 2.0,
    threshold: 0.0,
    minFarms: 1
  });
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMsg('');
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first.');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8080/api/coverage/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setUploadMsg(`Success: ${data.message} (${data.count} farms)`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/coverage/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Run failed');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coverage-view">
      <div className="coverage-header">
        <h2>Coverage Optimization</h2>
        <p className="subtitle">Optimize drone centers based on farm locations</p>
      </div>

      <div className="coverage-content">
        {/* Upload Section */}
        <div className="coverage-card">
          <h3 className="card-title">1. Upload Farm Data</h3>
          <div className="upload-container">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file-input-dark"
            />
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              className="action-btn primary"
            >
              {loading ? 'Uploading...' : 'Upload CSV'}
            </button>
          </div>
          {uploadMsg && <p className="success-msg">{uploadMsg}</p>}
        </div>

        {/* Configuration Section */}
        <div className="coverage-card">
          <h3 className="card-title">2. Configuration Parameters</h3>
          <div className="params-grid">
            <div className="param-group">
              <label>Alpha (New Farms)</label>
              <input
                type="number"
                step="0.1"
                value={params.alpha}
                onChange={(e) => setParams({ ...params, alpha: parseFloat(e.target.value) })}
                className="form-input-dark"
              />
            </div>
            <div className="param-group">
              <label>Beta (Overlap)</label>
              <input
                type="number"
                step="0.1"
                value={params.beta}
                onChange={(e) => setParams({ ...params, beta: parseFloat(e.target.value) })}
                className="form-input-dark"
              />
            </div>
            <div className="param-group">
              <label>Threshold</label>
              <input
                type="number"
                step="0.1"
                value={params.threshold}
                onChange={(e) => setParams({ ...params, threshold: parseFloat(e.target.value) })}
                className="form-input-dark"
              />
            </div>
            <div className="param-group">
              <label>Min Farms/Center</label>
              <input
                type="number"
                step="1"
                value={params.minFarms}
                onChange={(e) => setParams({ ...params, minFarms: parseInt(e.target.value) })}
                className="form-input-dark"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleRun}
          disabled={loading}
          className="action-btn primary full-width"
        >
          {loading ? 'Running Optimization...' : 'Run Optimization'}
        </button>

        {error && <div className="error-msg">{error}</div>}

        {/* Results Section */}
        {result && (
          <div className="results-section">
            <h3 className="results-title">Optimization Results</h3>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-label">Centers Kept</div>
                  <div className="stat-value text-green">{result.keptCount}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-label">Total Covered</div>
                  <div className="stat-value text-blue">{result.coveredCount}</div>
                </div>
              </div>
            </div>

            <div className="data-lists">
              <div className="data-column">
                <h4>Selected Centers</h4>
                <div className="scroll-list">
                  {result.keptCenters.map((id, idx) => (
                    <div key={idx} className="list-item">{idx + 1}. {id}</div>
                  ))}
                </div>
              </div>
              <div className="data-column">
                <h4>Covered Farms</h4>
                <div className="scroll-list">
                  {result.coveredFarms.map((id, idx) => (
                    <div key={idx} className="list-item">{id}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorDashboardPage