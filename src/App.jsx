import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
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
      </Routes>
    </Router>
  )
}

export default App


