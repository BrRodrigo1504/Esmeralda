import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Catalog = () => {
  const products = [
    {
      id: 1,
      name: 'Colar com Foto Personalizada',
      description: 'Colar elegante com gravação de foto em alta definição',
      price: 'A partir de R$ 89,90',
      image: '/colar_foto_1.jpg',
      category: 'Colares'
    },
    {
      id: 2,
      name: 'Colar Olhar Personalizado',
      description: 'Design único com gravação de olhares especiais',
      price: 'A partir de R$ 79,90',
      image: '/colar_olhar_2.jpg',
      category: 'Colares'
    },
    {
      id: 3,
      name: 'Colar Personalizado Redondo',
      description: 'Formato clássico redondo com sua personalização',
      price: 'A partir de R$ 69,90',
      image: '/colar_personalizado_3.jpg',
      category: 'Colares'
    },
    {
      id: 4,
      name: 'Colar Formato Especial',
      description: 'Diversos formatos disponíveis para sua criatividade',
      price: 'A partir de R$ 99,90',
      image: '/colar_personalizado_4.jpg',
      category: 'Colares'
    },
    {
      id: 5,
      name: 'Pingente Foto Personalizada',
      description: 'Pingente delicado com gravação de foto',
      price: 'A partir de R$ 59,90',
      image: '/pingente_foto_5.png',
      category: 'Pingentes'
    },
    {
      id: 6,
      name: 'Colar Spotify Personalizado',
      description: 'Grave sua música favorita em formato Spotify',
      price: 'A partir de R$ 89,90',
      image: '/colar_spotify_8.png',
      category: 'Colares'
    }
  ];

  const categories = ['Todos', 'Colares', 'Pingentes', 'Pulseiras', 'Brincos'];

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
          <p className="text-lg text-gray-600 font-poppins max-w-2xl mx-auto">
            Descubra nossa coleção exclusiva de bijuterias personalizadas. 
            Cada peça é única e criada especialmente para você.
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
              variant={category === 'Todos' ? 'default' : 'outline'}
              className={`font-poppins ${
                category === 'Todos'
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
          {products.map((product, index) => (
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
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="bg-emerald-gradient hover:opacity-90">
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
          >
            Ver Mais Produtos
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Catalog;

