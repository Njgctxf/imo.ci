import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Heart, Home as HomeIcon, MapPin, Bed, Bath, Maximize, Trash2 } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import type { Property } from '../types/database';

type PropertyWithFavorite = Property & { favorite_id: string };

export default function Favorites() {
  const { user } = useAuth();
  const { refresh: refreshFavorites } = useFavorites();
  const [properties, setProperties] = useState<PropertyWithFavorite[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          property_id,
          properties (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to flatten the structure
      const favoriteProperties = data
        .filter(f => f.properties) // Filter out deleted properties
        .map(f => ({
          ...(f.properties as Property),
          favorite_id: f.id,
        })) as PropertyWithFavorite[];

      setProperties(favoriteProperties);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      // Refresh both lists
      loadFavorites();
      refreshFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Mes Favoris
          </h1>
          <p className="mt-2 text-gray-600">
            Les annonces que vous avez sauvegardées
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun favori pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Parcourez les annonces et ajoutez vos préférées à vos favoris
            </p>
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-all"
            >
              Explorer les annonces
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <Link to={`/property/${property.id}`} className="block">
                  <div className="h-56 bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center relative overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <HomeIcon className="h-20 w-20 text-white opacity-30" />
                    )}
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-brand-600">
                        {formatPrice(property.price)} FCFA
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {property.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>

                      {property.property_type && (
                        <div className="flex items-center text-sm text-gray-600">
                          <HomeIcon className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                          {property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1)}
                        </div>
                      )}

                      {(property.bedrooms || property.bathrooms || property.area_sqm) && (
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {property.bedrooms && (
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 mr-1 text-gray-400" />
                              {property.bedrooms}
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center">
                              <Bath className="h-4 w-4 mr-1 text-gray-400" />
                              {property.bathrooms}
                            </div>
                          )}
                          {property.area_sqm && (
                            <div className="flex items-center">
                              <Maximize className="h-4 w-4 mr-1 text-gray-400" />
                              {property.area_sqm} m²
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="px-6 pb-6">
                  <button
                    onClick={() => removeFavorite(property.favorite_id)}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Retirer des favoris
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
