// Serviço de Pagamento para Portugal
// Este arquivo contém as configurações e métodos para integração com APIs de pagamento portuguesas

export class PaymentService {
  constructor() {
    this.apiEndpoint = process.env.REACT_APP_PAYMENT_API_ENDPOINT || '';
    this.apiKey = process.env.REACT_APP_PAYMENT_API_KEY || '';
    this.merchantId = process.env.REACT_APP_MERCHANT_ID || '';
  }

  // Configurações para diferentes métodos de pagamento portugueses
  getPaymentMethods() {
    return [
      {
        id: 'multibanco',
        name: 'Multibanco',
        icon: '🏧',
        description: 'Pagamento por referência Multibanco',
        enabled: true,
        fees: 0.5 // percentagem
      },
      {
        id: 'mbway',
        name: 'MB WAY',
        icon: '📱',
        description: 'Pagamento instantâneo via MB WAY',
        enabled: true,
        fees: 0.3
      },
      {
        id: 'card',
        name: 'Cartão de Crédito/Débito',
        icon: '💳',
        description: 'Visa, Mastercard, American Express',
        enabled: true,
        fees: 2.9
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: '🅿️',
        description: 'Pagamento via PayPal',
        enabled: true,
        fees: 3.4
      },
      {
        id: 'bank_transfer',
        name: 'Transferência Bancária',
        icon: '🏦',
        description: 'Transferência bancária SEPA',
        enabled: true,
        fees: 0
      }
    ];
  }

  // Criar pagamento Multibanco
  async createMultibancoPayment(orderData) {
    try {
      const payload = {
        amount: orderData.amount,
        currency: 'EUR',
        order_id: orderData.orderId,
        customer: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          phone: orderData.customer.phone
        },
        description: `Pedido Esmeralda #${orderData.orderId}`,
        callback_url: `${window.location.origin}/payment/callback`,
        return_url: `${window.location.origin}/payment/success`
      };

      const response = await this.makeApiCall('/multibanco/create', payload);
      
      return {
        success: true,
        reference: response.reference,
        entity: response.entity,
        amount: response.amount,
        expiryDate: response.expiry_date,
        paymentUrl: response.payment_url
      };
    } catch (error) {
      console.error('Erro ao criar pagamento Multibanco:', error);
      return { success: false, error: error.message };
    }
  }

  // Criar pagamento MB WAY
  async createMBWayPayment(orderData, phoneNumber) {
    try {
      const payload = {
        amount: orderData.amount,
        currency: 'EUR',
        order_id: orderData.orderId,
        phone_number: phoneNumber,
        customer: {
          name: orderData.customer.name,
          email: orderData.customer.email
        },
        description: `Pedido Esmeralda #${orderData.orderId}`,
        callback_url: `${window.location.origin}/payment/callback`
      };

      const response = await this.makeApiCall('/mbway/create', payload);
      
      return {
        success: true,
        transaction_id: response.transaction_id,
        status: response.status,
        message: response.message
      };
    } catch (error) {
      console.error('Erro ao criar pagamento MB WAY:', error);
      return { success: false, error: error.message };
    }
  }

  // Processar pagamento com cartão
  async processCardPayment(orderData, cardData) {
    try {
      const payload = {
        amount: orderData.amount,
        currency: 'EUR',
        order_id: orderData.orderId,
        card: {
          number: cardData.number,
          expiry_month: cardData.expiryMonth,
          expiry_year: cardData.expiryYear,
          cvv: cardData.cvv,
          holder_name: cardData.holderName
        },
        customer: {
          name: orderData.customer.name,
          email: orderData.customer.email,
          phone: orderData.customer.phone
        },
        billing_address: orderData.billingAddress,
        description: `Pedido Esmeralda #${orderData.orderId}`,
        callback_url: `${window.location.origin}/payment/callback`,
        return_url: `${window.location.origin}/payment/success`
      };

      const response = await this.makeApiCall('/card/process', payload);
      
      return {
        success: true,
        transaction_id: response.transaction_id,
        status: response.status,
        authorization_code: response.authorization_code,
        redirect_url: response.redirect_url // Para 3D Secure se necessário
      };
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar status do pagamento
  async checkPaymentStatus(transactionId) {
    try {
      const response = await this.makeApiCall(`/payment/status/${transactionId}`, null, 'GET');
      
      return {
        success: true,
        status: response.status,
        amount: response.amount,
        paid_at: response.paid_at,
        transaction_id: response.transaction_id
      };
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      return { success: false, error: error.message };
    }
  }

  // Criar refund
  async createRefund(transactionId, amount, reason) {
    try {
      const payload = {
        transaction_id: transactionId,
        amount: amount,
        reason: reason
      };

      const response = await this.makeApiCall('/refund/create', payload);
      
      return {
        success: true,
        refund_id: response.refund_id,
        status: response.status,
        amount: response.amount
      };
    } catch (error) {
      console.error('Erro ao criar refund:', error);
      return { success: false, error: error.message };
    }
  }

  // Método auxiliar para fazer chamadas à API
  async makeApiCall(endpoint, payload, method = 'POST') {
    const url = `${this.apiEndpoint}${endpoint}`;
    
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Merchant-ID': this.merchantId
      }
    };

    if (payload && method !== 'GET') {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro na API de pagamento');
    }

    return await response.json();
  }

  // Validar dados do cartão
  validateCardData(cardData) {
    const errors = [];

    // Validar número do cartão (Luhn algorithm)
    if (!this.isValidCardNumber(cardData.number)) {
      errors.push('Número do cartão inválido');
    }

    // Validar data de expiração
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (cardData.expiryYear < currentYear || 
        (cardData.expiryYear === currentYear && cardData.expiryMonth < currentMonth)) {
      errors.push('Cartão expirado');
    }

    // Validar CVV
    if (!/^\d{3,4}$/.test(cardData.cvv)) {
      errors.push('CVV inválido');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Algoritmo de Luhn para validar número do cartão
  isValidCardNumber(cardNumber) {
    const num = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(num)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Formatar número do cartão
  formatCardNumber(value) {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  }

  // Detectar tipo de cartão
  getCardType(cardNumber) {
    const number = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(number)) return 'visa';
    if (/^5[1-5]/.test(number)) return 'mastercard';
    if (/^3[47]/.test(number)) return 'amex';
    if (/^6(?:011|5)/.test(number)) return 'discover';
    
    return 'unknown';
  }
}

// Instância singleton do serviço de pagamento
export const paymentService = new PaymentService();

