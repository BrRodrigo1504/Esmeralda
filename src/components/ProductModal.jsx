import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';

const ProductModal = ({ product, isOpen, onClose }) => {
  const [customization, setCustomization] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    material: 'Ouro 18k',
    chain: 'Corrente Dourada 45cm',
    engraving: 'Gravação Padrão'
  });
  const { addToCart } = useCart();

  // Bloquear scroll da página quando modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup quando componente for desmontado
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    const customizedProduct = {
      ...product,
      customization: customization || 'Sem personalização',
      selectedOptions,
      uploadedImage
    };
    
    addToCart(customizedProduct, customization);
    onClose();
    
    // Feedback visual
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] font-poppins';
    notification.textContent = 'Produto adicionado ao carrinho!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 3000);
  };

  const customizationOptions = {
    material: ['Ouro 18k', 'Prata 925', 'Ouro Rosé', 'Aço Inoxidável'],
    chain: ['Corrente Dourada 45cm', 'Corrente Dourada 50cm', 'Corrente Prata 45cm', 'Corrente Prata 50cm'],
    engraving: ['Gravação Padrão', 'Gravação Premium', 'Gravação Colorida']
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[9998] flex items-center justify-center p-4"
            onClick={onClose}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header fixo */}
              <div className="flex-shrink-0 p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-100 text-emerald-800 font-poppins">
                    {product.category}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Conteúdo com scroll */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Imagem do produto */}
                  <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {uploadedImage && (
                      <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={uploadedImage}
                          alt="Imagem para gravação"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Informações e personalização */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                        {product.name}
                      </h2>
                      <p className="text-gray-600 font-poppins mb-4">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 font-poppins">
                          (127 avaliações)
                        </span>
                      </div>

                      <div className="text-3xl font-playfair font-bold text-emerald-custom mb-6">
                        A partir de {product.price}
                      </div>
                    </div>

                    {/* Personalização */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-playfair font-semibold">Personalização</h3>
                      
                      {/* Material */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Material
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {customizationOptions.material.map((option) => (
                            <Button
                              key={option}
                              variant={selectedOptions.material === option ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedOptions(prev => ({ ...prev, material: option }))}
                              className={`text-xs ${selectedOptions.material === option ? 'bg-emerald-custom hover:bg-emerald-custom/90' : ''}`}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Corrente */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Corrente
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {customizationOptions.chain.map((option) => (
                            <Button
                              key={option}
                              variant={selectedOptions.chain === option ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedOptions(prev => ({ ...prev, chain: option }))}
                              className={`text-xs ${selectedOptions.chain === option ? 'bg-emerald-custom hover:bg-emerald-custom/90' : ''}`}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Tipo de Gravação */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Tipo de Gravação
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          {customizationOptions.engraving.map((option) => (
                            <Button
                              key={option}
                              variant={selectedOptions.engraving === option ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedOptions(prev => ({ ...prev, engraving: option }))}
                              className={`text-xs ${selectedOptions.engraving === option ? 'bg-emerald-custom hover:bg-emerald-custom/90' : ''}`}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Upload de Imagem */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Enviar Imagem para Gravação
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-custom transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-600">
                              Clique para enviar uma imagem
                            </span>
                          </Label>
                        </div>
                      </div>

                      {/* Texto de personalização */}
                      <div>
                        <Label htmlFor="customization" className="text-sm font-medium text-gray-700 mb-2 block">
                          Texto ou Instruções Especiais
                        </Label>
                        <Textarea
                          id="customization"
                          placeholder="Descreva como gostaria que fosse a personalização..."
                          value={customization}
                          onChange={(e) => setCustomization(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer fixo */}
              <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-emerald-custom text-emerald-custom hover:bg-emerald-50"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favoritar
                  </Button>
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-emerald-gradient hover:opacity-90 text-white"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;

