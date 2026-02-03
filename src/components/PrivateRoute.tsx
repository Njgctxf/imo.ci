import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    // You might want a spinner here or just return null
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return session ? <Outlet /> : <Navigate to="/auth" />;
}
