import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Home as HomeIcon, MapPin, DollarSign, Bed, Bath, Maximize, Upload, X } from 'lucide-react';
import type { Property } from '../types/database';

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '' as 'apartment' | 'villa' | 'land' | 'office' | 'house' | '',
    price: '',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area_sqm: '',
  });

  const loadProperty = useCallback(async () => {
    if (!id || !user?.id) return;

    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id) // Using owner_id instead of user_id
        .single();

      if (error) throw error;

      const prop = data as Property;
      setProperty(prop);
      setExistingImages(prop.images || []);
      setFormData({
        title: prop.title,
        description: prop.description || '',
        property_type: prop.property_type || '',
        price: prop.price.toString(),
        location: prop.location,
        bedrooms: prop.bedrooms?.toString() || '',
        bathrooms: prop.bathrooms?.toString() || '',
        area_sqm: prop.area_sqm?.toString() || '',
      });
    } catch (error) {
      console.error('Error loading property:', error);
      alert('Erreur lors du chargement de l\'annonce');
      navigate('/my-properties');
    } finally {
      setLoading(false);
    }
  }, [id, user?.id, navigate]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + imageFiles.length + files.length;
    
    if (totalImages > 5) {
      alert('Vous ne pouvez avoir que 5 images maximum au total');
      return;
    }

    setImageFiles(prev => [...prev, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setUploading(false);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const newImageUrls = await uploadImages();
      const allImages = [...existingImages, ...newImageUrls];

      const { error } = await supabase
        .from('properties')
        .update({
          title: formData.title,
          description: formData.description || null,
          property_type: formData.property_type || null,
          price: parseFloat(formData.price),
          location: formData.location,
          bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
          area_sqm: formData.area_sqm ? parseFloat(formData.area_sqm) : null,
          images: allImages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      alert('Annonce mise à jour avec succès !');
      navigate('/my-properties');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Erreur lors de la mise à jour de l\'annonce');
    } finally {
      setSaving(false);
    }
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
            onClick={() => navigate('/my-properties')}
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            Retour à mes annonces
          </button>
        </div>
      </div>
    );
  }

  const totalImages = existingImages.length + imageFiles.length;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/my-properties')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à mes annonces
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Modifier l'annonce
            </h1>
            <p className="mt-2 text-gray-600">
              Mettez à jour les informations de votre bien
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Same form fields as NewProperty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'annonce *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                placeholder="Ex: Appartement 2 pièces à Cocody"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de bien *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HomeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  required
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value as 'apartment' | 'villa' | 'land' | 'office' | 'house' | '' })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="apartment">Appartement</option>
                  <option value="house">Maison</option>
                  <option value="villa">Villa</option>
                  <option value="land">Terrain</option>
                  <option value="office">Bureau</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix mensuel (FCFA) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="150000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Ex: Cocody, Riviera Palmeraie"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chambres
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salles de bain
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Bath className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Surface (m²)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Maximize className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={formData.area_sqm}
                    onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="75"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                placeholder="Décrivez votre bien, les équipements, les points forts..."
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos ({totalImages}/5)
              </label>
              
              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Images actuelles</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New images */}
              {imagePreviews.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Nouvelles images</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload button */}
              {totalImages < 5 && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Ajouter des photos</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {5 - totalImages} image(s) restante(s)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                  />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 shadow-lg shadow-brand-500/30"
            >
              {saving ? (
                uploading ? 'Upload des images...' : 'Enregistrement...'
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
