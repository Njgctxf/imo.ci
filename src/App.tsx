import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Auth from './pages/Auth';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import TenantDashboard from './pages/TenantDashboard';
import ProfilePage from './pages/Profile';
import NewProperty from './pages/NewProperty';
import EditProperty from './pages/EditProperty';
import MyProperties from './pages/MyProperties';
import Favorites from './pages/Favorites';
import SearchProperties from './pages/SearchProperties';
import PropertyDetail from './pages/PropertyDetail';
import PropertiesPage from './pages/PropertiesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivateRoute from './components/PrivateRoute';

// Wrapper to redirect if already logged in
function AuthWrapper() {
  const { session, loading } = useAuth();
  
  // Wait for auth to load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }
  
  if (session) return <Navigate to="/" replace />;
  return <Auth />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthWrapper />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/search" element={<SearchProperties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/owner-dashboard" element={<OwnerDashboard />} />
            <Route path="/tenant-dashboard" element={<TenantDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/new-property" element={<NewProperty />} />
            <Route path="/edit-property/:id" element={<EditProperty />} />
            <Route path="/my-properties" element={<MyProperties />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}


export default App
