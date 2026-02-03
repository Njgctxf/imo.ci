import HeroParallax from '../components/HeroParallax';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { Home, Shield, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Parallax Section */}
      <HeroParallax />

      {/* Search Bar - Floating above blue section */}
      <div className="relative -mb-12 z-50 flex justify-center px-8">
        <div className="w-full max-w-4xl bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <span className="text-gray-400">📍</span>
              <input
                type="text"
                placeholder="Localisation"
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm md:text-base"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <span className="text-gray-400">📅</span>
              <input
                type="text"
                placeholder="Date d'entrée"
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm md:text-base"
              />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
              <span className="text-gray-400">👥</span>
              <input
                type="text"
                placeholder="Pièces"
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-sm md:text-base"
              />
            </div>

            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105">
              🔍
              <span className="hidden md:inline">Rechercher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-700 py-12 pt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center items-center">
            {[
              { number: '500+', label: 'Propriétés' },
              { number: '12', label: 'Villes' },
              { number: '1200+', label: 'Clients Satisf' },
              { number: '98%', label: 'Taux de satisf.' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Places to Stay */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900"
            >
              Lieux Recommandés à Louer
            </motion.h2>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="px-6 py-2 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-full border border-gray-200 transition-all hover:scale-105"
            >
              Voir tout
            </motion.button>
          </div>

          {/* Property Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                image: '/hero-1/maison-1.png',
                price: '150 000 FCFA',
                name: 'Villa de Luxe Pearl',
                location: 'Cocody, Abidjan',
                rating: 4.8,
              },
              {
                image: '/hero-2/maison-2.png',
                price: '200 000 FCFA',
                name: 'Villa Palm City',
                location: 'Marcory, Abidjan',
                rating: 4.9,
              },
              {
                image: '/hero-3/maison-3.png',
                price: '120 000 FCFA',
                name: 'Appartement Viva Balifago',
                location: 'Plateau, Abidjan',
                rating: 4.6,
              },
              {
                image: '/hero-1/background-1.png',
                price: '180 000 FCFA',
                name: 'Quartier Calme',
                location: 'Angré, Abidjan',
                rating: 4.7,
              },
            ].map((property, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Property Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 left-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                    <span className="text-sm font-semibold text-gray-900">
                      {property.price} <span className="text-gray-600">/mois</span>
                    </span>
                  </div>

                  {/* Heart Icon */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <span className="text-xl">🤍</span>
                  </button>
                </div>

                {/* Property Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    📍 {property.location}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-sm ${
                            star <= Math.floor(property.rating)
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {property.rating}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Pourquoi choisir ImmoCI ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plateforme de référence pour la location immobilière en Côte d'Ivoire
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                title: 'Large sélection',
                description: 'Des centaines de propriétés vérifiées dans toute la Côte d\'Ivoire',
                color: 'blue',
              },
              {
                icon: Shield,
                title: 'Sécurisé & Vérifié',
                description: 'Toutes nos annonces sont vérifiées pour votre sécurité',
                color: 'green',
              },
              {
                icon: TrendingUp,
                title: 'Meilleurs prix',
                description: 'Prix transparents et compétitifs, sans frais cachés',
                color: 'purple',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
              >
                <div className={`w-16 h-16 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-6`}>
                  <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Trouvez votre logement idéal en 3 étapes simples
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600" />

            {[
              {
                step: '01',
                title: 'Recherchez',
                description: 'Parcourez notre catalogue de propriétés et utilisez nos filtres',
              },
              {
                step: '02',
                title: 'Visitez',
                description: 'Contactez le propriétaire et planifiez une visite',
              },
              {
                step: '03',
                title: 'Louez',
                description: 'Signez votre contrat et emménagez dans votre nouveau chez-vous',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-6xl font-bold shadow-2xl relative z-10">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 rounded-full bg-white/5 blur-3xl"
              animate={{
                x: ['0%', '100%', '0%'],
                y: ['0%', '50%', '0%'],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                left: `${i * 30}%`,
                top: `${i * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Prêt à trouver votre chez-vous ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez des milliers de personnes qui ont trouvé leur logement idéal avec ImmoCI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/search"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold rounded-xl transition-all border border-white/30 hover:scale-105"
              >
                Explorer les annonces
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
