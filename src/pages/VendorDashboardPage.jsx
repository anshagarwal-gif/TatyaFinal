import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/VendorDashboardPage.css'
import { getVendorById, getVendorProfile, getVendorDashboardStats, getVendorDashboardChart, getVendorDashboardBookings, getVendorDashboardDaySummary } from '../services/api'
import { clearVendorSession } from '../utils/authSession'

function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState('map') // 'map', 'details', 'profile'
  const navigate = useNavigate()
  const [accessChecked, setAccessChecked] = useState(false)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      const vendorId = localStorage.getItem('vendorId')
      if (!vendorId) {
        navigate('/', { replace: true })
        return
      }

      try {
        const response = await getVendorById(parseInt(vendorId))
        const vendor = response?.data
        if (vendor) {
          localStorage.setItem('vendor', JSON.stringify(vendor))
          if (vendor.verifiedStatus === 'VERIFIED') {
            setHasAccess(true)
          } else {
            navigate('/vendor-kyc-pending', { replace: true })
            return
          }
        } else {
          navigate('/', { replace: true })
          return
        }
      } catch (e) {
        navigate('/vendor-kyc-pending', { replace: true })
        return
      } finally {
        setAccessChecked(true)
      }
    }

    checkAccess()
  }, [navigate])

  const handleLogout = () => {
    clearVendorSession()
    navigate('/', { replace: true })
  }

  if (!accessChecked) {
    return (
      <div className="vendor-dashboard">
        <div className="dashboard-content">
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return (
    <div className="vendor-dashboard">
      <div className="vendor-dashboard-appbar">
        <button type="button" className="vendor-dashboard-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === 'map' && <MapViewWithData />}
        {activeTab === 'details' && <DetailsView />}
        {activeTab === 'profile' && <ProfileView navigate={navigate} />}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button 
          className={`nav-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
        <button 
          className={`nav-item ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </button>
        <button 
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </button>
      </div>

    </div>
  )
}

// Map View Component with Data
function MapViewWithData() {
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [chart, setChart] = useState(null)
  const [chartPeriod, setChartPeriod] = useState('week')
  const [loading, setLoading] = useState(true)
  const vendorId = localStorage.getItem('vendorId')

  useEffect(() => {
    const fetchProfile = async () => {
      if (!vendorId) { setLoading(false); return }
      try {
        const response = await getVendorProfile(parseInt(vendorId))
        setProfile(response.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [vendorId])

  useEffect(() => {
    if (!vendorId) return
    const fetchStats = async () => {
      try {
        const res = await getVendorDashboardStats(parseInt(vendorId))
        setStats(res.data)
      } catch (e) {
        console.error('Error fetching dashboard stats:', e)
      }
    }
    fetchStats()
  }, [vendorId])

  useEffect(() => {
    if (!vendorId) return
    const fetchChart = async () => {
      try {
        const res = await getVendorDashboardChart(parseInt(vendorId), chartPeriod)
        setChart(res.data)
      } catch (e) {
        console.error('Error fetching chart:', e)
      }
    }
    fetchChart()
  }, [vendorId, chartPeriod])

  if (loading) {
    return (
      <div className="map-view">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </div>
    )
  }

  const vendorName = profile?.fullName?.split(' ')[0] || 'Vendor'
  const formatCurrency = (n) => {
    if (n == null) return '0'
    const num = typeof n === 'number' ? n : parseFloat(n)
    return isNaN(num) ? '0' : num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  const earningsChange = stats?.earningsChangePercent != null
  const changePositive = earningsChange && stats.earningsChangePercent >= 0
  const maxChartVal = chart?.values?.length ? Math.max(...chart.values.map((v) => Number(v)), 1) : 1

  return (
    <div className="map-view">
      <div className="map-header">
        <div className="hamburger-menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </div>
        <h2>Dashboard</h2>
      </div>

      <div className="greeting-section">
        <div className="greeting-text">
          <h3>Hi, {vendorName}</h3>
          <p className="greeting-subtitle">Welcome back to your dashboard</p>
        </div>
        <div className="earnings-card">
          <div className="earnings-header">
            <span className="earnings-label">Total Earnings</span>
            <span className="earnings-period">This Month</span>
          </div>
          <div className="total-earning">
            <span className="currency">₹</span>
            <span className="amount">{formatCurrency(stats?.totalEarningsThisMonth)}</span>
          </div>
          <div className="earnings-change">
            {earningsChange ? (
              <>
                <span className={`change-indicator ${changePositive ? 'positive' : 'negative'}`}>
                  {changePositive ? '+' : ''}{stats.earningsChangePercent.toFixed(1)}%
                </span>
                <span className="change-text">from last month</span>
              </>
            ) : (
              <span className="change-text">No previous month data</span>
            )}
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.rating != null ? Number(stats.rating).toFixed(1) : '—'}</div>
            <div className="stat-label">Rating</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H7v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9h-2M9 11V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.jobsCompleted ?? '—'}</div>
            <div className="stat-label">Jobs Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats?.successRate != null ? `${Number(stats.successRate).toFixed(0)}%` : '—'}</div>
            <div className="stat-label">Success Rate</div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-btn primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/>
          </svg>
          <span className="text">Add Equipment</span>
        </button>
        <button className="action-btn secondary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
          </svg>
          <span className="text">Boost Income</span>
        </button>
      </div>

      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">
            <h4>{chartPeriod === 'year' ? 'Yearly' : chartPeriod === 'month' ? 'Monthly' : 'Weekly'} Performance</h4>
            <span className="chart-subtitle">Acres covered</span>
          </div>
          <div className="chart-period">
            <select className="period-select" value={chartPeriod} onChange={(e) => setChartPeriod(e.target.value)}>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
        <div className="bar-chart">
          <div className="chart-bars">
            {chart?.labels?.length ? chart.values.map((val, i) => {
              const n = Number(val)
              const pct = maxChartVal > 0 ? Math.min(100, (n / maxChartVal) * 100) : 0
              return (
                <div key={i} className="bar" style={{ height: `${pct}%` }} data-value={n} />
              )
            }) : (
              <div className="bar" style={{ height: '0%' }} data-value="0" />
            )}
          </div>
          <div className="chart-labels">
            {chart?.labels?.length ? chart.labels.map((l, i) => <span key={i}>{l}</span>) : (
              ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => <span key={i}>{d}</span>)
            )}
          </div>
        </div>
        <div className="chart-summary">
          <div className="summary-item">
            <span className="summary-label">Total Acres</span>
            <span className="summary-value">{chart?.totalAcres != null ? Number(chart.totalAcres).toFixed(0) : '0'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Avg per Day</span>
            <span className="summary-value">{chart?.avgPerDay != null ? Number(chart.avgPerDay).toFixed(1) : '0'}</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h4 className="section-title">Quick Actions</h4>
        <div className="action-grid">
          <button className="quick-action-btn">
            <div className="quick-action-icon warning">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
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
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>
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
  const vendorId = localStorage.getItem('vendorId')
  const today = new Date().toISOString().slice(0, 10)
  const [selectedDate, setSelectedDate] = useState(today)
  const [summary, setSummary] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!vendorId) return
    setLoading(true)
    const load = async () => {
      try {
        const [sumRes, bookRes] = await Promise.all([
          getVendorDashboardDaySummary(parseInt(vendorId), selectedDate),
          getVendorDashboardBookings(parseInt(vendorId), selectedDate)
        ])
        setSummary(sumRes.data)
        setBookings(bookRes.data || [])
      } catch (e) {
        console.error('Error loading schedule:', e)
        setSummary(null)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [vendorId, selectedDate])

  const dateDisplay = selectedDate ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const progress = summary?.progressPercent != null ? Math.min(100, Math.round(summary.progressPercent)) : 0

  // Group bookings by time slot for display
  const getHour = (b) => {
    if (!b.startTime) return 0
    if (typeof b.startTime === 'string') return parseInt(b.startTime.slice(0, 2), 10) || 0
    return b.startTime.hour ?? 0
  }
  const morning = bookings.filter((b) => getHour(b) < 12)
  const evening = bookings.filter((b) => getHour(b) >= 12)

  const formatTime = (t) => {
    if (!t) return '—'
    if (typeof t === 'string') return t.slice(0, 5)
    if (typeof t === 'object' && t.hour != null) return `${String(t.hour).padStart(2, '0')}:${String(t.minute ?? 0).padStart(2, '0')}`
    return '—'
  }

  const renderBookingItem = (b) => (
    <div key={b.bookingId} className="booking-item">
      <div className="booking-info">
        <div className="booking-main">
          <span className="acres">{Number(b.farmAreaAcres || 0).toFixed(1)} Acres</span>
          <span className="crop-type">{b.serviceType || 'Booking'}</span>
        </div>
        <div className="booking-location">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span>{b.locationDisplay || '—'}</span>
        </div>
      </div>
      <div className="booking-actions">
        <button className="action-btn-small" aria-label="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
      </div>
    </div>
  )

  return (
    <div className="details-view">
      <div className="details-header">
        <div className="hamburger-menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </div>
        <h2>Schedule & Bookings</h2>
      </div>

      <div className="date-selector">
        <div className="date-header">
          <h3>{dateDisplay || 'Select date'}</h3>
          <input
            type="date"
            className="date-nav-btn"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: '1rem', cursor: 'pointer' }}
          />
        </div>
        <div className="date-tabs">
          <button type="button" className={`date-tab ${selectedDate === today ? 'active' : ''}`} onClick={() => setSelectedDate(today)}>Today</button>
          <button type="button" className="date-tab" onClick={() => setSelectedDate(new Date(Date.now() + 86400000).toISOString().slice(0, 10))}>Tomorrow</button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      ) : (
        <>
          <div className="daily-summary">
            <div className="summary-card">
              <div className="summary-header">
                <h4>Summary</h4>
                <span className="date-text">{dateDisplay}</span>
              </div>
              <div className="progress-section">
                <div className="progress-info">
                  <span className="progress-label">Daily Progress</span>
                  <span className="progress-text">{progress}% Complete</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-number">{summary?.acresPlanned != null ? Number(summary.acresPlanned).toFixed(0) : '0'}</span>
                  <span className="stat-label">Acres Planned</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-number">{summary?.acresCompleted != null ? Number(summary.acresCompleted).toFixed(0) : '0'}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-number">{summary?.acresRemaining != null ? Number(summary.acresRemaining).toFixed(0) : '0'}</span>
                  <span className="stat-label">Remaining</span>
                </div>
              </div>
            </div>
          </div>

          <div className="schedule-section">
            <div className="schedule-header">
              <h4>Schedule</h4>
              <button type="button" className="add-booking-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Add Booking
              </button>
            </div>

            <div className="schedule-timeline">
              {morning.length > 0 && (
                <div className="schedule-item morning">
                  <div className="time-badge">
                    <div className="time-info">
                      <span className="period">Morning</span>
                      <span className="time">
                        {morning.length ? `${formatTime(morning[0].startTime)} - ${formatTime(morning[morning.length - 1].endTime)}` : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="bookings">{morning.map(renderBookingItem)}</div>
                </div>
              )}
              {evening.length > 0 && (
                <div className="schedule-item evening">
                  <div className="time-badge">
                    <div className="time-info">
                      <span className="period">Afternoon / Evening</span>
                      <span className="time">
                        {evening.length ? `${formatTime(evening[0].startTime)} - ${formatTime(evening[evening.length - 1].endTime)}` : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="bookings">{evening.map(renderBookingItem)}</div>
                </div>
              )}
              {bookings.length === 0 && !loading && (
                <p style={{ padding: '1rem', color: '#666' }}>No bookings for this date.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Profile View Component
function ProfileView({ navigate }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const vendorId = localStorage.getItem('vendorId')
        if (!vendorId) {
          setLoading(false)
          return
        }
        const response = await getVendorProfile(parseInt(vendorId))
        setProfile(response.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="profile-view">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-view">
        <div style={{ padding: '2rem', textAlign: 'center' }}>No profile data found</div>
      </div>
    )
  }

  const drone = profile.drone || {}
  const bankAccount = profile.bankAccount || {}

  return (
    <div className="profile-view">
      <div className="profile-content">
        
        <div className="profile-header">
          <h2>{profile.fullName || 'Vendor'}</h2>
          <div className={`status-indicator ${profile.verifiedStatus === 'VERIFIED' ? 'active' : ''}`}>
            <span>●</span>
            {profile.verifiedStatus === 'VERIFIED' ? 'Active Vendor' : 'Pending Verification'}
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
              <div className="section-value">{profile.email || 'Not provided'}</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Phone Number</div>
              <div className="section-value">{profile.phone || 'Not provided'}</div>
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
              <div className="section-value">{drone.equipmentType || 'Not provided'}</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Brand & Model</div>
              <div className="section-value">{drone.brand && drone.modelName ? `${drone.brand} ${drone.modelName}` : 'Not provided'}</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Tank Size</div>
              <div className="value-highlight">
                <div className="section-value">{drone.tankSizeLiters ? `${drone.tankSizeLiters} Liters` : 'Not provided'}</div>
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
                <div className="section-value">{drone.maxAcresPerDay ? `${drone.maxAcresPerDay} Acres` : 'Not provided'}</div>
              </div>
            </div>

            <div className="profile-section">
              <div className="section-title">Service Radius</div>
              <div className="section-value">{drone.serviceRadiusKm ? `${drone.serviceRadiusKm} km` : 'Not provided'}</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Min Booking</div>
              <div className="section-value">{drone.minBookingAcres ? `${drone.minBookingAcres} Acres` : 'Not provided'}</div>
            </div>
          </div>

          {/* Location & Logistics */}
          <div className="profile-card location-card">
            <div className="profile-section-header">
              <div className="section-title">Location & Logistics</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Base Location</div>
              <div className="section-value">{drone.baseLocation || 'Not provided'}</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Service Areas</div>
              <div className="section-value">{drone.serviceAreas || 'Not provided'}</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Charging Facility</div>
              <div className="section-value">
                <span className={`status-indicator ${drone.hasChargingFacility ? 'active' : ''}`}>
                  <span>●</span>
                  {drone.hasChargingFacility ? 'Available' : 'Not Available'}
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
                <div className="section-value">{drone.slaReachTimeHours ? `${drone.slaReachTimeHours} Hours` : 'Not provided'}</div>
              </div>
            </div>

            <div className="profile-section">
              <div className="section-title">Working Hours</div>
              <div className="section-value">{drone.workingHoursBatches || 'Not provided'}</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Lead Time</div>
              <div className="section-value">{drone.leadTimeDays ? `${drone.leadTimeDays} Days` : 'Not provided'}</div>
            </div>
          </div>

          {/* Payouts */}
          <div className="profile-card payouts-card">
            <div className="profile-section-header">
              <div className="section-title">Payout Information</div>
            </div>

            <div className="profile-section">
              <div className="section-title">UPI ID</div>
              <div className="section-value">{bankAccount.upiId || 'Not provided'}</div>
            </div>

            <div className="profile-section">
              <div className="section-title">Bank Account</div>
              <div className="section-value">{bankAccount.bankName && bankAccount.accountNumber ? `${bankAccount.bankName} - ${bankAccount.accountNumber.slice(-4)}` : 'Not provided'}</div>
            </div>

            <div className="profile-section">
              <div className="section-title">IFSC Code</div>
              <div className="section-value">{bankAccount.bankIfscCode || 'Not provided'}</div>
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

export default VendorDashboardPage