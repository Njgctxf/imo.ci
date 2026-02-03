import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    background: '/hero-1/fond3.png',
    building: '/hero-1/maison-3.png',
    title: 'CHEZ VOUS',
    subtitle: '',
    description: 'Découvrez les meilleures propriétés en Côte d\'Ivoire',
    stats: {
      properties: '500+',
      cities: '12',
      clients: '1200+',
    },
  },
  {
    background: '/hero-2/fond-1.png',
    building: '/hero-2/maison2.png',
    title: 'CHEZ VOUS',
    subtitle: '',
    description: 'Des logements modernes adaptés à vos besoins',
    stats: {
      properties: '500+',
      cities: '12',
      clients: '1200+',
    },
  },
  {
    background: '/hero-3/fond-2.png',
    building: '/hero-3/maison-1.png',
    title: 'CHEZ VOUS',
    subtitle: '',
    description: 'Votre patrimoine immobilier commence ici',
    stats: {
      properties: '500+',
      cities: '12',
      clients: '1200+',
    },
  },
];

export default function HeroParallax() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax effects with different speeds
  const bgX = useTransform(mouseX, [-500, 500], [-10, 10]);
  const bgY = useTransform(mouseY, [-500, 500], [-10, 10]);
  const buildingX = useTransform(mouseX, [-500, 500], [-30, 30]);
  const buildingY = useTransform(mouseY, [-500, 500], [-30, 30]);

  // Auto-play slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Mouse move handler for parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <>
      {/* Mobile Version - Card Style */}
      <div className="md:hidden relative w-full h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full"
        >
          {/* House Image */}
          <div className="relative h-80">
            <img
              src={slides[currentSlide].building}
              alt="Dream Home"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Discover Your
            </h1>
            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              Dream Home
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Trouvez la propriété parfaite. Explorez, comparez et trouvez votre maison idéale.
            </p>

            {/* CTA Button */}
            <button className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-full shadow-lg transition-all hover:scale-[1.02]">
              Commencer
            </button>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === currentSlide ? 'w-8 bg-blue-600' : 'w-1 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Navigation Arrows - Mobile */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-gray-900" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-gray-900" />
        </button>
      </div>

      {/* Desktop Version - Parallax */}
      <div
        className="hidden md:block relative w-full h-screen overflow-hidden bg-gradient-to-br from-orange-900 via-amber-800 to-orange-700"
        onMouseMove={handleMouseMove}
      >
        {/* LAYER 1: Background Image (Slowest parallax) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ x: bgX, y: bgY }}
            >
              <img
                src={slides[currentSlide].background}
                alt="Background"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* LAYER 2: Building/House (Medium parallax) - LARGE at Right */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`building-${currentSlide}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 pointer-events-none"
          >
            <motion.div
              className="absolute inset-y-0 right-0 w-full md:w-[70%] h-full"
              style={{ x: buildingX, y: buildingY, scale: 1.2 }}
            >
              <img
                src={slides[currentSlide].building}
                alt="Building"
                className="w-full h-full object-cover object-right-bottom"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* LAYER 3: Content - Left Aligned Dream Homes Style */}
        <div className="relative z-20 h-full flex items-center max-w-7xl mx-auto px-8 md:px-12">
          {/* Semi-transparent overlay for text readability - LIGHTER */}
          <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-gradient-to-r from-black/20 via-black/10 to-transparent pointer-events-none" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl relative z-10"
            >
              {/* Elegant Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-2"
                style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
              >
                Accédez à votre
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
                style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}
              >
                Maison de Rêve
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base md:text-lg text-white/90 mb-8 leading-relaxed"
                style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}
              >
                Parcourez une collection organisée de maisons de rêve à portée de main, 
                alliant confort et personnalisation exceptionnels.
              </motion.p>

              {/* CTA Buttons - Dream Homes Style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex gap-4 items-center"
              >
                <button className="px-6 md:px-8 py-3 md:py-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full transition-all shadow-lg hover:scale-105 text-sm md:text-base">
                  Découvrir maintenant
                </button>
                <button className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium rounded-full transition-all border-2 border-white text-sm md:text-base">
                  <span className="w-6 h-6 flex items-center justify-center bg-white text-gray-900 rounded-full text-xs">▶</span>
                  Voir la démo
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Arrows - Desktop */}
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Slide Indicators - Desktop */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-12 bg-white' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
