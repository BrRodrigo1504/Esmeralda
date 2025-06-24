import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! Sou a Chica, assistente virtual da Esmeralda! 😊 Como posso ajudar você a encontrar a bijuteria perfeita?',
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

  const quickQuestions = [
    'Quais são os preços?',
    'Como funciona a personalização?',
    'Qual o prazo de entrega?',
    'Que materiais vocês usam?',
    'Ideias para presente'
  ];

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    // Saudações
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
      return 'Olá! Sou a Chica, sua assistente virtual da Esmeralda! 😊 Estou aqui para te ajudar a encontrar a bijuteria perfeita. O que você gostaria de saber?';
    }

    // Preços
    if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custa') || lowerMessage.includes('quanto')) {
      return 'Nossos preços variam conforme o produto e personalização:\n\n💎 Colares: €29,90 - €55,90\n💎 Pingentes: €24,90 - €39,90\n💎 Pulseiras: €16,90 - €21,90\n💎 Brincos: €22,90 - €28,90\n💎 Conjuntos: €42,90 - €55,90\n\nTodos os preços incluem gravação personalizada! Quer ver algum produto específico?';
    }

    // Materiais
    if (lowerMessage.includes('material') || lowerMessage.includes('ouro') || lowerMessage.includes('prata') || lowerMessage.includes('aço')) {
      return 'Trabalhamos com materiais de alta qualidade:\n\n✨ Ouro 18k - Durabilidade e elegância\n✨ Prata 925 - Clássico e versátil\n✨ Ouro Rosé - Moderno e romântico\n✨ Aço Inoxidável - Resistente e hipoalergênico\n\nTodos com acabamento premium e garantia de 2 anos!';
    }

    // Personalização
    if (lowerMessage.includes('personaliz') || lowerMessage.includes('gravação') || lowerMessage.includes('laser') || lowerMessage.includes('custom')) {
      return 'Nossa especialidade é personalização com gravação a laser! 🔥\n\n📸 Fotos em alta definição\n✍️ Nomes e frases especiais\n🎵 Códigos Spotify das suas músicas\n💕 Desenhos e símbolos únicos\n\nO processo leva 5-7 dias úteis e o resultado é incrível! Que tipo de personalização você tem em mente?';
    }

    // Entrega
    if (lowerMessage.includes('entrega') || lowerMessage.includes('envio') || lowerMessage.includes('prazo') || lowerMessage.includes('demora')) {
      return 'Informações sobre entrega:\n\n📦 Prazo: 5-7 dias úteis\n🚚 Frete: €4,99 para toda Portugal\n📍 Enviamos para toda Europa\n📱 Rastreamento incluído\n\nTodas as peças vêm em embalagem premium, perfeita para presente! 🎁';
    }

    // Contato
    if (lowerMessage.includes('contato') || lowerMessage.includes('telefone') || lowerMessage.includes('whatsapp') || lowerMessage.includes('email')) {
      return 'Entre em contato conosco:\n\n📧 Email: contato@esmeralda.pt\n📱 WhatsApp: +351 912 345 678\n📍 Localização: Porto, Portugal\n\nEstamos sempre prontos para te atender! Prefere falar por WhatsApp ou email?';
    }

    // Produtos específicos
    if (lowerMessage.includes('colar')) {
      return 'Nossos colares são lindos! 💎\n\n🌟 Colar com Foto - €39,90\n🌟 Colar Spotify - €39,90\n🌟 Colar Coração Cristal - €37,90\n🌟 Colar Premium - €49,90\n\nTodos com gravação personalizada incluída! Qual estilo combina mais com você?';
    }

    if (lowerMessage.includes('pulseira')) {
      return 'Pulseiras delicadas e elegantes! ✨\n\n💫 Pulseira Nome Personalizada - €19,90\n💫 Pulseira Infantil - €16,90\n💫 Tornozeleira Personalizada - €21,90\n\nPerfeitas para uso diário ou ocasiões especiais! Quer ver alguma específica?';
    }

    if (lowerMessage.includes('brinco')) {
      return 'Brincos que fazem a diferença! 👂✨\n\n🦋 Brincos Borboleta Dourados - €22,90\n💎 Brincos Personalizados - €28,90\n\nTambém temos conjuntos completos com brincos inclusos! Que estilo você prefere?';
    }

    if (lowerMessage.includes('conjunto')) {
      return 'Conjuntos completos para um look perfeito! 💎\n\n🩰 Conjunto Bailarina - €45,90\n🦋 Conjunto Borboleta - €42,90\n🍀 Conjunto Trevo da Sorte - €55,90\n\nCada conjunto inclui colar, brincos e pulseira coordenados!';
    }

    // Presente
    if (lowerMessage.includes('presente') || lowerMessage.includes('gift') || lowerMessage.includes('namorada') || lowerMessage.includes('mãe') || lowerMessage.includes('filha')) {
      return 'Que lindo! Bijuterias personalizadas são presentes únicos! 🎁\n\n💝 Para namorada: Colar com foto de vocês\n💝 Para mãe: Pulseira com nome dos filhos\n💝 Para filha: Conjunto infantil personalizado\n💝 Para amiga: Colar Spotify com música especial\n\nTodas vêm em embalagem premium! Para quem é o presente?';
    }

    // Ocasiões
    if (lowerMessage.includes('casamento') || lowerMessage.includes('aniversário') || lowerMessage.includes('natal') || lowerMessage.includes('dia das mães')) {
      return 'Perfeito para ocasiões especiais! ✨\n\n💒 Casamento: Conjuntos elegantes em ouro\n🎂 Aniversário: Colar com data especial\n🎄 Natal: Conjuntos familiares personalizados\n👩 Dia das Mães: Pulseira com nomes dos filhos\n\nQual ocasião você está comemorando?';
    }

    // Garantia e qualidade
    if (lowerMessage.includes('garantia') || lowerMessage.includes('qualidade') || lowerMessage.includes('durabilidade')) {
      return 'Qualidade garantida! 🏆\n\n✅ Garantia de 2 anos\n✅ Materiais premium certificados\n✅ Gravação a laser de alta precisão\n✅ Acabamento profissional\n✅ Embalagem premium incluída\n\nSua satisfação é nossa prioridade!';
    }

    // Pagamento
    if (lowerMessage.includes('pagamento') || lowerMessage.includes('cartão') || lowerMessage.includes('mbway') || lowerMessage.includes('multibanco')) {
      return 'Aceitamos diversos métodos de pagamento! 💳\n\n💳 Cartões: Visa, Mastercard, Amex\n📱 MB WAY\n🏧 Multibanco\n💙 PayPal\n🏦 Transferência SEPA\n\nTodos os pagamentos são 100% seguros com certificado SSL!';
    }

    // Ajuda geral
    if (lowerMessage.includes('ajuda') || lowerMessage.includes('dúvida') || lowerMessage.includes('informação')) {
      return 'Estou aqui para te ajudar! 😊 Posso te contar sobre:\n\n💎 Nossos produtos e preços\n🎨 Opções de personalização\n📦 Prazos e entrega\n💳 Formas de pagamento\n🎁 Sugestões de presente\n📞 Informações de contato\n\nO que você gostaria de saber?';
    }

    // Resposta padrão mais inteligente
    return 'Interessante! 🤔 Embora eu seja especializada em bijuterias, posso te ajudar com:\n\n💎 Escolher o produto perfeito\n🎨 Ideias de personalização\n💰 Informações sobre preços\n📦 Detalhes de entrega\n🎁 Sugestões de presente\n\nQue tal me contar mais sobre o que você está procurando? Estou aqui para te ajudar a encontrar a bijuteria ideal! ✨';
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

    // Simular delay de digitação
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botão do chatbot */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-gradient hover:opacity-90 text-white rounded-full w-16 h-16 shadow-lg relative"
        >
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        </Button>
      </motion.div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-50 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat panel */}
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-6 bottom-24 w-80 h-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border"
            >
              {/* Header */}
              <div className="bg-emerald-gradient text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-playfair font-semibold">Chica</h3>
                    <p className="text-xs text-emerald-100">Assistente Virtual</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm font-poppins ${
                        message.sender === 'user'
                          ? 'bg-emerald-custom text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-line">{message.text}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 p-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick questions */}
              {messages.length === 1 && (
                <div className="p-3 border-t bg-gray-50">
                  <p className="text-xs text-gray-600 font-poppins mb-2">Perguntas rápidas:</p>
                  <div className="flex flex-wrap gap-1">
                    {quickQuestions.slice(0, 3).map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickQuestion(question)}
                        className="text-xs font-poppins h-6 px-2"
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 font-poppins text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-emerald-gradient hover:opacity-90 text-white"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

