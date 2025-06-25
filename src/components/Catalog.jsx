import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProductModal from './ProductModal';
import { useCart } from '@/contexts/CartContext';

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();

  const products = [
    {
      id: 1,
      name: 'Colar com Foto Personalizada',
      description: 'Colar elegante com gravação de foto em alta definição',
      price: 'A partir de €39,90',
      image: '/colar_foto_1.jpg',
      category: 'Colares'
    },
    {
      id: 2,
      name: 'Colar Olhar Personalizado',
      description: 'Design único com gravação de olhares especiais',
      price: 'A partir de €34,90',
      image: '/colar_olhar_2.jpg',
      category: 'Colares'
    },
    {
      id: 3,
      name: 'Colar Personalizado Redondo',
      description: 'Pingente redondo com gravação personalizada',
      price: 'A partir de €29,90',
      image: '/colar_personalizado_3.jpg',
      category: 'Colares'
    },
    {
      id: 4,
      name: 'Colar Personalizado Premium',
      description: 'Colar de alta qualidade com gravação laser premium',
      price: 'A partir de €49,90',
      image: '/colar_personalizado_4.jpg',
      category: 'Colares'
    },
    {
      id: 5,
      name: 'Pingente Foto Personalizada',
      description: 'Pingente delicado com gravação de foto',
      price: 'A partir de €24,90',
      image: '/pingente_foto_5.png',
      category: 'Pingentes'
    },
    {
      id: 6,
      name: 'Colar Spotify Personalizado',
      description: 'Grave sua música favorita em formato Spotify',
      price: 'A partir de €39,90',
      image: '/colar_spotify_8.png',
      category: 'Colares'
    },
    {
      id: 7,
      name: 'Conjunto Infantil Bailarina',
      description: 'Conjunto completo com colar, brincos e pulseira',
      price: 'A partir de €45,90',
      image: '/Gh5qcNvoZP6R.jpg',
      category: 'Conjuntos'
    },
    {
      id: 8,
      name: 'Conjunto Borboleta Personalizado',
      description: 'Conjunto delicado com tema borboleta',
      price: 'A partir de €42,90',
      image: '/2QD1BrRCAK5B.jpg',
      category: 'Conjuntos'
    },
    {
      id: 9,
      name: 'Pulseira Nome Personalizada',
      description: 'Pulseira infantil com nome personalizado',
      price: 'A partir de €19,90',
      image: '/P6xDk2TOFMMW.jpg',
      category: 'Pulseiras'
    },
    {
      id: 10,
      name: 'Conjunto Trevo da Sorte',
      description: 'Conjunto elegante inspirado no trevo da sorte',
      price: 'A partir de €55,90',
      image: '/WNVPQyeNr8uD.jpeg',
      category: 'Conjuntos'
    },
    {
      id: 11,
      name: 'Colar Coração Cristal',
      description: 'Colar romântico com pingente de coração em cristal',
      price: 'A partir de €37,90',
      image: '/xwZ0sdlI6233.jpg',
      category: 'Colares'
    },
    {
      id: 12,
      name: 'Pulseira Infantil com Nome',
      description: 'Pulseira delicada para crianças com nome personalizado',
      price: 'A partir de €16,90',
      image: '/EkYOf3GU5ahR.jpeg',
      category: 'Pulseiras'
    },
    {
      id: 13,
      name: 'Brincos Borboleta Dourados',
      description: 'Brincos elegantes em formato de borboleta',
      price: 'A partir de €22,90',
      image: '/POPqyr5mMH7x.jpeg',
      category: 'Brincos'
    },
    {
      id: 14,
      name: 'Anel Personalizado com Nome',
      description: 'Anel delicado com gravação de nome',
      price: 'A partir de €28,90',
      image: '/colar_foto_1.jpg',
      category: 'Anéis'
    },
    {
      id: 15,
      name: 'Tornozeleira Personalizada',
      description: 'Tornozeleira elegante com pingentes personalizados',
      price: 'A partir de €21,90',
      image: '/colar_olhar_2.jpg',
      category: 'Tornozeleiras'
    }
  ];

  const categories = ['Todos', 'Colares', 'Pingentes', 'Pulseiras', 'Brincos', 'Conjuntos', 'Anéis', 'Tornozeleiras'];

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleQuickAdd = (product) => {
    addToCart(product);
    
    // Feedback visual
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-poppins';
    notification.textContent = 'Produto adicionado ao carrinho!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <section id="catalogo" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header da seção */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-gray-900 mb-4">
            Nosso <span className="text-emerald-custom">Catálogo</span>
          </h2>
          <p className="text-lg text-gray-600 font-poppins">
            Descubra a nossa colecção exclusiva de bijuterias personalizadas. 
            Cada peça é única e criada especialmente para vós.
          </p>
        </motion.div>

        {/* Filtros de categoria */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`font-poppins ${
                selectedCategory === category
                  ? 'bg-emerald-gradient text-white'
                  : 'border-emerald-custom text-emerald-custom hover:bg-emerald-custom hover:text-white'
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Grid de produtos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 jewelry-shine"
                  />
                  
                  {/* Overlay com ações */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-3">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/90 hover:bg-white"
                        onClick={() => openProductModal(product)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-emerald-gradient hover:opacity-90"
                        onClick={() => handleQuickAdd(product)}
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Badge da categoria */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-emerald-gradient text-white px-3 py-1 rounded-full text-xs font-poppins font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 font-poppins text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-poppins font-bold text-emerald-custom">
                      {product.price}
                    </span>
                    <Button 
                      size="sm" 
                      className="bg-emerald-gradient hover:opacity-90 text-white font-poppins"
                      onClick={() => openProductModal(product)}
                    >
                      Personalizar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA para ver mais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            size="lg" 
            variant="outline"
            className="border-emerald-custom text-emerald-custom hover:bg-emerald-custom hover:text-white font-poppins px-8"
            onClick={() => {
              const contactSection = document.getElementById('contato');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Ver Mais Produtos
          </Button>
        </motion.div>
      </div>

      {/* Modal de produto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
      />
    </section>
  );
};

export default Catalog;

