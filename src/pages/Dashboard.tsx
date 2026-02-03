import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { AlertCircle, User, Home, Search, Heart, Plus, Eye, TrendingUp } from 'lucide-react';
import type { Profile } from '../types/database';

type Stats = {
  totalProperties: number;
  activeProperties: number;
  favoritesReceived: number;
  myFavorites: number;
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    activeProperties: 0,
    favoritesReceived: 0,
    myFavorites: 0,
  });

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const loadStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Get total properties count
      const { count: totalCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get active properties count
      const { count: activeCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_available', true);

      // Get favorites received (how many times user's properties have been favorited)
      const { data: userProperties } = await supabase
        .from('properties')
        .select('id')
        .eq('user_id', user.id);

      let favoritesReceivedCount = 0;
      if (userProperties && userProperties.length > 0) {
        const propertyIds = userProperties.map(p => p.id);
        const { count: favCount } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .in('property_id', propertyIds);
        
        favoritesReceivedCount = favCount || 0;
      }

      // Get my favorites count
      const { count: myFavCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setStats({
        totalProperties: totalCount || 0,
        activeProperties: activeCount || 0,
        favoritesReceived: favoritesReceivedCount,
        myFavorites: myFavCount || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProfile();
    loadStats();
  }, [loadProfile, loadStats]);

  const isProfileComplete = profile?.full_name && profile?.phone && profile?.user_type;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Mon Espace
            </h1>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Se déconnecter
            </button>
          </div>

          <div className="space-y-6">
            {/* Welcome message */}
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Bienvenue {profile?.full_name || 'sur ImmoCI'} !
              </h2>
              <p className="text-blue-700">
                Vous êtes connecté en tant que <span className="font-mono bg-blue-100 px-2 py-0.5 rounded">{user?.email}</span>
              </p>
            </div>

            {/* Profile completion alert */}
            {!loading && !isProfileComplete && (
              <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 flex items-start">
                <AlertCircle className="h-5 w-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-orange-900 mb-1">
                    Complétez votre profil
                  </h3>
                  <p className="text-sm text-orange-700 mb-3">
                    Pour publier des annonces ou contacter des propriétaires, veuillez compléter vos informations.
                  </p>
                  <Link
                    to="/profile"
                    className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Compléter mon profil
                  </Link>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.totalProperties}
                </div>
                <p className="text-sm text-gray-600">Annonces publiées</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Actives</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.activeProperties}
                </div>
                <p className="text-sm text-gray-600">Annonces disponibles</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Popularité</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.favoritesReceived}
                </div>
                <p className="text-sm text-gray-600">Favoris reçus</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Heart className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Sauvegardés</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stats.myFavorites}
                </div>
                <p className="text-sm text-gray-600">Mes favoris</p>
              </div>
            </div>

            {/* Section title */}
            <div className="mb-6">
              <h2 className="text-2xl font-display font-bold text-gray-900">
                Actions rapides
              </h2>
            </div>

            {/* Action cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                to="/profile"
                className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow group"
              >
                <User className="h-8 w-8 text-brand-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Mon Profil</h3>
                <p className="text-gray-500">Gérer mes informations personnelles</p>
              </Link>
              
              <Link
                to="/my-properties"
                className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow group"
              >
                <Home className="h-8 w-8 text-brand-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Mes Annonces</h3>
                <p className="text-gray-500">Gérer mes biens immobiliers</p>
              </Link>
              
              <Link
                to="/favorites"
                className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow group"
              >
                <Heart className="h-8 w-8 text-brand-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Mes Favoris</h3>
                <p className="text-gray-500">Annonces sauvegardées</p>
              </Link>
              
              <Link
                to="/search"
                className="p-6 border border-gray-100 rounded-xl hover:shadow-md transition-shadow group"
              >
                <Search className="h-8 w-8 text-brand-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">Recherche</h3>
                <p className="text-gray-500">Trouver un logement</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
