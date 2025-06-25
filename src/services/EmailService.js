// Serviço de E-mail para Confirmações de Pedido
// Este arquivo contém os métodos para envio de e-mails de confirmação

export class EmailService {
  constructor() {
    this.apiEndpoint = process.env.REACT_APP_EMAIL_SERVICE_ENDPOINT || '';
    this.apiKey = process.env.REACT_APP_EMAIL_API_KEY || '';
    this.fromEmail = process.env.REACT_APP_FROM_EMAIL || 'noreply@esmeralda.pt';
    this.supportEmail = process.env.REACT_APP_SUPPORT_EMAIL || 'suporte@esmeralda.pt';
  }

  // Enviar e-mail de confirmação de pedido
  async sendOrderConfirmation(orderData) {
    try {
      const emailData = this.prepareOrderConfirmationData(orderData);
      const htmlContent = await this.renderEmailTemplate(emailData);
      
      const payload = {
        to: orderData.customer.email,
        from: this.fromEmail,
        subject: `Confirmação de Pedido #${orderData.orderId} - Esmeralda`,
        html: htmlContent,
        text: this.generateTextVersion(emailData)
      };

      const response = await this.sendEmail(payload);
      
      return {
        success: true,
        messageId: response.messageId,
        emailSent: true
      };
    } catch (error) {
      console.error('Erro ao enviar e-mail de confirmação:', error);
      return { 
        success: false, 
        error: error.message,
        emailSent: false 
      };
    }
  }

  // Preparar dados para o template de e-mail
  prepareOrderConfirmationData(orderData) {
    const currentDate = new Date();
    
    return {
      // Informações do cliente
      customer_name: orderData.customer.name,
      customer_email: orderData.customer.email,
      
      // Informações do pedido
      order_number: orderData.orderId,
      order_date: this.formatDate(currentDate),
      order_status: this.getOrderStatus(orderData.paymentMethod),
      
      // Itens do pedido
      items: orderData.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: this.formatPrice(item.price),
        customization: item.customization || null,
        image_url: this.getItemImageUrl(item)
      })),
      
      // Totais
      subtotal: this.formatPrice(orderData.subtotal || orderData.amount - orderData.shipping.cost),
      shipping_cost: this.formatPrice(orderData.shipping.cost),
      free_shipping: orderData.shipping.cost === 0,
      discount: orderData.discount ? this.formatPrice(orderData.discount) : null,
      total: this.formatPrice(orderData.amount),
      
      // Informações de pagamento
      payment_method_name: this.getPaymentMethodName(orderData.paymentMethod),
      payment_icon: this.getPaymentMethodIcon(orderData.paymentMethod),
      payment_description: this.getPaymentMethodDescription(orderData.paymentMethod),
      
      // Referência Multibanco (se aplicável)
      multibanco_reference: orderData.multibancoReference || null,
      
      // Informações MB WAY (se aplicável)
      mbway_info: orderData.mbwayInfo || null,
      
      // Informações de envio
      shipping_address: {
        street: orderData.shipping.address.street,
        door_number: orderData.shipping.address.doorNumber,
        postal_code: orderData.shipping.address.postalCode,
        city: orderData.shipping.address.city,
        district: orderData.shipping.address.district,
        country: orderData.shipping.address.country || 'Portugal'
      },
      shipping_method: orderData.shipping.method,
      delivery_time: this.getDeliveryTime(orderData.shipping.method),
      
      // Informações gerais
      current_year: currentDate.getFullYear(),
      support_email: this.supportEmail
    };
  }

  // Renderizar template de e-mail
  async renderEmailTemplate(data) {
    try {
      // Em produção, usar uma biblioteca como Handlebars ou Mustache
      // Por agora, vamos fazer substituição simples de variáveis
      
      const templatePath = '/src/templates/order-confirmation-email.html';
      let template = await this.loadTemplate(templatePath);
      
      // Substituir variáveis simples
      template = template.replace(/\{\{customer_name\}\}/g, data.customer_name);
      template = template.replace(/\{\{order_number\}\}/g, data.order_number);
      template = template.replace(/\{\{order_date\}\}/g, data.order_date);
      template = template.replace(/\{\{order_status\}\}/g, data.order_status);
      template = template.replace(/\{\{subtotal\}\}/g, data.subtotal);
      template = template.replace(/\{\{total\}\}/g, data.total);
      template = template.replace(/\{\{payment_method_name\}\}/g, data.payment_method_name);
      template = template.replace(/\{\{payment_icon\}\}/g, data.payment_icon);
      template = template.replace(/\{\{payment_description\}\}/g, data.payment_description);
      template = template.replace(/\{\{customer_email\}\}/g, data.customer_email);
      template = template.replace(/\{\{current_year\}\}/g, data.current_year);
      template = template.replace(/\{\{shipping_method\}\}/g, data.shipping_method);
      template = template.replace(/\{\{delivery_time\}\}/g, data.delivery_time);
      
      // Renderizar itens
      template = this.renderItems(template, data.items);
      
      // Renderizar informações de envio
      template = this.renderShippingCost(template, data);
      
      // Renderizar referência Multibanco
      template = this.renderMultibancoReference(template, data.multibanco_reference);
      
      // Renderizar informações MB WAY
      template = this.renderMBWayInfo(template, data.mbway_info);
      
      return template;
    } catch (error) {
      console.error('Erro ao renderizar template:', error);
      throw new Error('Falha ao gerar e-mail');
    }
  }

  // Carregar template de e-mail
  async loadTemplate(templatePath) {
    try {
      // Em produção, carregar do sistema de arquivos ou CDN
      // Por agora, retornar template básico
      return `
        <!DOCTYPE html>
        <html>
        <head><title>Confirmação de Pedido</title></head>
        <body>
          <h1>Obrigado pela sua compra, {{customer_name}}!</h1>
          <p>Pedido: {{order_number}}</p>
          <p>Data: {{order_date}}</p>
          <p>Total: €{{total}}</p>
          <p>Método de pagamento: {{payment_method_name}}</p>
        </body>
        </html>
      `;
    } catch (error) {
      throw new Error('Não foi possível carregar o template de e-mail');
    }
  }

  // Renderizar lista de itens
  renderItems(template, items) {
    let itemsHtml = '';
    
    items.forEach(item => {
      itemsHtml += `
        <div class="item">
          <img src="${item.image_url}" alt="${item.name}" class="item-image">
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            ${item.customization ? `<div class="item-customization">${item.customization}</div>` : ''}
            <div class="item-quantity">Quantidade: ${item.quantity}</div>
          </div>
          <div class="item-price">${item.price}</div>
        </div>
      `;
    });
    
    return template.replace(/\{\{#each items\}\}.*?\{\{\\/each\}\}/gs, itemsHtml);
  }

  // Renderizar custo de envio
  renderShippingCost(template, data) {
    const shippingHtml = data.free_shipping ? 'Grátis' : `€${data.shipping_cost}`;
    return template.replace(/\{\{#if free_shipping\}\}.*?\{\{\/if\}\}/gs, shippingHtml);
  }

  // Renderizar referência Multibanco
  renderMultibancoReference(template, reference) {
    if (!reference) {
      return template.replace(/\{\{#if multibanco_reference\}\}.*?\{\{\/if\}\}/gs, '');
    }
    
    const referenceHtml = `
      <div class="multibanco-reference">
        <div style="font-weight: bold; margin-bottom: 10px; color: #3182ce;">
          Dados para Pagamento Multibanco
        </div>
        <div class="reference-row">
          <span>Entidade:</span>
          <span class="reference-value">${reference.entity}</span>
        </div>
        <div class="reference-row">
          <span>Referência:</span>
          <span class="reference-value">${reference.reference}</span>
        </div>
        <div class="reference-row">
          <span>Valor:</span>
          <span class="reference-value">€${reference.amount}</span>
        </div>
        <div class="reference-row">
          <span>Válido até:</span>
          <span>${reference.expiry_date}</span>
        </div>
      </div>
    `;
    
    return template.replace(/\{\{#if multibanco_reference\}\}.*?\{\{\/if\}\}/gs, referenceHtml);
  }

  // Renderizar informações MB WAY
  renderMBWayInfo(template, mbwayInfo) {
    if (!mbwayInfo) {
      return template.replace(/\{\{#if mbway_info\}\}.*?\{\{\/if\}\}/gs, '');
    }
    
    const mbwayHtml = `
      <div style="margin-top: 15px; padding: 15px; background-color: #f0fff4; border-radius: 6px;">
        <div style="font-weight: bold; color: #10b981; margin-bottom: 5px;">
          Pagamento MB WAY
        </div>
        <div style="font-size: 14px;">
          ${mbwayInfo.message}
        </div>
      </div>
    `;
    
    return template.replace(/\{\{#if mbway_info\}\}.*?\{\{\/if\}\}/gs, mbwayHtml);
  }

  // Gerar versão em texto simples
  generateTextVersion(data) {
    return `
Confirmação de Pedido - Esmeralda

Olá ${data.customer_name},

Obrigado pela sua compra! O seu pedido foi recebido com sucesso.

Detalhes do Pedido:
- Número: ${data.order_number}
- Data: ${data.order_date}
- Total: €${data.total}
- Método de pagamento: ${data.payment_method_name}

${data.multibanco_reference ? `
Dados para Pagamento Multibanco:
- Entidade: ${data.multibanco_reference.entity}
- Referência: ${data.multibanco_reference.reference}
- Valor: €${data.multibanco_reference.amount}
- Válido até: ${data.multibanco_reference.expiry_date}
` : ''}

Endereço de Entrega:
${data.customer_name}
${data.shipping_address.street}, ${data.shipping_address.door_number}
${data.shipping_address.postal_code} ${data.shipping_address.city}
${data.shipping_address.district}, ${data.shipping_address.country}

Se tiver alguma dúvida, contacte-nos em ${data.support_email}

Obrigado por escolher a Esmeralda!
    `.trim();
  }

  // Enviar e-mail via API
  async sendEmail(payload) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }

  // Métodos auxiliares
  formatDate(date) {
    return date.toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price) {
    if (typeof price === 'string') {
      return price.replace('€', '');
    }
    return price.toFixed(2);
  }

  getOrderStatus(paymentMethod) {
    switch (paymentMethod) {
      case 'multibanco':
        return 'Aguardando Pagamento';
      case 'mbway':
        return 'Aguardando Confirmação';
      case 'card':
        return 'Pagamento Confirmado';
      default:
        return 'Processando';
    }
  }

  getPaymentMethodName(method) {
    const methods = {
      'multibanco': 'Multibanco',
      'mbway': 'MB WAY',
      'card': 'Cartão de Crédito/Débito',
      'paypal': 'PayPal',
      'bank_transfer': 'Transferência Bancária'
    };
    return methods[method] || method;
  }

  getPaymentMethodIcon(method) {
    const icons = {
      'multibanco': '🏧',
      'mbway': '📱',
      'card': '💳',
      'paypal': '🅿️',
      'bank_transfer': '🏦'
    };
    return icons[method] || '💳';
  }

  getPaymentMethodDescription(method) {
    const descriptions = {
      'multibanco': 'Pagamento por referência Multibanco',
      'mbway': 'Pagamento instantâneo via MB WAY',
      'card': 'Pagamento com cartão de crédito/débito',
      'paypal': 'Pagamento via PayPal',
      'bank_transfer': 'Transferência bancária SEPA'
    };
    return descriptions[method] || 'Pagamento online';
  }

  getDeliveryTime(shippingMethod) {
    const times = {
      'Standard': '5-7 dias úteis',
      'Express': '2-3 dias úteis',
      'Overnight': '1 dia útil',
      'International': '10-15 dias úteis'
    };
    return times[shippingMethod] || '5-7 dias úteis';
  }

  getItemImageUrl(item) {
    // Em produção, usar URLs completas das imagens
    return item.image || 'https://via.placeholder.com/80x80?text=Produto';
  }
}

// Instância singleton do serviço de e-mail
export const emailService = new EmailService();

