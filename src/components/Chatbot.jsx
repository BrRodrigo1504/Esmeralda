import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! Sou a Chica, assistente virtual da Esmeralda. Como posso ajudar você a encontrar a bijuteria perfeita?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Respostas pré-definidas do chatbot
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Saudações
    if (message.includes('oi') || message.includes('olá') || message.includes('ola')) {
      return 'Olá! Que bom ter você aqui! Estou aqui para ajudar você a encontrar a bijuteria personalizada perfeita. O que você gostaria de saber?';
    }
    
    // Preços
    if (message.includes('preço') || message.includes('valor') || message.includes('custa') || message.includes('quanto')) {
      return 'Nossos preços variam de acordo com o tipo de bijuteria e personalização:\n\n• Colares personalizados: a partir de €29,90\n• Pingentes com foto: a partir de €24,90\n• Pulseiras personalizadas: a partir de €19,90\n• Brincos personalizados: a partir de €16,90\n\nPara um orçamento exato, use nosso formulário de contato!';
    }
    
    // Materiais
    if (message.includes('material') || message.includes('qualidade') || message.includes('metal')) {
      return 'Utilizamos materiais de alta qualidade:\n\n• Aço inoxidável 316L (hipoalergênico)\n• Banho de ouro 18k\n• Banho de prata\n• Resina de alta durabilidade\n\nTodos nossos materiais são livres de níquel e seguros para peles sensíveis!';
    }
    
    // Gravação a laser
    if (message.includes('laser') || message.includes('gravação') || message.includes('personalização')) {
      return 'Nossa gravação a laser é de alta precisão e permite:\n\n• Fotos em alta definição\n• Textos e nomes\n• Datas especiais\n• Símbolos e desenhos\n• Códigos QR (como Spotify)\n• Coordenadas geográficas\n\nA gravação é permanente e resistente ao tempo!';
    }
    
    // Entrega
    if (message.includes('entrega') || message.includes('prazo') || message.includes('envio')) {
      return 'Nossos prazos de entrega:\n\n• Produção: 5 a 7 dias úteis\n• Envio: 2 a 5 dias úteis (Portugal continental)\n• Entrega expressa: disponível para Porto e Lisboa\n\nEnviamos para toda a Europa com embalagem especial e rastreamento!';
    }
    
    // Presentes
    if (message.includes('presente') || message.includes('gift') || message.includes('namorada') || message.includes('namorado')) {
      return 'Perfeito para presentes especiais! Nossas bijuterias são ideais para:\n\n• Aniversários de namoro\n• Dia dos Namorados\n• Aniversários\n• Dia das Mães\n• Formatura\n• Casamentos\n\nIncluímos embalagem de presente gratuita!';
    }
    
    // Cuidados
    if (message.includes('cuidado') || message.includes('limpeza') || message.includes('conservar')) {
      return 'Para manter sua bijuteria sempre linda:\n\n• Evite contato com perfumes e cremes\n• Limpe com pano seco e macio\n• Guarde em local seco\n• Evite contato com água do mar/piscina\n• Use produtos específicos para limpeza se necessário\n\nSeguindo esses cuidados, sua peça durará muito tempo!';
    }
    
    // Garantia
    if (message.includes('garantia') || message.includes('troca') || message.includes('devolução')) {
      return 'Oferecemos garantia completa:\n\n• 30 dias para trocas e devoluções\n• 6 meses de garantia contra defeitos\n• Refazemos a peça se não ficar satisfeito\n• Suporte pós-venda especializado\n\nSua satisfação é nossa prioridade!';
    }
    
    // Tipos de bijuteria
    if (message.includes('tipo') || message.includes('modelo') || message.includes('catálogo')) {
      return 'Temos diversos tipos de bijuterias:\n\n• Colares com foto personalizada\n• Pingentes com gravação\n• Pulseiras personalizadas\n• Brincos customizados\n• Anéis com gravação\n• Chaveiros personalizados\n\nQual tipo mais te interessa?';
    }
    
    // Contato
    if (message.includes('contato') || message.includes('telefone') || message.includes('whatsapp')) {
      return 'Entre em contato conosco:\n\n📧 Email: contato@esmeralda.pt\n📱 WhatsApp: +351 912 345 678\n📍 Porto, Portugal\n\nOu use nosso formulário de orçamento aqui no site!';
    }
    
    // Resposta padrão
    return 'Interessante! Para te ajudar melhor, posso falar sobre:\n\n• Tipos de bijuterias e preços\n• Processo de gravação a laser\n• Materiais e qualidade\n• Prazos de entrega\n• Cuidados com as peças\n• Ideias para presentes\n\nSobre qual desses temas você gostaria de saber mais?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular delay de digitação do bot
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickQuestions = [
    'Quais são os preços?',
    'Como funciona a gravação?',
    'Qual o prazo de entrega?',
    'Que materiais vocês usam?'
  ];

  return (
    <>
      {/* Botão do Chatbot */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-emerald-gradient hover:opacity-90 shadow-lg"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </Button>
        
        {/* Indicador de nova mensagem */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-xs font-bold">!</span>
        </motion.div>
      </motion.div>

      {/* Janela do Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] z-50 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]"
          >
            <Card className="h-full flex flex-col border-0 shadow-2xl">
              {/* Header do Chat */}
              <CardHeader className="bg-emerald-gradient text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-playfair font-semibold">Assistente Esmeralda</h3>
                      <p className="text-xs opacity-90">Especialista em bijuterias</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              {/* Área de Mensagens */}
              <CardContent className="flex-1 p-0 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-[80%] ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.sender === 'user' 
                              ? 'bg-emerald-custom' 
                              : 'bg-gray-200'
                          }`}>
                            {message.sender === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-gray-600" />
                            )}
                          </div>
                          <div className={`p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-emerald-custom text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="text-sm font-poppins whitespace-pre-line">
                              {message.text}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Indicador de digitação */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="bg-gray-100 p-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Perguntas Rápidas */}
                  {messages.length === 1 && (
                    <div className="p-4 border-t">
                      <p className="text-xs text-gray-500 font-poppins mb-2">Perguntas frequentes:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {quickQuestions.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => setInputMessage(question)}
                            className="text-xs font-poppins h-8 border-emerald-custom text-emerald-custom hover:bg-emerald-custom hover:text-white"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input de Mensagem */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Digite sua pergunta..."
                        className="font-poppins"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                        className="bg-emerald-gradient hover:opacity-90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

