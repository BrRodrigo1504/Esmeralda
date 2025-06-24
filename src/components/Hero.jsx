import { motion } from 'framer-motion';
import { Sparkles, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center space-x-2 text-emerald-custom"
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-poppins text-sm font-medium">Bijuterias Exclusivas</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-5xl lg:text-6xl font-playfair font-bold text-gray-900 leading-tight"
              >
                Bijuterias
                <span className="text-emerald-custom block">Personalizadas</span>
                com Gravação a Laser
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg text-gray-600 font-poppins leading-relaxed"
              >
                Transforme suas memórias mais preciosas em joias únicas. 
                Criamos bijuterias personalizadas com gravação a laser de alta precisão, 
                perfeitas para presentear ou se presentear.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg" 
                className="bg-emerald-gradient hover:opacity-90 text-white font-poppins px-8 py-3"
                onClick={() => {
                  const catalogSection = document.getElementById('catalogo');
                  if (catalogSection) {
                    catalogSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Ver Catálogo
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-emerald-custom text-emerald-custom hover:bg-emerald-custom hover:text-white font-poppins px-8 py-3"
                onClick={() => {
                  const howItWorksSection = document.getElementById('personalizar');
                  if (howItWorksSection) {
                    howItWorksSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Como Funciona
              </Button>
            </motion.div>

            {/* Estatísticas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200"
            >
              <div className="text-center">
                <div className="text-2xl font-playfair font-bold text-emerald-custom">500+</div>
                <div className="text-sm text-gray-600 font-poppins">Clientes Felizes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-playfair font-bold text-emerald-custom">1000+</div>
                <div className="text-sm text-gray-600 font-poppins">Peças Criadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-playfair font-bold text-emerald-custom">100%</div>
                <div className="text-sm text-gray-600 font-poppins">Satisfação</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Imagem Hero */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="/colar_foto_1.jpg"
                alt="Bijuteria personalizada Esmeralda"
                className="w-full h-auto rounded-2xl shadow-2xl jewelry-shine"
              />
            </div>
            
            {/* Elementos decorativos */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-gradient rounded-full flex items-center justify-center shadow-lg"
            >
              <Heart className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-emerald-custom"
            >
              <Star className="w-6 h-6 text-emerald-custom" />
            </motion.div>
            
            {/* Gradiente de fundo */}
            <div className="absolute inset-0 bg-emerald-gradient opacity-10 rounded-2xl -z-10 transform rotate-3"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

