import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PrivateRoute() {
  const location = useLocation()
  const { isAdminUser, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/admin/login" />
  }

  if (!isAdminUser) {
    return <Navigate replace to="/admin/login" />
  }

  return <Outlet />
}

export default PrivateRoute
