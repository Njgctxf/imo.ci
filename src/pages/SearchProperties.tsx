import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, MapPin, DollarSign, Home as HomeIcon, Bed, Bath, Maximize, Filter, Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import type { Property } from '../types/database';

export default function SearchProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { toggleFavorite, isFavorite } = useFavorites();

  const loadProperties = useCallback(async () => {
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      // Apply filters
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      if (propertyTypeFilter) {
        query = query.eq('property_type', propertyTypeFilter);
      }

      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice));
      }

      const { data, error } = await query;

      if (error) throw error;
      setProperties(data as Property[]);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, propertyTypeFilter, maxPrice]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
              Trouvez votre logement idéal
            </h1>
            <p className="text-gray-600">
              Explorez les meilleures offres de location en Côte d'Ivoire
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="Rechercher par titre, localisation..."
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none"
                >
                  <option value="">Tous les types</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="studio">Studio</option>
                  <option value="villa">Villa</option>
                  <option value="terrain">Terrain</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Prix maximum (FCFA)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Chargement des annonces...</div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <HomeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune annonce trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                <span className="font-semibold text-gray-900">{properties.length}</span> bien{properties.length > 1 ? 's' : ''} disponible{properties.length > 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link
                  key={property.id}
                  to={`/property/${property.id}`}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="h-56 bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center relative overflow-hidden">
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <HomeIcon className="h-20 w-20 text-white opacity-30 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute top-4 left-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(property.id);
                        }}
                        className={`p-2 rounded-full transition-all ${
                          isFavorite(property.id)
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                        }`}
                        title={isFavorite(property.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      >
                        <Heart
                          className="h-5 w-5"
                          fill={isFavorite(property.id) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-brand-600">
                        {formatPrice(property.price)} FCFA
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
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

                    {property.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {property.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
