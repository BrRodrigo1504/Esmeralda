import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, MapPin, User, Mail, Phone, Lock, X, Check, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import AddressAutocomplete from './AddressAutocomplete';
import ShippingCalculator from './ShippingCalculator';

const Checkout = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    postalCode: '',
    street: '',
    city: '',
    district: '',
    doorNumber: ''
  });
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
  const [mbwayProcessing, setMbwayProcessing] = useState(false);
  const [mbwayConfirmed, setMbwayConfirmed] = useState(false);
  const [multibancoData, setMultibancoData] = useState(null);

  const { items, getCartTotal, clearCart } = useCart();

  // Número de telefone MBWay configurado
  const MBWAY_PHONE_NUMBER = '910187321';

  const sendPurchaseEmail = async () => {
    try {
      const orderData = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email
        },
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization || ''
        })),
        total: finalTotal,
        shipping_cost: finalShippingCost,
        discount: 0,
        shipping_address: {
          street: shippingAddress.street,
          door_number: shippingAddress.doorNumber,
          postal_code: shippingAddress.postalCode,
          city: shippingAddress.city,
          district: shippingAddress.district,
          country: 'Portugal'
        },
        payment_method: formData.paymentMethod
      };

      const response = await fetch('http://localhost:5000/api/email/send-order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Email enviado com sucesso!', result);
        // Armazenar dados do Multibanco se necessário
        if (result.multibanco_reference) {
          setMultibancoData(result.multibanco_reference);
        }
      } else {
        console.error('Erro ao enviar email:', result.error);
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    }
  };

  const handleAddressChange = (address) => {
    setShippingAddress(address);
  };

  const handleShippingChange = (shipping) => {
    setSelectedShipping(shipping);
    setShippingCost(shipping ? shipping.price : 0);
  };

  const subtotal = getCartTotal();
  // Aplicar frete grátis para pedidos acima de €50 em Portugal continental
  const finalShippingCost = subtotal >= 50 && selectedShipping?.zone !== 'islands' ? 0 : shippingCost;
  const finalTotal = subtotal + finalShippingCost;

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

  const handleMBWayPayment = async () => {
    setMbwayProcessing(true);
    
    // Simular envio de pedido MBWay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setMbwayProcessing(false);
    setMbwayConfirmed(true);
    
    // Aguardar confirmação do usuário (simulado)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Enviar email de confirmação de compra
    await sendPurchaseEmail();
    
    setIsProcessing(false);
    setOrderComplete(true);
    clearCart();
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simular processamento de pagamento para todos os métodos
    // Aqui você pode integrar com uma plataforma de pagamento real no futuro
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enviar email de confirmação de compra
    await sendPurchaseEmail();
    
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
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
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
              {multibancoData && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                  <p className="font-semibold text-blue-800 mb-2">Dados para Pagamento Multibanco:</p>
                  <p className="text-sm text-blue-700">Entidade: <span className="font-mono font-bold">{multibancoData.entity}</span></p>
                  <p className="text-sm text-blue-700">Referência: <span className="font-mono font-bold">{multibancoData.reference}</span></p>
                  <p className="text-sm text-blue-700">Valor: <span className="font-mono font-bold">€{multibancoData.amount}</span></p>
                  <p className="text-sm text-blue-700">Válido até: <span className="font-mono font-bold">{multibancoData.expiry_date}</span></p>
                  <p className="text-xs text-blue-600 mt-2">Use estes dados para pagar em qualquer caixa Multibanco ou homebanking.</p>
                </div>
              )}
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
            <div className="flex flex-col lg:flex-row h-full min-h-0">
              {/* Resumo do pedido */}
              <div className="lg:w-2/5 bg-gray-50 p-6 border-r flex-shrink-0 overflow-y-auto">
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
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envio:</span>
                    <span>
                      {finalShippingCost === 0 ? (
                        <span className="text-emerald-600 font-medium">Grátis</span>
                      ) : (
                        `€${finalShippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {subtotal >= 50 && selectedShipping?.zone !== 'islands' && shippingCost > 0 && (
                    <div className="flex justify-between text-xs text-emerald-600">
                      <span>Desconto frete grátis:</span>
                      <span>-€{shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-playfair font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-emerald-custom">€{finalTotal.toFixed(2)}</span>
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
              <div className="lg:w-3/5 flex flex-col min-h-0">
                <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
                  <h2 className="text-2xl font-playfair font-bold">Finalizar Compra</h2>
                  <Button variant="ghost" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Indicador de passos */}
                <div className="flex items-center justify-center py-6 border-b flex-shrink-0">
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

                {/* Conteúdo do formulário com scroll */}
                <div className="flex-1 overflow-y-auto p-6">
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
                      className="space-y-6"
                    >
                      <AddressAutocomplete
                        onAddressChange={handleAddressChange}
                        initialValues={shippingAddress}
                      />

                      {shippingAddress.postalCode && (
                        <ShippingCalculator
                          cartItems={items}
                          destinationPostalCode={shippingAddress.postalCode}
                          onShippingChange={handleShippingChange}
                          className="mt-6"
                        />
                      )}

                      <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={handlePrevStep}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Voltar
                        </Button>
                        <Button 
                          onClick={handleNextStep} 
                          className="bg-emerald-gradient hover:opacity-90"
                          disabled={!shippingAddress.postalCode || !shippingAddress.doorNumber}
                        >
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

                      {/* Formulário de cartão de crédito */}
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

                      {/* Informações do MBWay */}
                      {formData.paymentMethod === 'mbway' && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Smartphone className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-900">Pagamento MB WAY</h4>
                              <p className="text-sm text-blue-700">Pagamento rápido e seguro</p>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Número de telefone:</span>
                              <span className="font-mono text-lg font-bold text-blue-600">{MBWAY_PHONE_NUMBER}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-medium text-gray-700">Valor a pagar:</span>
                              <span className="text-lg font-bold text-emerald-600">€{finalTotal.toFixed(2)}</span>
                            </div>
                          </div>

                          {mbwayProcessing && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                                <span className="text-sm text-yellow-800">Enviando pedido MB WAY...</span>
                              </div>
                            </div>
                          )}

                          {mbwayConfirmed && !orderComplete && (
                            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-800">
                                  Pedido enviado! Confirme o pagamento na sua app MB WAY.
                                </span>
                              </div>
                            </div>
                          )}

                          <p className="text-xs text-blue-600 mt-3">
                            Após clicar em "Finalizar Pedido", receberá uma notificação na sua app MB WAY para confirmar o pagamento.
                          </p>
                        </div>
                      )}

                      {/* Informações do Multibanco */}
                      {formData.paymentMethod === 'multibanco' && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Referência Multibanco</h4>
                              <p className="text-sm text-gray-700">Pague em qualquer terminal ou homebanking</p>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <p className="text-sm text-gray-600 mb-2">
                              Após confirmar o pedido, receberá uma referência Multibanco por email.
                            </p>
                            <div className="text-sm text-gray-500">
                              Valor: <span className="font-bold text-emerald-600">€{finalTotal.toFixed(2)}</span>
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
                            'Finalizar Pedido'
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Checkout;

