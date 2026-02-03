import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, MapPin, Home as HomeIcon, Bed, Bath, Maximize, Phone, Mail, User, Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import type { Property, Profile } from '../types/database';

// Extend Profile to include email which might be fetched separately or inferred
interface ProfileWithEmail extends Profile {
  email?: string;
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [owner, setOwner] = useState<ProfileWithEmail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();

  const loadProperty = useCallback(async () => {
    if (!id) return;

    try {
      // Load property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (propertyError) throw propertyError;
      setProperty(propertyData as Property);

      // Load owner profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', propertyData.owner_id) // Updated from user_id to owner_id
        .single();

      if (profileError) throw profileError;
      setOwner(profileData as ProfileWithEmail);
    } catch (error) {
      console.error('Error loading property:', error);
      alert('Erreur lors du chargement de l\'annonce');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

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

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Annonce introuvable</h2>
          <button
            onClick={() => navigate('/search')}
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            Retour à la recherche
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === property.owner_id;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/search')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux annonces
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="h-96 bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center overflow-hidden relative">
              {property.images && property.images.length > 0 ? (
                <img
                  src={property.images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <HomeIcon className="h-32 w-32 text-white opacity-30" />
              )}
            </div>

            {/* Thumbnails */}
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 p-4 bg-gray-50 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-brand-600 scale-105'
                        : 'border-gray-200 hover:border-brand-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  {property.location}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-brand-600">
                    {formatPrice(property.price)} FCFA
                  </div>
                  <div className="text-sm text-gray-600">par mois</div>
                </div>
                {!isOwner && (
                  <button
                    onClick={() => toggleFavorite(property.id)}
                    className={`p-3 rounded-full transition-all ${
                      isFavorite(property.id)
                        ? 'bg-red-500 text-white shadow-lg hover:bg-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                    }`}
                    title={isFavorite(property.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Heart
                      className="h-6 w-6"
                      fill={isFavorite(property.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Property details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
              {property.property_type && (
                <div className="text-center">
                  <HomeIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Type</div>
                  <div className="font-semibold text-gray-900 capitalize">
                    {property.property_type}
                  </div>
                </div>
              )}
              {property.bedrooms !== null && (
                <div className="text-center">
                  <Bed className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Chambres</div>
                  <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                </div>
              )}
              {property.bathrooms !== null && (
                <div className="text-center">
                  <Bath className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Salles de bain</div>
                  <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                </div>
              )}
              {property.area_sqm !== null && (
                <div className="text-center">
                  <Maximize className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Surface</div>
                  <div className="font-semibold text-gray-900">{property.area_sqm} m²</div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{property.description}</p>
              </div>
            )}

            {/* Contact owner */}
            {!isOwner && owner && (
              <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contacter le propriétaire</h2>
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="space-y-3">
                    {owner.full_name && (
                      <div className="flex items-center text-gray-900">
                        <User className="h-5 w-5 mr-3 text-blue-600" />
                        <span className="font-medium">{owner.full_name}</span>
                      </div>
                    )}
                    {owner.phone && (
                      <div className="flex items-center text-gray-900">
                        <Phone className="h-5 w-5 mr-3 text-blue-600" />
                        <a href={`tel:${owner.phone}`} className="hover:text-brand-600 transition-colors">
                          {owner.phone}
                        </a>
                      </div>
                    )}
                    {owner.email && (
                      <div className="flex items-center text-gray-900">
                        <Mail className="h-5 w-5 mr-3 text-blue-600" />
                        <a href={`mailto:${owner.email}`} className="hover:text-brand-600 transition-colors">
                          {owner.email}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <a
                      href={`tel:${owner.phone}`}
                      className="block w-full text-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
                    >
                      Appeler maintenant
                    </a>
                  </div>
                </div>
              </div>
            )}

            {isOwner && (
              <div className="border-t border-gray-200 pt-8">
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <p className="text-gray-600">C'est votre annonce</p>
                  <button
                    onClick={() => navigate('/my-properties')}
                    className="mt-4 inline-flex items-center px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 transition-colors"
                  >
                    Gérer mes annonces
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
