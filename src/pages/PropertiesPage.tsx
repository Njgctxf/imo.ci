import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';

export default function PropertiesPage() {
  const properties = [
    {
      id: 1,
      image: '/hero-1/maison-3.png',
      name: 'Villa Moderne',
      location: 'Cocody, Abidjan',
      price: '150 000 000 FCFA',
      rating: 4.8,
      bedrooms: 4,
      bathrooms: 3,
    },
    {
      id: 2,
      image: '/hero-2/maison2.png',
      name: 'Appartement de Luxe',
      location: 'Marcory, Abidjan',
      price: '85 000 000 FCFA',
      rating: 4.9,
      bedrooms: 3,
      bathrooms: 2,
    },
    {
      id: 3,
      image: '/hero-3/maison-1.png',
      name: 'Villa Premium',
      location: 'Plateau, Abidjan',
      price: '200 000 000 FCFA',
      rating: 4.7,
      bedrooms: 5,
      bathrooms: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-8"
          >
            Toutes les Propriétés
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative h-64">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {property.name}
                  </h3>
                  <p className="text-gray-600 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {property.price}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{property.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
