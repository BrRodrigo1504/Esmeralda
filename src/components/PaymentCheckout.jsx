import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, MapPin, User, Mail, Phone, Lock, X, Check, Shield, Smartphone, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCart } from '@/contexts/CartContext';
import AddressAutocomplete from './AddressAutocomplete';
import ShippingCalculator from './ShippingCalculator';
import { paymentService } from '@/services/PaymentService';

const PaymentCheckout = ({ isOpen, onClose }) => {
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
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Portugal',
    paymentMethod: 'multibanco'
  });
  const [cardData, setCardData] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: ''
  });
  const [mbwayPhone, setMbwayPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [multibancoReference, setMultibancoReference] = useState(null);
  const [mbwayStatus, setMbwayStatus] = useState(null);

  const { items, getCartTotal, clearCart } = useCart();

  const handleAddressChange = (address) => {
    setShippingAddress(address);
    setFormData(prev => ({
      ...prev,
      address: `${address.street}, ${address.doorNumber}`,
      city: address.city,
      postalCode: address.postalCode
    }));
  };

  const handleShippingChange = (shipping) => {
    setSelectedShipping(shipping);
    setShippingCost(shipping ? shipping.price : 0);
  };

  const subtotal = getCartTotal();
  const finalShippingCost = subtotal >= 50 && selectedShipping?.zone !== 'islands' ? 0 : shippingCost;
  const finalTotal = subtotal + finalShippingCost;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCardInputChange = (field, value) => {
    if (field === 'number') {
      value = paymentService.formatCardNumber(value);
    }
    setCardData(prev => ({ ...prev, [field]: value }));
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

  const generateOrderId = () => {
    return `ESM${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const prepareOrderData = () => {
    const orderId = generateOrderId();
    return {
      orderId,
      amount: finalTotal,
      currency: 'EUR',
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
      },
      billingAddress: {
        street: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country
      },
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price.replace('€', '')),
        customization: item.customization
      })),
      shipping: {
        cost: finalShippingCost,
        method: selectedShipping?.name || 'Standard',
        address: shippingAddress
      }
    };
  };

  const handleMultibancoPayment = async (orderData) => {
    try {
      const result = await paymentService.createMultibancoPayment(orderData);
      
      if (result.success) {
        setMultibancoReference({
          entity: result.entity,
          reference: result.reference,
          amount: result.amount,
          expiryDate: result.expiryDate
        });
        setPaymentResult(result);
        setOrderComplete(true);
        clearCart();
      } else {
        setPaymentError(result.error);
      }
    } catch (error) {
      setPaymentError('Erro ao processar pagamento Multibanco');
    }
  };

  const handleMBWayPayment = async (orderData) => {
    try {
      const result = await paymentService.createMBWayPayment(orderData, mbwayPhone);
      
      if (result.success) {
        setMbwayStatus({
          transactionId: result.transaction_id,
          status: result.status,
          message: result.message
        });
        
        // Simular verificação de status (em produção, usar polling ou webhooks)
        setTimeout(async () => {
          const statusCheck = await paymentService.checkPaymentStatus(result.transaction_id);
          if (statusCheck.success && statusCheck.status === 'paid') {
            setPaymentResult(statusCheck);
            setOrderComplete(true);
            clearCart();
          }
        }, 10000); // Verificar após 10 segundos
        
      } else {
        setPaymentError(result.error);
      }
    } catch (error) {
      setPaymentError('Erro ao processar pagamento MB WAY');
    }
  };

  const handleCardPayment = async (orderData) => {
    try {
      // Validar dados do cartão
      const validation = paymentService.validateCardData(cardData);
      if (!validation.isValid) {
        setPaymentError(validation.errors.join(', '));
        return;
      }

      const result = await paymentService.processCardPayment(orderData, cardData);
      
      if (result.success) {
        if (result.redirect_url) {
          // Redirecionar para 3D Secure se necessário
          window.location.href = result.redirect_url;
        } else {
          setPaymentResult(result);
          setOrderComplete(true);
          clearCart();
        }
      } else {
        setPaymentError(result.error);
      }
    } catch (error) {
      setPaymentError('Erro ao processar pagamento com cartão');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);
    
    const orderData = prepareOrderData();
    
    try {
      switch (formData.paymentMethod) {
        case 'multibanco':
          await handleMultibancoPayment(orderData);
          break;
        case 'mbway':
          await handleMBWayPayment(orderData);
          break;
        case 'card':
          await handleCardPayment(orderData);
          break;
        case 'paypal':
          // Implementar integração PayPal
          setPaymentError('PayPal ainda não implementado');
          break;
        case 'bank_transfer':
          // Implementar transferência bancária
          setPaymentError('Transferência bancária ainda não implementada');
          break;
        default:
          setPaymentError('Método de pagamento não suportado');
      }
    } catch (error) {
      setPaymentError('Erro inesperado ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const paymentMethods = paymentService.getPaymentMethods().filter(method => method.enabled);

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
                {formData.paymentMethod === 'multibanco' ? 'Referência Gerada!' : 'Pedido Confirmado!'}
              </h2>
              
              {/* Mostrar referência Multibanco */}
              {multibancoReference && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Dados para Pagamento Multibanco
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Entidade:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-lg">{multibancoReference.entity}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(multibancoReference.entity)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Referência:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-lg">{multibancoReference.reference}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(multibancoReference.reference)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Valor:</span>
                      <span className="font-bold text-lg">€{multibancoReference.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Válido até:</span>
                      <span className="font-medium">{multibancoReference.expiryDate}</span>
                    </div>
                  </div>
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Use estes dados para pagar em qualquer caixa Multibanco ou homebanking.
                      O seu pedido será processado automaticamente após o pagamento.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Status MB WAY */}
              {mbwayStatus && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Pagamento MB WAY
                  </h3>
                  <p className="text-green-700">{mbwayStatus.message}</p>
                  <p className="text-sm text-green-600 mt-2">
                    Verifique o seu telemóvel para confirmar o pagamento.
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 font-poppins">
                  Número do pedido: <span className="font-semibold">{paymentResult?.transaction_id || `#ESM${Date.now()}`}</span>
                </p>
                <p className="text-sm text-gray-600 font-poppins">
                  Receberá um email de confirmação em: <span className="font-semibold">{formData.email}</span>
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
                  {/* Mostrar erro de pagamento */}
                  {paymentError && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        {paymentError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Passo 1: Informações pessoais */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="font-playfair font-semibold text-lg mb-4">Informações Pessoais</h3>
                      
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="seu@email.com"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Nome *</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="João"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Sobrenome *</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Silva"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="910 123 456"
                          required
                        />
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button 
                          onClick={handleNextStep} 
                          className="bg-emerald-gradient hover:opacity-90"
                          disabled={!formData.email || !formData.firstName || !formData.lastName || !formData.phone}
                        >
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
                              <p className="text-xs text-gray-500 mt-1">{method.description}</p>
                              {method.fees > 0 && (
                                <Badge variant="secondary" className="mt-2 text-xs">
                                  Taxa: {method.fees}%
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {/* Formulário de cartão de crédito */}
                      {formData.paymentMethod === 'card' && (
                        <div className="space-y-4 mt-6">
                          <div>
                            <Label>Número do Cartão *</Label>
                            <Input 
                              placeholder="1234 5678 9012 3456"
                              value={cardData.number}
                              onChange={(e) => handleCardInputChange('number', e.target.value)}
                              maxLength={19}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label>Mês *</Label>
                              <Input 
                                placeholder="MM"
                                value={cardData.expiryMonth}
                                onChange={(e) => handleCardInputChange('expiryMonth', e.target.value)}
                                maxLength={2}
                              />
                            </div>
                            <div>
                              <Label>Ano *</Label>
                              <Input 
                                placeholder="AA"
                                value={cardData.expiryYear}
                                onChange={(e) => handleCardInputChange('expiryYear', e.target.value)}
                                maxLength={2}
                              />
                            </div>
                            <div>
                              <Label>CVV *</Label>
                              <Input 
                                placeholder="123"
                                value={cardData.cvv}
                                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                                maxLength={4}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Nome no Cartão *</Label>
                            <Input 
                              placeholder="João Silva"
                              value={cardData.holderName}
                              onChange={(e) => handleCardInputChange('holderName', e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      {/* Campo de telefone para MB WAY */}
                      {formData.paymentMethod === 'mbway' && (
                        <div className="mt-6">
                          <Label>Número de Telemóvel MB WAY *</Label>
                          <Input 
                            placeholder="910 123 456"
                            value={mbwayPhone}
                            onChange={(e) => setMbwayPhone(e.target.value)}
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Receberá uma notificação no seu telemóvel para confirmar o pagamento.
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between pt-6">
                        <Button variant="outline" onClick={handlePrevStep}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Voltar
                        </Button>
                        <Button 
                          onClick={handlePayment} 
                          className="bg-emerald-gradient hover:opacity-90"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processando...
                            </>
                          ) : (
                            `Pagar €${finalTotal.toFixed(2)}`
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

export default PaymentCheckout;

