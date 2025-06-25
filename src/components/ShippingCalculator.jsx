import React, { useState } from 'react';
import { MapPin, Calculator } from 'lucide-react';

const ShippingCalculator = ({ onShippingChange }) => {
  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingInfo, setShippingInfo] = useState('');

  // Lista de códigos postais do continente português (simplificada)
  const continentalPostalCodes = [
    // Lisboa
    '1000', '1100', '1200', '1300', '1400', '1500', '1600', '1700', '1800', '1900',
    // Porto
    '4000', '4100', '4200', '4300', '4400', '4450', '4460', '4470', '4480', '4490',
    // Coimbra
    '3000', '3030', '3040', '3050', '3060', '3070', '3080', '3090',
    // Braga
    '4700', '4710', '4715', '4720', '4730', '4740', '4750', '4760',
    // Aveiro
    '3800', '3810', '3830', '3840', '3850', '3860', '3870', '3880',
    // Setúbal
    '2900', '2910', '2920', '2930', '2940', '2950', '2960', '2970',
    // Faro
    '8000', '8005', '8100', '8125', '8150', '8200', '8300', '8400',
    // Leiria
    '2400', '2410', '2420', '2430', '2440', '2450', '2460', '2470',
    // Santarém
    '2000', '2005', '2010', '2025', '2030', '2040', '2050', '2070',
    // Évora
    '7000', '7005', '7040', '7050', '7080', '7090',
    // Beja
    '7800', '7830', '7860', '7900',
    // Viana do Castelo
    '4900', '4910', '4920', '4930', '4940', '4950', '4960', '4970',
    // Vila Real
    '5000', '5050', '5100', '5150', '5200', '5300', '5400',
    // Bragança
    '5300', '5350', '5400', '5450', '5470',
    // Guarda
    '6200', '6250', '6270', '6290', '6300', '6400',
    // Castelo Branco
    '6000', '6050', '6100', '6150', '6200', '6230', '6250',
    // Portalegre
    '7300', '7320', '7340', '7350', '7370', '7400', '7440'
  ];

  const calculateShipping = () => {
    if (!postalCode) {
      setShippingInfo('Por favor, insira um código postal');
      return;
    }

    // Remove espaços e hífens do código postal
    const cleanCode = postalCode.replace(/[\s-]/g, '');
    
    // Verifica se é um código postal válido (4 dígitos)
    if (!/^\d{4}$/.test(cleanCode)) {
      setShippingInfo('Código postal inválido. Use o formato: 1000');
      setShippingCost(0);
      onShippingChange && onShippingChange(0);
      return;
    }

    // Verifica se é do continente português
    const isContinental = continentalPostalCodes.some(code => cleanCode.startsWith(code));
    
    if (isContinental) {
      setShippingCost(0);
      setShippingInfo('Frete grátis - Portugal Continental');
      onShippingChange && onShippingChange(0);
    } else {
      // Para ilhas e outros locais
      const cost = 15.90;
      setShippingCost(cost);
      setShippingInfo('Entrega para ilhas e outros locais');
      onShippingChange && onShippingChange(cost);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center space-x-2 mb-3">
        <MapPin className="w-5 h-5 text-emerald-600" />
        <h3 className="font-semibold text-gray-800">Calcular Frete</h3>
      </div>
      
      <div className="flex space-x-2 mb-3">
        <input
          type="text"
          placeholder="Código postal (ex: 1000)"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          maxLength="4"
        />
        <button
          onClick={calculateShipping}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center space-x-1"
        >
          <Calculator className="w-4 h-4" />
          <span>Calcular</span>
        </button>
      </div>
      
      {shippingInfo && (
        <div className="text-sm">
          <p className="text-gray-600">{shippingInfo}</p>
          {shippingCost > 0 && (
            <p className="font-semibold text-emerald-600">€{shippingCost.toFixed(2)}</p>
          )}
          {shippingCost === 0 && (
            <p className="font-semibold text-green-600">Grátis!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;

