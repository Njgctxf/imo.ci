import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Briefcase, Save, ArrowLeft } from 'lucide-react';
import type { Profile, UserRole } from '../types/database';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    role: 'tenant' as UserRole,
  });

  const loadProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        const profile = data as Profile;
        setFormData({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          role: profile.role || 'tenant',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      alert('Profil mis à jour avec succès !');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erreur lors de la mise à jour du profil');
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-gray-900">
              Mon Profil
            </h1>
            <p className="mt-2 text-gray-600">
              Complétez vos informations pour utiliser la plateforme
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom complet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  placeholder="+225 07 XX XX XX XX"
                />
              </div>
            </div>

            {/* Type d'utilisateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Je suis
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'owner' | 'tenant' })}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all appearance-none"
                >
                  <option value="tenant">Locataire</option>
                  <option value="owner">Propriétaire</option>
                </select>
              </div>
            </div>

            {/* Email (lecture seule) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="block w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-500 bg-gray-50 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">L'email ne peut pas être modifié</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all disabled:opacity-70 shadow-lg shadow-brand-500/30"
            >
              {saving ? (
                'Enregistrement...'
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Enregistrer
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
