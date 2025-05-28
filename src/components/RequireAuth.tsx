import { Navigate, useLocation } from 'react-router-dom'

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token')
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default RequireAuth
