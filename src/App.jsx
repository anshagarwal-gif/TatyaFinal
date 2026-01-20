import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import BenefitsPage from './pages/BenefitsPage'
import LocationPage from './pages/LocationPage'
import BookingPage from './pages/BookingPage'
import CheckoutPage from './pages/CheckoutPage'
import VendorOnboardingPage from './pages/VendorOnboardingPage'
import VendorOnboardingFormPage from './pages/VendorOnboardingFormPage'
import VendorPayoutsPage from './pages/VendorPayoutsPage'
import VendorAvailabilityPage from './pages/VendorAvailabilityPage'
import VendorLocationPage from './pages/VendorLocationPage'
import VendorCapacityPage from './pages/VendorCapacityPage'
import VendorDroneDetailsPage from './pages/VendorDroneDetailsPage'
import VendorEquipmentPage from './pages/VendorEquipmentPage'
import VendorDashboardPage from './pages/VendorDashboardPage'
import VendorEditProfilePage from './pages/VendorEditProfilePage'
import MyFarmsPage from './pages/MyFarmsPage'
import ClusterManagementPage from './pages/ClusterManagementPage'
import NearbyClustersPage from './pages/NearbyClustersPage'
// Admin Panel Imports
import AdminLoginPage from './pages/AdminLoginPage'
import AdminLayout from './components/AdminLayout'
import AdminDashboardPage from './pages/AdminDashboardPage'
import VendorManagementPage from './pages/VendorManagementPage'
import ApproveRejectVendorPage from './pages/ApproveRejectVendorPage'
import UsersManagementPage from './pages/UsersManagementPage'
import FinancePage from './pages/FinancePage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/benefits" element={<BenefitsPage />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/my-farms" element={<MyFarmsPage />} />
        <Route path="/cluster-management" element={<ClusterManagementPage />} />
        <Route path="/nearby-clusters" element={<NearbyClustersPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/vendor-onboarding" element={<VendorOnboardingPage />} />
        <Route path="/vendor-onboarding-form" element={<VendorOnboardingFormPage />} />
        <Route path="/vendor-equipment" element={<VendorEquipmentPage />} />
        <Route path="/vendor-availability" element={<VendorAvailabilityPage />} />
        <Route path="/vendor-location" element={<VendorLocationPage />} />
        <Route path="/vendor-capacity" element={<VendorCapacityPage />} />
        <Route path="/vendor-drone-details" element={<VendorDroneDetailsPage />} />    
         <Route path="/vendor-payouts" element={<VendorPayoutsPage />} />
        <Route path="/vendor-dashboard" element={<VendorDashboardPage />} />
        <Route path="/vendor-edit-profile" element={<VendorEditProfilePage />} />
        {/* Admin Panel Routes */}
        <Route path="/adminlogin/101" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="vendors" element={<VendorManagementPage />} />
          <Route path="approve-vendors" element={<ApproveRejectVendorPage />} />
          <Route path="users" element={<UsersManagementPage />} />
          <Route path="finance" element={<FinancePage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App


