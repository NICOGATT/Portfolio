import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute() {
  const location = useLocation()
  const { isAdminUser, isAuthenticated } = useAuth()

  if (!isAuthenticated || !isAdminUser) {
    return <Navigate replace state={{ from: location }} to="/admin/login" />
  }

  return <Outlet />
}

export default ProtectedRoute
