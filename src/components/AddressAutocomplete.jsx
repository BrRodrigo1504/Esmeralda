import React, { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

const AddressAutocomplete = ({ 
  onAddressChange, 
  initialValues = {},
  className = "" 
}) => {
  const [postalCode, setPostalCode] = useState(initialValues.postalCode || '');
  const [street, setStreet] = useState(initialValues.street || '');
  const [city, setCity] = useState(initialValues.city || '');
  const [district, setDistrict] = useState(initialValues.district || '');
  const [doorNumber, setDoorNumber] = useState(initialValues.doorNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para formatar código postal português (XXXX-XXX)
  const formatPostalCode = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 7 dígitos
    if (numbers.length <= 7) {
      // Adiciona o hífen após o 4º dígito
      if (numbers.length > 4) {
        return numbers.slice(0, 4) + '-' + numbers.slice(4);
      }
      return numbers;
    }
    return postalCode; // Retorna o valor anterior se exceder 7 dígitos
  };

  // Função para buscar dados do código postal
  const fetchAddressData = async (code) => {
    if (!code || code.length < 8) return; // Código postal completo tem 8 caracteres (XXXX-XXX)
    
    setLoading(true);
    setError('');
    
    try {
      // Remove o hífen para a consulta na API
      const cleanCode = code.replace('-', '');
      
      // Consulta à GEO API PT
      const response = await fetch(`https://json.geoapi.pt/cp/${code}`);
      
      if (!response.ok) {
        throw new Error('Código postal não encontrado');
      }
      
      const data = await response.json();
      
      if (data && data.freguesia) {
        // Preenche os campos automaticamente
        setStreet(data.freguesia.rua || '');
        setCity(data.freguesia.localidade || data.freguesia.nome || '');
        setDistrict(data.municipio?.distrito || '');
        
        // Notifica o componente pai sobre a mudança
        if (onAddressChange) {
          onAddressChange({
            postalCode: code,
            street: data.freguesia.rua || '',
            city: data.freguesia.localidade || data.freguesia.nome || '',
            district: data.municipio?.distrito || '',
            doorNumber: doorNumber
          });
        }
      }
    } catch (err) {
      setError('Não foi possível encontrar o endereço para este código postal');
      console.error('Erro ao buscar endereço:', err);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar dados quando o código postal está completo
  useEffect(() => {
    if (postalCode.length === 8 && postalCode.includes('-')) {
      const timeoutId = setTimeout(() => {
        fetchAddressData(postalCode);
      }, 500); // Debounce de 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [postalCode]);

  // Notifica mudanças nos campos manuais
  useEffect(() => {
    if (onAddressChange) {
      onAddressChange({
        postalCode,
        street,
        city,
        district,
        doorNumber
      });
    }
  }, [street, city, district, doorNumber]);

  const handlePostalCodeChange = (e) => {
    const formatted = formatPostalCode(e.target.value);
    setPostalCode(formatted);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Código Postal */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Código Postal *
        </label>
        <div className="relative">
          <input
            type="text"
            value={postalCode}
            onChange={handlePostalCodeChange}
            placeholder="0000-000"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10"
            maxLength={8}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-emerald-500" />
          )}
          {!loading && postalCode && (
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-500" />
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Rua/Morada */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rua/Morada
        </label>
        <input
          type="text"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          placeholder="Nome da rua (preenchido automaticamente)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
          readOnly={loading}
        />
      </div>

      {/* Número da Porta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número da Porta *
        </label>
        <input
          type="text"
          value={doorNumber}
          onChange={(e) => setDoorNumber(e.target.value)}
          placeholder="Ex: 123, 45-2º Esq"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      {/* Localidade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Localidade
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Cidade/Vila (preenchido automaticamente)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
          readOnly={loading}
        />
      </div>

      {/* Distrito */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Distrito
        </label>
        <input
          type="text"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="Distrito (preenchido automaticamente)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50"
          readOnly={loading}
        />
      </div>

      <div className="text-xs text-gray-500 mt-2">
        * Campos obrigatórios. O endereço será preenchido automaticamente após inserir o código postal.
      </div>
    </div>
  );
};

export default AddressAutocomplete;

