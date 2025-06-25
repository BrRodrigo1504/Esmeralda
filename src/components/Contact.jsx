import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Contact = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    produto: '',
    personalizacao: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const produtos = [
    'Colar com Foto Personalizada',
    'Colar Olhar Personalizado',
    'Colar Personalizado Redondo',
    'Colar Formato Especial',
    'Pingente Foto Personalizada',
    'Colar Spotify Personalizado',
    'Pulseira Personalizada',
    'Brincos Personalizados',
    'Outro (especificar na personalização)'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      produto: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio do formulário
    try {
      // Aqui seria integrado com um serviço de email real
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Dados do formulário:', formData);
      setIsSubmitted(true);
      
      // Reset form
      setFormData({
        nome: '',
        email: '',
        produto: '',
        personalizacao: ''
      });
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contato@esmeralda.pt',
      link: 'mailto:contato@esmeralda.pt'
    },
    {
      icon: Phone,
      title: 'WhatsApp',
      content: '+351 939 053 105',
      link: 'https://wa.me/351939053105?text=Olá! Tenho interesse em conhecer melhor os artigos da Esmeralda.'
    },
    {
      icon: MapPin,
      title: 'Localização',
      content: 'Porto, Portugal',
      link: null
    }
  ];

  return (
    <section id="contato" className="py-20 bg-gradient-to-br from-emerald-50 to-white">
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
            Entre em <span className="text-emerald-custom">Contato</span>
          </h2>
          <p className="text-lg text-gray-600 font-poppins max-w-2xl mx-auto">
            Pronto para criar sua bijuteria personalizada? Entre em contato conosco 
            e solicite seu orçamento sem compromisso.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulário de Orçamento */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair font-bold text-gray-900">
                  Solicitar Orçamento
                </CardTitle>
                <p className="text-gray-600 font-poppins">
                  Preencha o formulário abaixo e receba seu orçamento personalizado por email.
                </p>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-16 h-16 text-emerald-custom mx-auto mb-4" />
                    <h3 className="text-xl font-playfair font-semibold text-gray-900 mb-2">
                      Orçamento Enviado!
                    </h3>
                    <p className="text-gray-600 font-poppins">
                      Recebemos sua solicitação e entraremos em contato em breve com seu orçamento personalizado.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      className="mt-4 border-emerald-custom text-emerald-custom hover:bg-emerald-custom hover:text-white"
                    >
                      Fazer Nova Solicitação
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome" className="font-poppins">Nome Completo *</Label>
                        <Input
                          id="nome"
                          name="nome"
                          type="text"
                          value={formData.nome}
                          onChange={handleInputChange}
                          required
                          className="font-poppins"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-poppins">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="font-poppins"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="produto" className="font-poppins">Produto Desejado *</Label>
                      <Select onValueChange={handleSelectChange} required>
                        <SelectTrigger className="font-poppins">
                          <SelectValue placeholder="Selecione o produto desejado" />
                        </SelectTrigger>
                        <SelectContent>
                          {produtos.map((produto) => (
                            <SelectItem key={produto} value={produto} className="font-poppins">
                              {produto}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personalizacao" className="font-poppins">
                        Personalização/Gravação Desejada *
                      </Label>
                      <Textarea
                        id="personalizacao"
                        name="personalizacao"
                        value={formData.personalizacao}
                        onChange={handleInputChange}
                        required
                        className="font-poppins min-h-[120px]"
                        placeholder="Descreva detalhadamente a personalização que deseja: texto, imagem, símbolos, etc. Quanto mais detalhes, melhor será nosso orçamento!"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-gradient hover:opacity-90 text-white font-poppins py-3"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Send className="w-4 h-4" />
                          <span>Solicitar Orçamento</span>
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Informações de Contato */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
                Outras Formas de <span className="text-emerald-custom">Contato</span>
              </h3>
              <p className="text-gray-600 font-poppins leading-relaxed mb-8">
                Estamos sempre disponíveis para esclarecer suas dúvidas e ajudar você 
                a criar a bijuteria perfeita. Entre em contato através dos canais abaixo.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-emerald-gradient rounded-full flex items-center justify-center">
                          <info.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-playfair font-semibold text-gray-900 mb-1">
                            {info.title}
                          </h4>
                          {info.link ? (
                            <a
                              href={info.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-custom font-poppins hover:underline"
                            >
                              {info.content}
                            </a>
                          ) : (
                            <span className="text-gray-600 font-poppins">
                              {info.content}
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Horário de Atendimento */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="bg-emerald-gradient text-white border-0">
                <CardContent className="p-6">
                  <h4 className="font-playfair font-semibold text-lg mb-4">
                    Horário de Atendimento
                  </h4>
                  <div className="space-y-2 font-poppins text-sm">
                    <div className="flex justify-between">
                      <span>Segunda a Sexta:</span>
                      <span>9h às 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado:</span>
                      <span>9h às 14h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo:</span>
                      <span>Fechado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

