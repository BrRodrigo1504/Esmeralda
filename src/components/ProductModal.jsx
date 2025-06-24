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
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative z-[9999]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col lg:flex-row h-full">
                {/* Imagem do produto */}
                <div className="lg:w-1/2 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 z-10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                  
                  {/* Badge da categoria */}
                  <Badge className="absolute top-4 left-4 bg-emerald-gradient text-white">
                    {product.category}
                  </Badge>
                </div>

                {/* Conteúdo - com scroll próprio */}
                <div className="lg:w-1/2 flex flex-col">
                  <div className="p-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(90vh - 2rem)' }}>
                    <div className="space-y-6">
                      {/* Header */}
                      <div>
                        <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                          {product.name}
                        </h2>
                        <p className="text-gray-600 font-poppins mb-4">
                          {product.description}
                        </p>
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-playfair font-bold text-emerald-custom">
                            {product.price}
                          </span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">(127 avaliações)</span>
                          </div>
                        </div>
                      </div>

                      {/* Opções de personalização */}
                      <div className="space-y-4">
                        <h3 className="font-playfair font-semibold text-lg">Personalização</h3>
                        
                        {/* Material */}
                        <div>
                          <Label className="font-poppins font-medium">Material</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {customizationOptions.material.map((option) => (
                              <Button
                                key={option}
                                variant={selectedOptions.material === option ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedOptions(prev => ({ ...prev, material: option }))}
                                className="font-poppins text-xs"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Corrente */}
                        <div>
                          <Label className="font-poppins font-medium">Corrente</Label>
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            {customizationOptions.chain.map((option) => (
                              <Button
                                key={option}
                                variant={selectedOptions.chain === option ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedOptions(prev => ({ ...prev, chain: option }))}
                                className="font-poppins text-xs"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Tipo de gravação */}
                        <div>
                          <Label className="font-poppins font-medium">Tipo de Gravação</Label>
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            {customizationOptions.engraving.map((option) => (
                              <Button
                                key={option}
                                variant={selectedOptions.engraving === option ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedOptions(prev => ({ ...prev, engraving: option }))}
                                className="font-poppins text-xs"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Upload de imagem */}
                        <div>
                          <Label className="font-poppins font-medium">Enviar Imagem para Gravação</Label>
                          <div className="mt-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-custom transition-colors"
                            >
                              {uploadedImage ? (
                                <img
                                  src={uploadedImage}
                                  alt="Preview"
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="text-center">
                                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-500 font-poppins">
                                    Clique para enviar uma imagem
                                  </p>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Texto personalizado */}
                        <div>
                          <Label htmlFor="customization" className="font-poppins font-medium">
                            Texto ou Instruções Especiais
                          </Label>
                          <Textarea
                            id="customization"
                            placeholder="Digite o texto que deseja gravar ou instruções especiais..."
                            value={customization}
                            onChange={(e) => setCustomization(e.target.value)}
                            className="mt-2 font-poppins"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Informações adicionais */}
                      <div className="text-xs text-gray-500 font-poppins space-y-1">
                        <p>✓ Gravação a laser de alta precisão</p>
                        <p>✓ Entrega em 5-7 dias úteis</p>
                        <p>✓ Garantia de 2 anos</p>
                        <p>✓ Embalagem premium incluída</p>
                      </div>
                    </div>
                  </div>

                  {/* Botões de ação - fixos na parte inferior */}
                  <div className="p-6 border-t bg-white">
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleAddToCart}
                        className="flex-1 bg-emerald-gradient hover:opacity-90 text-white font-poppins"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-emerald-custom text-emerald-custom hover:bg-emerald-custom hover:text-white"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
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

