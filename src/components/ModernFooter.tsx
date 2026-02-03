import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Home,
  Building,
  FileText,
  HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ModernFooter() {
  const footerLinks = {
    company: {
      title: 'Entreprise',
      links: [
        { name: 'À propos', path: '/about' },
        { name: 'Notre équipe', path: '/about#team' },
        { name: 'Carrières', path: '/careers' },
        { name: 'Blog', path: '/blog' },
      ],
    },
    services: {
      title: 'Services',
      links: [
        { name: 'Acheter', path: '/properties?type=sale' },
        { name: 'Louer', path: '/properties?type=rent' },
        { name: 'Vendre', path: '/new-property' },
        { name: 'Estimer', path: '/estimate' },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Centre d\'aide', path: '/help' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Contact', path: '/contact' },
        { name: 'Confidentialité', path: '/privacy' },
      ],
    },
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI0ZGRiIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] " />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Prêt à trouver votre maison idéale ?
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers de personnes qui ont trouvé leur bonheur avec ImmoCI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/properties"
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-2xl hover:bg-gray-100 transition-all shadow-lg"
                >
                  Explorer les propriétés
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-2xl hover:bg-white/20 transition-all"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <div>
                <span className="text-2xl font-bold">ImmoCI</span>
                <p className="text-xs text-gray-400">Votre maison de rêve</p>
              </div>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              La plateforme immobilière de confiance en Côte d'Ivoire. 
              Trouvez votre futur chez-vous en quelques clics.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, link: '#' },
                { icon: Twitter, link: '#' },
                { icon: Instagram, link: '#' },
                { icon: Linkedin, link: '#' },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all group"
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-500 transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div className="lg:col-span-4">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400">
                    Cocody, Rue des Jardins<br />
                    Abidjan, Côte d'Ivoire
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400">+225 07 XX XX XX XX</p>
                  <p className="text-gray-400">+225 05 XX XX XX XX</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:contact@immoci.ci" className="text-gray-400 hover:text-white transition-colors">
                    contact@immoci.ci
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 ImmoCI. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Conditions d'utilisation
              </Link>
              <Link to="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
