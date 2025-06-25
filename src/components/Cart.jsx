import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import PaymentCheckout from './PaymentCheckout';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartItemsCount 
  } = useCart();

  const handleCheckout = () => {
    setIsOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <>
      {/* Botão do carrinho */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-gradient hover:opacity-90 text-white rounded-full w-16 h-16 shadow-lg relative"
        >
          <ShoppingCart className="w-6 h-6" />
          {getCartItemsCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
              {getCartItemsCount()}
            </Badge>
          )}
        </Button>
      </motion.div>

      {/* Overlay do carrinho */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Painel do carrinho */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-emerald-gradient text-white">
                  <h2 className="text-xl font-playfair font-bold">
                    Carrinho ({getCartItemsCount()})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-playfair font-semibold text-gray-600 mb-2">
                        Carrinho Vazio
                      </h3>
                      <p className="text-gray-500 font-poppins">
                        Adicione produtos ao seu carrinho para continuar
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-4">
                      {items.map((item, index) => (
                        <motion.div
                          key={`${item.id}-${item.customization}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex space-x-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-playfair font-semibold text-sm">
                                    {item.name}
                                  </h4>
                                  {item.customization && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Personalização: {item.customization}
                                    </p>
                                  )}
                                  <p className="text-emerald-custom font-poppins font-bold text-sm mt-1">
                                    {item.price}
                                  </p>
                                  
                                  {/* Controles de quantidade */}
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.customization)}
                                        className="w-8 h-8 p-0"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </Button>
                                      <span className="font-poppins font-medium text-sm w-8 text-center">
                                        {item.quantity}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.customization)}
                                        className="w-8 h-8 p-0"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </Button>
                                    </div>
                                    
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeFromCart(item.id, item.customization)}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer com total e checkout */}
                {items.length > 0 && (
                  <div className="border-t p-6 bg-gray-50">
                    <div className="space-y-4">
                      {/* Total */}
                      <div className="flex justify-between items-center">
                        <span className="font-playfair font-semibold text-lg">
                          Total:
                        </span>
                        <span className="font-playfair font-bold text-xl text-emerald-custom">
                          €{getCartTotal().toFixed(2)}
                        </span>
                      </div>

                      {/* Botões */}
                      <div className="space-y-2">
                        <Button
                          onClick={handleCheckout}
                          className="w-full bg-emerald-gradient hover:opacity-90 text-white font-poppins"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Finalizar Compra
                        </Button>
                        <Button
                          onClick={clearCart}
                          variant="outline"
                          className="w-full font-poppins"
                        >
                          Limpar Carrinho
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Componente de Checkout */}
      <PaymentCheckout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
      />
    </>
  );
};

export default Cart;

