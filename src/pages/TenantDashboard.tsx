import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Heart, 
  MapPin, 
  Calendar,
  CreditCard,
  Bell,
  LogOut,
  Home,
  DollarSign,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import type { Property, Booking } from '../types/database';

export default function TenantDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [stats, setStats] = useState({
    activeBookings: 0,
    totalSpent: 0,
    favoriteCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          properties (*)
        `)
        .eq('tenant_id', user?.id)
        .order('created_at', { ascending: false });

      // Load favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select(`
          *,
          properties (*)
        `)
        .eq('user_id', user?.id);

      setBookings(bookingsData || []);
      setFavorites(favoritesData?.map(f => f.properties as any) || []);

      // Calculate stats
      const activeBookings = (bookingsData || []).filter(
        b => b.status === 'confirmed' || b.status === 'pending'
      ).length;

      const totalSpent = (bookingsData || [])
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.total_amount, 0);

      setStats({
        activeBookings,
        totalSpent,
        favoriteCount: favoritesData?.length || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayBooking = async (bookingId: string, amount: number) => {
    // Simulation de paiement
    if (!confirm(`Confirmer le paiement de ${new Intl.NumberFormat('fr-FR').format(amount)} FCFA ?`)) {
      return;
    }

    try {
      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingId,
          tenant_id: user?.id,
          amount,
          payment_method: 'card',
          status: 'completed',
          transaction_id: `TXN-${Date.now()}`,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Update booking status
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;

      // Create notification for owner
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        await supabase.from('notifications').insert({
          user_id: booking.owner_id,
          type: 'payment',
          title: 'Nouveau paiement reçu',
          message: `Vous avez reçu un paiement de ${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`,
          read: false,
          data: { booking_id: bookingId, payment_id: payment.id },
        });
      }

      alert('Paiement effectué avec succès !');
      loadDashboardData();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Erreur lors du paiement');
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
                <h1 className="text-xl font-bold text-gray-900">Tableau de Bord Locataire</h1>
                <p className="text-sm text-gray-500">Gérez vos réservations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-6 h-6" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: 'Réservations actives',
              value: stats.activeBookings,
              icon: Calendar,
              color: 'from-blue-500 to-blue-600',
            },
            {
              label: 'Total dépensé',
              value: `${new Intl.NumberFormat('fr-FR').format(stats.totalSpent)} FCFA`,
              icon: DollarSign,
              color: 'from-green-500 to-green-600',
            },
            {
              label: 'Favoris',
              value: stats.favoriteCount,
              icon: Heart,
              color: 'from-red-500 to-red-600',
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/properties"
            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Rechercher</p>
              <p className="text-sm text-gray-600">Trouver un bien</p>
            </div>
          </Link>

          <Link
            to="/favorites"
            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Favoris</p>
              <p className="text-sm text-gray-600">Mes biens sauvegardés</p>
            </div>
          </Link>

          <Link
            to="/properties"
            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Explorer</p>
              <p className="text-sm text-gray-600">Toutes les propriétés</p>
            </div>
          </Link>
        </div>

        {/* My Bookings */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Mes Réservations</h2>
          
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Aucune réservation pour le moment</p>
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
              >
                <Search className="w-5 h-5" />
                Rechercher un bien
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Réservation #{booking.id.slice(0, 8)}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Du {new Date(booking.start_date).toLocaleDateString('fr-FR')}
                          {booking.end_date && ` au ${new Date(booking.end_date).toLocaleDateString('fr-FR')}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{(booking as any).properties?.location || 'N/A'}</span>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {new Intl.NumberFormat('fr-FR').format(booking.total_amount)} FCFA
                      </p>
                      <p className="text-sm text-gray-600">Montant total</p>
                    </div>
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handlePayBooking(booking.id, booking.total_amount)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                      >
                        <CreditCard className="w-5 h-5" />
                        Payer maintenant
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Payé</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Mes Favoris</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.slice(0, 3).map((property) => (
                <Link
                  key={property.id}
                  to={`/property/${property.id}`}
                  className="group"
                >
                  <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-all">
                    <img
                      src={property.images?.[0] || '/placeholder.png'}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{property.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                      <p className="text-xl font-bold text-blue-600">
                        {new Intl.NumberFormat('fr-FR').format(property.price)} FCFA
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
