import { useState } from 'react';
import { Menu, X, Gem, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Catálogo', href: '#catalogo' },
    { name: 'Como Personalizar', href: '#personalizar' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Contato', href: '#contato' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-gradient rounded-full flex items-center justify-center">
              <Gem className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-playfair font-bold text-emerald-custom">
              Esmeralda
            </span>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-poppins text-gray-700 hover:text-emerald-custom transition-colors duration-300"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Redes Sociais */}
            <div className="flex items-center space-x-3">
              <a
                href="https://instagram.com/esmeralda.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-emerald-custom transition-colors duration-300"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/351939053105?text=Olá! Tenho interesse em conhecer melhor os itens da Esmeralda."
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-emerald-custom transition-colors duration-300"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            
            <Button 
              className="bg-emerald-gradient hover:opacity-90 text-white font-poppins"
              onClick={() => {
                const contactSection = document.getElementById('contato');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Solicitar Orçamento
            </Button>
          </div>

          {/* Menu Mobile Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4 pt-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="font-poppins text-gray-700 hover:text-emerald-custom transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Redes Sociais Mobile */}
              <div className="flex items-center space-x-4 pt-2">
                <a
                  href="https://instagram.com/esmeralda.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-emerald-custom transition-colors duration-300"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://wa.me/351939053105?text=Olá! Tenho interesse em conhecer melhor os itens da Esmeralda."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-emerald-custom transition-colors duration-300"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              
              <Button 
                className="bg-emerald-gradient hover:opacity-90 text-white font-poppins mt-4"
                onClick={() => {
                  const contactSection = document.getElementById('contato');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                  setIsMenuOpen(false);
                }}
              >
                Solicitar Orçamento
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

