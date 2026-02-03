import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Maximize, Heart, Eye, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const properties = [
  {
    id: 1,
    title: 'Villa Moderne à Cocody',
    location: 'Cocody, Abidjan',
    price: 150000000,
    image: '/hero-1/maison-3.png',
    beds: 4,
    baths: 3,
    area: 250,
    type: 'Villa',
    featured: true,
  },
  {
    id: 2,
    title: 'Appartement de Luxe',
    location: 'Marcory, Abidjan',
    price: 85000000,
    image: '/hero-2/maison2.png',
    beds: 3,
    baths: 2,
    area: 120,
    type: 'Appartement',
    featured: true,
  },
  {
    id: 3,
    title: 'Penthouse Premium',
    location: 'Plateau, Abidjan',
    price: 200000000,
    image: '/hero-3/maison-1.png',
    beds: 5,
    baths: 4,
    area: 300,
    type: 'Penthouse',
    featured: false,
  },
];

export default function FeaturedProperties() {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4"
          >
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 text-sm font-medium">Sélection Premium</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Propriétés d'Exception
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Découvrez notre sélection de biens d'exception, soigneusement choisis pour vous
          </motion.p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/property/${property.id}`}>
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Overlay Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      {property.featured && (
                        <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                      <button className="ml-auto w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all group/btn">
                        <Heart className="w-5 h-5 text-gray-700 group-hover/btn:text-red-500 group-hover/btn:fill-red-500 transition-all" />
                      </button>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick View */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <button className="px-4 py-2 bg-white text-gray-900 rounded-full font-semibold text-sm flex items-center gap-2 hover:bg-gray-100 transition-all">
                        <Eye className="w-4 h-4" />
                        Voir
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Type Badge */}
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full mb-3">
                      {property.type}
                    </span>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    {/* Features */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4" />
                        <span>{property.beds}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4" />
                        <span>{property.baths}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize className="w-4 h-4" />
                        <span>{property.area}m²</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {formatPrice(property.price)} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            Voir toutes les propriétés
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
