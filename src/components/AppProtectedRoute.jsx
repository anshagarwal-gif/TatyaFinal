import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { isAppUserAuthenticated } from '../utils/authSession'

/**
 * Requires customer OTP session or vendor session before any app route.
 * Login (/), vendor self-registration, and admin routes stay outside this wrapper.
 */
function AppProtectedRoute() {
  const location = useLocation()

  if (!isAppUserAuthenticated()) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default AppProtectedRoute
