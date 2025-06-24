import { motion } from 'framer-motion';
import { Heart, Award, Users, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Paixão pelo Detalhe',
      description: 'Cada bijuteria é criada com amor e atenção aos mínimos detalhes, garantindo peças únicas e especiais.'
    },
    {
      icon: Award,
      title: 'Qualidade Premium',
      description: 'Utilizamos apenas materiais de alta qualidade e tecnologia de ponta para criar bijuterias duradouras.'
    },
    {
      icon: Users,
      title: 'Atendimento Personalizado',
      description: 'Nossa equipe está sempre pronta para ajudar você a criar a bijuteria perfeita para cada ocasião.'
    },
    {
      icon: Sparkles,
      title: 'Inovação Constante',
      description: 'Estamos sempre buscando novas técnicas e designs para oferecer as mais belas criações personalizadas.'
    }
  ];

  const stats = [
    { number: '3+', label: 'Anos de Experiência' },
    { number: '500+', label: 'Clientes Satisfeitos' },
    { number: '1000+', label: 'Bijuterias Criadas' },
    { number: '100%', label: 'Garantia de Qualidade' }
  ];

  return (
    <section id="sobre" className="py-20 bg-white">
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
            Sobre a <span className="text-emerald-custom">Esmeralda</span>
          </h2>
          <p className="text-lg text-gray-600 font-poppins max-w-2xl mx-auto">
            Nascemos da paixão por criar bijuterias únicas que contam histórias e 
            eternizam momentos especiais através da arte da gravação a laser.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Nossa História */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
                Nossa <span className="text-emerald-custom">História</span>
              </h3>
              <p className="text-gray-600 font-poppins leading-relaxed mb-4">
                A Esmeralda nasceu do sonho de transformar memórias preciosas em bijuterias 
                únicas e atemporais. Fundada por artesãos apaixonados pela joalheria, 
                nossa marca combina tradição artesanal com tecnologia de ponta.
              </p>
              <p className="text-gray-600 font-poppins leading-relaxed mb-4">
                Especializamo-nos em gravação a laser de alta precisão, permitindo criar 
                detalhes impossíveis com técnicas tradicionais. Cada peça é uma obra de 
                arte personalizada que carrega significado e emoção.
              </p>
              <p className="text-gray-600 font-poppins leading-relaxed">
                Hoje, somos referência em bijuterias personalizadas, atendendo clientes 
                em todo o Brasil com a mesma paixão e dedicação do primeiro dia.
              </p>
            </div>
          </motion.div>

          {/* Imagem */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="/src/assets/colar_olhar_2.jpg"
                alt="Sobre a Esmeralda"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Elementos decorativos */}
            <div className="absolute inset-0 bg-emerald-gradient opacity-10 rounded-2xl transform rotate-3 -z-10"></div>
            
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-6 -left-6 bg-white rounded-full p-4 shadow-lg border-2 border-emerald-custom"
            >
              <Sparkles className="w-8 h-8 text-emerald-custom" />
            </motion.div>
          </motion.div>
        </div>

        {/* Nossos Valores */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-playfair font-bold text-gray-900 text-center mb-12">
            Nossos <span className="text-emerald-custom">Valores</span>
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-emerald-gradient rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-xl font-playfair font-semibold text-gray-900 mb-4">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 font-poppins text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-emerald-gradient rounded-2xl p-12 text-white"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-playfair font-bold mb-4">
              Números que Falam por Si
            </h3>
            <p className="font-poppins opacity-90">
              Nossa trajetória é marcada pela confiança e satisfação dos nossos clientes
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-playfair font-bold mb-2">
                  {stat.number}
                </div>
                <div className="font-poppins text-sm opacity-90">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;

