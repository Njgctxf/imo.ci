import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Building2, Users, Award, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              À propos d'ImmoCI
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Votre partenaire de confiance pour trouver la propriété de vos rêves en Côte d'Ivoire
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: Building2, title: '500+', subtitle: 'Propriétés' },
              { icon: Users, title: '1200+', subtitle: 'Clients Satisfaits' },
              { icon: Award, title: '10 ans', subtitle: 'D\'expérience' },
              { icon: Target, title: '98%', subtitle: 'Taux de satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center"
              >
                <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.title}
                </h3>
                <p className="text-gray-600">{stat.subtitle}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 rounded-3xl p-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Notre Mission
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              ImmoCI s'engage à simplifier votre recherche immobilière en Côte d'Ivoire. 
              Nous connectons acheteurs, vendeurs et locataires avec les meilleures propriétés 
              du marché, en offrant un service transparent et personnalisé.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Notre équipe d'experts vous accompagne à chaque étape de votre projet immobilier, 
              de la recherche initiale jusqu'à la signature finale, en passant par les visites 
              et les négociations.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
