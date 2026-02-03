import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Image as ImageIcon,
  Bed,
  Bath,
  Maximize,
  Calendar,
  ArrowLeft,
  Upload
} from 'lucide-react';
import type { PropertyType, ListingType } from '../types/database';

export default function CreateProperty() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'apartment' as PropertyType,
    listing_type: 'sale' as ListingType,
    price: '',
    location: '',
    address: '',
    city: '',
    area_sqm: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [] as string[],
    available_from: '',
  });

  const propertyTypes = [
    { value: 'apartment', label: 'Appartement' },
    { value: 'villa', label: 'Villa' },
    { value: 'house', label: 'Maison' },
    { value: 'land', label: 'Terrain' },
    { value: 'office', label: 'Bureau' },
  ];

  const amenitiesList = [
    'Piscine', 'Jardin', 'Garage', 'Climatisation', 'Chauffage',
    'Sécurité 24/7', 'Ascenseur', 'Balcon', 'Terrasse', 'Cuisine équipée'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Vous devez être connecté');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          owner_id: user.id,
          title: formData.title,
          description: formData.description,
          property_type: formData.property_type,
          listing_type: formData.listing_type,
          price: parseFloat(formData.price),
          location: formData.location,
          address: formData.address,
          city: formData.city,
          area_sqm: formData.area_sqm ? parseFloat(formData.area_sqm) : null,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          amenities: formData.amenities,
          available_from: formData.available_from || null,
          status: 'available',
          images: [], // You would handle image upload separately
          views: 0,
        })
        .select()
        .single();

      if (error) throw error;

      alert('Propriété ajoutée avec succès !');
      navigate('/owner-dashboard');
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Erreur lors de la création de la propriété');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au tableau de bord
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ajouter une propriété
          </h1>
          <p className="text-gray-600">
            Remplissez les informations pour publier votre bien
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de base</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de l'annonce *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Belle villa moderne à Cocody"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Décrivez votre propriété en détail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de bien *
                  </label>
                  <select
                    name="property_type"
                    required
                    value={formData.property_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'annonce *
                  </label>
                  <select
                    name="listing_type"
                    required
                    value={formData.listing_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="sale">À vendre</option>
                    <option value="rent">À louer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (FCFA) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="50000000"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Localisation</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Abidjan"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quartier *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Cocody"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse complète
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Rue des Jardins, Cocody"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Détails</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bed className="w-4 h-4 inline mr-1" />
                  Chambres
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bath className="w-4 h-4 inline mr-1" />
                  Salles de bain
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Maximize className="w-4 h-4 inline mr-1" />
                  Surface (m²)
                </label>
                <input
                  type="number"
                  name="area_sqm"
                  value={formData.area_sqm}
                  onChange={handleChange}
                  placeholder="150"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Disponible à partir du
              </label>
              <input
                type="date"
                name="available_from"
                value={formData.available_from}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </motion.div>

          {/* Amenities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Équipements</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenitiesList.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-4 py-3 rounded-xl border-2 transition-all ${
                    formData.amenities.includes(amenity)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <button
              type="button"
              onClick={() => navigate('/owner-dashboard')}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {loading ? 'Publication...' : 'Publier la propriété'}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
