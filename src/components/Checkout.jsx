import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Truck, Shield, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const Checkout = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Portugal',
    paymentMethod: 'card'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const { items, getCartTotal, clearCart } = useCart();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  const paymentMethods = [
    { id: 'card', name: 'Cartão de Crédito/Débito', icon: '💳' },
    { id: 'mbway', name: 'MB WAY', icon: '📱' },
    { id: 'multibanco', name: 'Multibanco', icon: '🏧' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {orderComplete ? (
            // Tela de sucesso
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-green-600" />
              </motion.div>
              <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-4">
                Pedido Confirmado!
              </h2>
              <p className="text-gray-600 font-poppins mb-6">
                Obrigado pela sua compra! Receberá um email de confirmação em breve.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 font-poppins">
                  Número do pedido: <span className="font-semibold">#ESM{Date.now()}</span>
                </p>
                <p className="text-sm text-gray-600 font-poppins">
                  Prazo de entrega: 5-7 dias úteis
                </p>
              </div>
              <Button onClick={onClose} className="bg-emerald-gradient hover:opacity-90">
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row h-full">
              {/* Resumo do pedido */}
              <div className="lg:w-2/5 bg-gray-50 p-6 border-r">
                <h3 className="text-xl font-playfair font-bold mb-6">Resumo do Pedido</h3>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.customization}`} className="flex space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-poppins font-medium text-sm">{item.name}</h4>
                        {item.customization && (
                          <p className="text-xs text-gray-500">{item.customization}</p>
                        )}
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">Qtd: {item.quantity}</span>
                          <span className="font-poppins font-semibold text-sm">{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>€{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envio:</span>
                    <span>€4,99</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-playfair font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-emerald-custom">€{(getCartTotal() + 4.99).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span>Entrega em 5-7 dias úteis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Compra 100% segura</span>
                  </div>
                </div>
              </div>

              {/* Formulário de checkout */}
              <div className="lg:w-3/5 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-playfair font-bold">Finalizar Compra</h2>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Indicador de passos */}
                <div className="flex items-center justify-center mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentStep >= step 
                          ? 'bg-emerald-custom text-white' 
                          : 'bg-gray-200 text-gray-500'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-12 h-1 mx-2 ${
                          currentStep > step ? 'bg-emerald-custom' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Passo 1: Informações pessoais */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-playfair font-semibold text-lg mb-4">Informações Pessoais</h3>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="seu@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nome</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="João"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Sobrenome</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Silva"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button onClick={handleNextStep} className="bg-emerald-gradient hover:opacity-90">
                        Continuar
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Passo 2: Endereço de entrega */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-playfair font-semibold text-lg mb-4">Endereço de Entrega</h3>
                    
                    <div>
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Rua das Flores, 123"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          placeholder="Porto"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Código Postal</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          placeholder="4000-000"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button variant="outline" onClick={handlePrevStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                      </Button>
                      <Button onClick={handleNextStep} className="bg-emerald-gradient hover:opacity-90">
                        Continuar
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Passo 3: Pagamento */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-playfair font-semibold text-lg mb-4">Método de Pagamento</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {paymentMethods.map((method) => (
                        <Card
                          key={method.id}
                          className={`cursor-pointer transition-all ${
                            formData.paymentMethod === method.id
                              ? 'ring-2 ring-emerald-custom border-emerald-custom'
                              : 'hover:border-emerald-custom'
                          }`}
                          onClick={() => handleInputChange('paymentMethod', method.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl mb-2">{method.icon}</div>
                            <p className="text-sm font-poppins">{method.name}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="space-y-4 mt-6">
                        <div>
                          <Label>Número do Cartão</Label>
                          <Input placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Validade</Label>
                            <Input placeholder="MM/AA" />
                          </div>
                          <div>
                            <Label>CVV</Label>
                            <Input placeholder="123" />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-6">
                      <Button variant="outline" onClick={handlePrevStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                      </Button>
                      <Button 
                        onClick={handlePayment} 
                        disabled={isProcessing}
                        className="bg-emerald-gradient hover:opacity-90"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processando...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Finalizar Pagamento
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Checkout;

