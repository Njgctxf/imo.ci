import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Plus, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Bell,
  Calendar,
  Users,
  Settings,
  LogOut,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import type { Property, Booking, Notification as NotificationType } from '../types/database';

export default function OwnerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeListings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      // Load bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      // Load notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(5);

      setProperties(propertiesData || []);
      setBookings(bookingsData || []);
      setNotifications(notificationsData || []);

      // Calculate stats
      const totalRevenue = (bookingsData || [])
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.total_amount, 0);

      setStats({
        totalProperties: propertiesData?.length || 0,
        totalBookings: bookingsData?.length || 0,
        totalRevenue,
        activeListings: propertiesData?.filter(p => p.status === 'available').length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;
      
      loadDashboardData();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">I</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tableau de Bord Propriétaire</h1>
                <p className="text-sm text-gray-500">Gérez vos biens immobiliers</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Propriétés',
              value: stats.totalProperties,
              icon: Home,
              color: 'from-blue-500 to-blue-600',
            },
            {
              label: 'Réservations',
              value: stats.totalBookings,
              icon: Calendar,
              color: 'from-purple-500 to-purple-600',
            },
            {
              label: 'Revenus',
              value: `${new Intl.NumberFormat('fr-FR').format(stats.totalRevenue)} FCFA`,
              icon: DollarSign,
              color: 'from-green-500 to-green-600',
            },
            {
              label: 'Actifs',
              value: stats.activeListings,
              icon: TrendingUp,
              color: 'from-orange-500 to-orange-600',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="mb-8">
          <Link
            to="/new-property"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Ajouter une propriété
          </Link>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Mes Propriétés</h2>
          
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucune propriété pour le moment</p>
              <Link
                to="/new-property"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
                Ajouter votre première propriété
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center gap-6 p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all"
                >
                  <img
                    src={property.images[0] || '/placeholder.png'}
                    alt={property.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-3 py-1 rounded-full ${
                        property.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {property.status === 'available' ? 'Disponible' : 'Indisponible'}
                      </span>
                      <span className="text-gray-600">
                        {property.listing_type === 'sale' ? 'À vendre' : 'À louer'}
                      </span>
                      <span className="font-semibold text-blue-600">
                        {new Intl.NumberFormat('fr-FR').format(property.price)} FCFA
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Eye className="w-5 h-5" />
                    </button>
                    <Link
                      to={`/edit-property/${property.id}`}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Réservations Récentes</h2>
          
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">Aucune réservation pour le moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-gray-900">Réservation #{booking.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.start_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {new Intl.NumberFormat('fr-FR').format(booking.total_amount)} FCFA
                    </p>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
