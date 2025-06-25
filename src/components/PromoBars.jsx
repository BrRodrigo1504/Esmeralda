import React from 'react';
import { Truck, Gift } from 'lucide-react';

const PromoBars = () => {
  return (
    <div className="w-full">
      {/* Barra de Frete Grátis */}
      <div className="bg-[#7A8C89] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-sm font-poppins">
          <Truck className="w-4 h-4" />
          <span>Frete grátis Portugal continental</span>
        </div>
      </div>
      
      {/* Barra de Brinde */}
      <div className="bg-[#d6d6d6] text-gray-800 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-sm font-poppins">
          <Gift className="w-4 h-4" />
          <span>Brinde grátis para os 10 primeiros pedidos!</span>
        </div>
      </div>
    </div>
  );
};

export default PromoBars;

