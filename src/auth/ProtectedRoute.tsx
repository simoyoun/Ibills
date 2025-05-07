import { Navigate, Route } from '@tanstack/react-router'
import { useAuth } from './AuthProvider'

export function ProtectedRoute(props: any) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <Route {...props} />
}
