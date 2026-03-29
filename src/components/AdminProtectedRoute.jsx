import { Navigate, Outlet, useLocation } from 'react-router-dom'

/**
 * Only allows /admin/* after successful login at /adminlogin/101 (adminToken in localStorage).
 */
function AdminProtectedRoute() {
  const location = useLocation()
  const token = localStorage.getItem('adminToken')

  if (!token) {
    return (
      <Navigate
        to="/adminlogin/101"
        replace
        state={{ from: location.pathname }}
      />
    )
  }

  return <Outlet />
}

export default AdminProtectedRoute
