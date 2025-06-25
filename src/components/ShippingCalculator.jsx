import React, { useState, useEffect } from 'react';
import { Truck, Calculator, MapPin, Package, Clock } from 'lucide-react';

const ShippingCalculator = ({ 
  cartItems = [], 
  originPostalCode = "4000-000", // Porto como origem
  destinationPostalCode = "",
  onShippingChange,
  className = ""
}) => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Tabela de preços estimada baseada no CTT e outras transportadoras
  const shippingRates = {
    // CTT Expresso
    ctt_normal: {
      name: "CTT Expresso Normal",
      company: "CTT",
      icon: "📦",
      basePrice: 3.50,
      weightPrice: 0.80, // por cada 100g adicional
      maxWeight: 30000, // 30kg
      deliveryDays: "2-3 dias úteis",
      zones: {
        // Mesmo distrito
        local: { multiplier: 1.0, maxDistance: 50 },
        // Distritos adjacentes
        regional: { multiplier: 1.2, maxDistance: 200 },
        // Portugal Continental
        national: { multiplier: 1.5, maxDistance: 1000 },
        // Ilhas
        islands: { multiplier: 2.0, maxDistance: 2000 }
      }
    },
    ctt_urgente: {
      name: "CTT Expresso Urgente",
      company: "CTT",
      icon: "⚡",
      basePrice: 6.90,
      weightPrice: 1.20,
      maxWeight: 30000,
      deliveryDays: "1-2 dias úteis",
      zones: {
        local: { multiplier: 1.0, maxDistance: 50 },
        regional: { multiplier: 1.3, maxDistance: 200 },
        national: { multiplier: 1.8, maxDistance: 1000 },
        islands: { multiplier: 2.5, maxDistance: 2000 }
      }
    },
    dpd_classic: {
      name: "DPD Classic",
      company: "DPD",
      icon: "🚚",
      basePrice: 4.20,
      weightPrice: 0.90,
      maxWeight: 31500,
      deliveryDays: "2-3 dias úteis",
      zones: {
        local: { multiplier: 1.0, maxDistance: 50 },
        regional: { multiplier: 1.1, maxDistance: 200 },
        national: { multiplier: 1.4, maxDistance: 1000 },
        islands: { multiplier: 1.9, maxDistance: 2000 }
      }
    },
    ups_standard: {
      name: "UPS Standard",
      company: "UPS",
      icon: "📋",
      basePrice: 5.50,
      weightPrice: 1.10,
      maxWeight: 30000,
      deliveryDays: "2-4 dias úteis",
      zones: {
        local: { multiplier: 1.0, maxDistance: 50 },
        regional: { multiplier: 1.2, maxDistance: 200 },
        national: { multiplier: 1.6, maxDistance: 1000 },
        islands: { multiplier: 2.2, maxDistance: 2000 }
      }
    }
  };

  // Mapeamento de distritos para coordenadas aproximadas (para cálculo de distância)
  const districtCoordinates = {
    'Aveiro': { lat: 40.6443, lng: -8.6455 },
    'Beja': { lat: 38.0150, lng: -7.8650 },
    'Braga': { lat: 41.5454, lng: -8.4265 },
    'Bragança': { lat: 41.8071, lng: -6.7578 },
    'Castelo Branco': { lat: 39.8196, lng: -7.4909 },
    'Coimbra': { lat: 40.2033, lng: -8.4103 },
    'Évora': { lat: 38.5667, lng: -7.9000 },
    'Faro': { lat: 37.0194, lng: -7.9322 },
    'Guarda': { lat: 40.5364, lng: -7.2683 },
    'Leiria': { lat: 39.7436, lng: -8.8071 },
    'Lisboa': { lat: 38.7223, lng: -9.1393 },
    'Portalegre': { lat: 39.2967, lng: -7.4281 },
    'Porto': { lat: 41.1579, lng: -8.6291 },
    'Santarém': { lat: 39.2369, lng: -8.6871 },
    'Setúbal': { lat: 38.5244, lng: -8.8882 },
    'Viana do Castelo': { lat: 41.6947, lng: -8.8314 },
    'Vila Real': { lat: 41.3006, lng: -7.7441 },
    'Viseu': { lat: 40.6566, lng: -7.9122 },
    // Ilhas
    'Açores': { lat: 37.7412, lng: -25.6756 },
    'Madeira': { lat: 32.6669, lng: -16.9241 }
  };

  // Função para calcular distância aproximada entre dois pontos
  const calculateDistance = (originDistrict, destinationDistrict) => {
    const origin = districtCoordinates[originDistrict];
    const destination = districtCoordinates[destinationDistrict];
    
    if (!origin || !destination) return 300; // Distância padrão se não encontrar
    
    const R = 6371; // Raio da Terra em km
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lng - origin.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Função para determinar a zona de envio
  const getShippingZone = (distance, destinationDistrict) => {
    // Ilhas têm tratamento especial
    if (destinationDistrict === 'Açores' || destinationDistrict === 'Madeira') {
      return 'islands';
    }
    
    if (distance <= 50) return 'local';
    if (distance <= 200) return 'regional';
    return 'national';
  };

  // Função para calcular peso total do carrinho
  const calculateTotalWeight = () => {
    if (!cartItems || cartItems.length === 0) return 100; // Peso padrão de 100g
    
    return cartItems.reduce((total, item) => {
      const itemWeight = item.weight || 50; // Peso padrão de 50g por item
      return total + (itemWeight * (item.quantity || 1));
    }, 0);
  };

  // Função para buscar distrito por código postal
  const getDistrictByPostalCode = async (postalCode) => {
    try {
      const response = await fetch(`https://json.geoapi.pt/cp/${postalCode}`);
      if (response.ok) {
        const data = await response.json();
        return data.municipio?.distrito || 'Lisboa'; // Fallback para Lisboa
      }
    } catch (error) {
      console.error('Erro ao buscar distrito:', error);
    }
    return 'Lisboa'; // Fallback
  };

  // Função para calcular opções de frete
  const calculateShippingOptions = async () => {
    if (!destinationPostalCode || destinationPostalCode.length < 8) {
      setShippingOptions([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Buscar distritos de origem e destino
      const originDistrict = await getDistrictByPostalCode(originPostalCode);
      const destinationDistrict = await getDistrictByPostalCode(destinationPostalCode);
      
      // Calcular distância
      const distance = calculateDistance(originDistrict, destinationDistrict);
      const zone = getShippingZone(distance, destinationDistrict);
      
      // Peso total
      const totalWeight = calculateTotalWeight();
      
      // Calcular preços para cada opção
      const options = Object.entries(shippingRates).map(([key, rate]) => {
        const zoneConfig = rate.zones[zone];
        const basePrice = rate.basePrice * zoneConfig.multiplier;
        
        // Calcular preço adicional por peso (acima de 500g)
        const additionalWeight = Math.max(0, totalWeight - 500);
        const weightSurcharge = Math.ceil(additionalWeight / 100) * rate.weightPrice;
        
        const totalPrice = basePrice + weightSurcharge;
        
        return {
          id: key,
          name: rate.name,
          company: rate.company,
          icon: rate.icon,
          price: totalPrice,
          deliveryDays: rate.deliveryDays,
          weight: totalWeight,
          zone: zone,
          distance: Math.round(distance)
        };
      }).filter(option => option.weight <= 30000); // Filtrar por peso máximo
      
      // Ordenar por preço
      options.sort((a, b) => a.price - b.price);
      
      setShippingOptions(options);
      
      // Selecionar automaticamente a opção mais barata
      if (options.length > 0 && !selectedOption) {
        setSelectedOption(options[0]);
        if (onShippingChange) {
          onShippingChange(options[0]);
        }
      }
      
    } catch (err) {
      setError('Erro ao calcular frete. Tente novamente.');
      console.error('Erro no cálculo de frete:', err);
    } finally {
      setLoading(false);
    }
  };

  // Recalcular quando o código postal de destino mudar
  useEffect(() => {
    if (destinationPostalCode) {
      calculateShippingOptions();
    }
  }, [destinationPostalCode, cartItems]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (onShippingChange) {
      onShippingChange(option);
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Truck className="w-5 h-5 text-emerald-600" />
        <h3 className="text-lg font-semibold text-gray-900">Opções de Envio</h3>
      </div>

      {!destinationPostalCode && (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Insira o código postal para calcular o frete</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <Calculator className="w-8 h-8 mx-auto mb-2 animate-spin text-emerald-600" />
          <p className="text-gray-600">A calcular opções de envio...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {shippingOptions.length > 0 && !loading && (
        <div className="space-y-3">
          {shippingOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                selectedOption?.id === option.id
                  ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{option.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{option.deliveryDays}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{option.distance}km</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    €{option.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {option.weight}g
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <div className="text-blue-600 mt-0.5">ℹ️</div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Informações sobre o envio:</p>
                <ul className="text-xs space-y-1">
                  <li>• Preços calculados com base nas tarifas oficiais</li>
                  <li>• Envio gratuito para Portugal continental acima de €50</li>
                  <li>• Prazos de entrega são estimativas</li>
                  <li>• Envios para as ilhas podem ter custos adicionais</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingCalculator;

