import { motion } from 'framer-motion';
import { Gem, Mail, Phone, MapPin, Instagram, Facebook, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    produtos: [
      { name: 'Colares Personalizados', href: '#catalogo' },
      { name: 'Pingentes com Foto', href: '#catalogo' },
      { name: 'Pulseiras Customizadas', href: '#catalogo' },
      { name: 'Brincos Personalizados', href: '#catalogo' }
    ],
    empresa: [
      { name: 'Sobre Nós', href: '#sobre' },
      { name: 'Como Funciona', href: '#personalizar' },
      { name: 'Garantia', href: '#contato' },
      { name: 'Política de Privacidade', href: '#' }
    ],
    suporte: [
      { name: 'Central de Ajuda', href: '#contato' },
      { name: 'Fale Conosco', href: '#contato' },
      { name: 'Rastreamento', href: '#' },
      { name: 'Trocas e Devoluções', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/esmeralda', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com/esmeralda', label: 'Facebook' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Seção principal do footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Logo e descrição */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-emerald-gradient rounded-full flex items-center justify-center">
                <Gem className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-playfair font-bold">Esmeralda</span>
            </div>
            
            <p className="text-gray-300 font-poppins leading-relaxed">
              Criamos bijuterias personalizadas únicas com gravação a laser de alta precisão. 
              Transformamos suas memórias em joias que contam histórias, feitas em Portugal.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-emerald-custom" />
                <span className="font-poppins text-sm">contato@esmeralda.pt</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4 text-emerald-custom" />
                <span className="font-poppins text-sm">+351 912 345 678</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 text-emerald-custom" />
                <span className="font-poppins text-sm">Porto, Portugal</span>
              </div>
            </div>
          </motion.div>

          {/* Links de Produtos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-playfair font-semibold mb-6">Produtos</h3>
            <ul className="space-y-3">
              {footerLinks.produtos.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-custom transition-colors duration-300 font-poppins text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Links da Empresa */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-playfair font-semibold mb-6">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-custom transition-colors duration-300 font-poppins text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Links de Suporte */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-playfair font-semibold mb-6">Suporte</h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.suporte.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-custom transition-colors duration-300 font-poppins text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Redes Sociais */}
            <div>
              <h4 className="font-playfair font-semibold mb-3">Siga-nos</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-custom transition-colors duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Newsletter */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="border-t border-gray-800"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h3 className="text-xl font-playfair font-semibold mb-2">
              Receba Novidades e Ofertas Especiais
            </h3>
            <p className="text-gray-300 font-poppins text-sm mb-6">
              Seja o primeiro a saber sobre novos produtos e promoções exclusivas
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-emerald-custom font-poppins text-sm"
              />
              <button className="px-6 py-2 bg-emerald-gradient hover:opacity-90 rounded-r-lg font-poppins text-sm font-medium transition-opacity duration-300">
                Inscrever
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 font-poppins text-sm">
              © {currentYear} Esmeralda. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-1 text-gray-400 font-poppins text-sm">
              <span>Feito com</span>
              <Heart className="w-4 h-4 text-emerald-custom" />
              <span>para você</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

