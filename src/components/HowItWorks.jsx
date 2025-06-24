import { motion } from 'framer-motion';
import { Upload, Zap, Gem, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Envie sua Imagem',
      description: 'Faça upload da foto ou design que deseja gravar. Aceitamos diversos formatos e ajudamos na otimização.',
      step: '01'
    },
    {
      icon: Zap,
      title: 'Gravação a Laser',
      description: 'Utilizamos tecnologia de gravação a laser de alta precisão para criar detalhes perfeitos em sua bijuteria.',
      step: '02'
    },
    {
      icon: Gem,
      title: 'Acabamento Premium',
      description: 'Cada peça recebe acabamento artesanal cuidadoso, garantindo qualidade e durabilidade excepcionais.',
      step: '03'
    },
    {
      icon: Truck,
      title: 'Entrega Segura',
      description: 'Sua bijuteria personalizada é embalada com carinho e enviada com segurança para sua casa.',
      step: '04'
    }
  ];

  const features = [
    'Gravação em alta definição',
    'Materiais de qualidade premium',
    'Processo 100% personalizado',
    'Garantia de satisfação',
    'Entrega em toda a Europa',
    'Suporte especializado'
  ];

  return (
    <section id="personalizar" className="py-20 bg-gradient-to-br from-emerald-50 to-white">
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
            Como <span className="text-emerald-custom">Personalizamos</span>
          </h2>
          <p className="text-lg text-gray-600 font-poppins max-w-2xl mx-auto">
            Nosso processo de gravação a laser garante precisão e qualidade em cada detalhe. 
            Veja como transformamos suas ideias em bijuterias únicas.
          </p>
        </motion.div>

        {/* Processo passo a passo */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  {/* Número do passo */}
                  <div className="absolute top-4 right-4 text-6xl font-playfair font-bold text-emerald-custom/10">
                    {step.step}
                  </div>
                  
                  {/* Ícone */}
                  <div className="w-16 h-16 bg-emerald-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Conteúdo */}
                  <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 font-poppins text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Seção de características */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Imagem do processo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="/colar_personalizado_4.jpg"
                alt="Processo de gravação a laser"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Elemento decorativo */}
            <div className="absolute inset-0 bg-emerald-gradient opacity-10 rounded-2xl transform -rotate-3 -z-10"></div>
            
            {/* Badge de qualidade */}
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
              className="absolute -top-4 -right-4 bg-white rounded-full p-4 shadow-lg border-2 border-emerald-custom"
            >
              <Gem className="w-8 h-8 text-emerald-custom" />
            </motion.div>
          </motion.div>

          {/* Características */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
                Tecnologia de <span className="text-emerald-custom">Ponta</span>
              </h3>
              <p className="text-gray-600 font-poppins leading-relaxed mb-6">
                Utilizamos equipamentos de gravação a laser de última geração para garantir 
                precisão milimétrica e acabamento perfeito em cada bijuteria personalizada.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-2 h-2 bg-emerald-custom rounded-full"></div>
                  <span className="text-gray-700 font-poppins text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-emerald-gradient p-6 rounded-xl text-white"
            >
              <h4 className="font-playfair font-semibold text-lg mb-2">
                Garantia de Qualidade
              </h4>
              <p className="font-poppins text-sm opacity-90">
                Todas as nossas bijuterias passam por rigoroso controle de qualidade. 
                Se não ficar satisfeito, refazemos sua peça sem custo adicional.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

