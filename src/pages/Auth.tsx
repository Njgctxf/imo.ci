import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Home, Building2, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { UserRole } from '../types/database';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('tenant');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
        
        // Get user profile to check role
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*') // Select all to see what we get
            .eq('user_id', user.id)
            .single();
          
          // Redirect based on role
          // Check both role (new) and user_type (legacy)
          const dbRole = profile?.role || profile?.user_type || 'tenant';
          const isOwner = dbRole === 'owner' || dbRole === 'proprietaire';
          
          navigate(isOwner ? '/owner-dashboard' : '/tenant-dashboard');
        }
      } else {
        await signUp(email, password);
        
        // Create profile with selected role
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Map role to user_type for database compatibility
          // owner -> proprietaire, tenant -> locataire
          const userType = role === 'owner' ? 'proprietaire' : 'locataire';

          const { error: profileError } = await supabase.from('profiles').upsert({
            id: user.id, // Using id as primary key based on common Supabase patterns
            user_id: user.id,
            full_name: name,
            user_type: userType, // Use legacy column name
            // role: role, // Commente pour eviter erreur si colonne n'existe pas
            verified: false,
          });

          if (profileError) {
            console.error('Profile creation error:', profileError);
            // If profile creation fails, we should probably not block the whole flow, 
            // but for now let's just log it. The error caught below might be from signUp itself too.
            throw profileError;
          }
          
          // Redirect based on selected role
          navigate(role === 'owner' ? '/owner-dashboard' : '/tenant-dashboard');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      // Display specific error message
      alert(error.message || (isLogin ? 'Erreur de connexion' : 'Erreur d\'inscription'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Decorative 3D Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-300 to-orange-500 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full blur-2xl opacity-25" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl w-full">
          {/* Login/Signup Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="text-xl font-semibold text-gray-800">
                ImmoCI
              </Link>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {isLogin ? 'Log in' : 'Sign up'}
            </h1>

            {/* Social Login */}
            <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white/80 hover:bg-white border border-gray-200 rounded-full transition-all mb-6 group">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-gray-700 group-hover:text-gray-900">Google</span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/60 text-gray-500">ou</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nom complet"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Je suis :
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('tenant')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          role === 'tenant'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Users className={`w-8 h-8 ${role === 'tenant' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`font-semibold ${role === 'tenant' ? 'text-blue-600' : 'text-gray-700'}`}>
                          Locataire
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('owner')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          role === 'owner'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Building2 className={`w-8 h-8 ${role === 'owner' ? 'text-purple-600' : 'text-gray-400'}`} />
                        <span className={`font-semibold ${role === 'owner' ? 'text-purple-600' : 'text-gray-700'}`}>
                          Propriétaire
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Adresse e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
                {isLogin && (
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-16 h-16 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 ml-auto"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              Trouvez votre maison de rêve
            </p>
          </motion.div>

          {/* Promo Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 flex flex-col justify-between"
          >
            {/* Top Section */}
            <div>
              <div className="text-right mb-8">
                <p className="text-sm font-medium text-gray-600">Nouvelle offre</p>
                <p className="text-sm font-medium text-gray-600">Villas premium</p>
              </div>

              <div className="text-center mb-12">
                <h2 className="text-6xl font-bold text-gray-900 mb-2">-20%</h2>
                <p className="text-4xl font-light text-gray-400">Janvier</p>
              </div>

              {/* Decorative Circle */}
              <div className="relative h-64 mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-orange-300 to-orange-600 rounded-full opacity-80 blur-xl" />
                  <div className="absolute w-40 h-40 bg-gradient-to-br from-orange-400 to-orange-700 rounded-full" />
                </div>
                <div className="absolute bottom-4 left-8 bg-white/90 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-sm font-semibold text-gray-900">Jusqu'au 31 Janvier</p>
                  <p className="text-xs text-gray-600">Cocody, Abidjan</p>
                  <p className="text-xs text-gray-600">Côte d'Ivoire</p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div>
              <div className="flex items-center justify-center mb-6">
                <Home className="w-8 h-8 text-gray-900" />
              </div>
              <button className="w-full flex items-center justify-between px-6 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-all group">
                <span className="font-semibold">Découvrir</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Bottom Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-2 bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Nouveaux listings</h3>
                <p className="text-gray-400">Villas de luxe à Cocody</p>
              </div>
              <button className="px-8 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-full transition-all hover:scale-105">
                Explorer
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
