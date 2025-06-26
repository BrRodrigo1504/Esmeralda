import jsPDF from 'jspdf';

export const generateInvoicePDF = (orderData) => {
  const doc = new jsPDF();
  
  // Cores do site Esmeralda
  const primaryColor = [0, 128, 96]; // Verde esmeralda
  const secondaryColor = [245, 245, 245]; // Cinza claro
  const textColor = [51, 51, 51]; // Cinza escuro
  
  // Cabeçalho da empresa
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('💎 ESMERALDA', 20, 25);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Bijuterias Personalizadas com Gravação a Laser', 20, 32);
  
  // Título da fatura
  doc.setTextColor(...textColor);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('FATURA', 150, 25);
  
  // Informações da fatura
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fatura Nº: ${orderData.orderNumber}`, 150, 32);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-PT')}`, 150, 37);
  
  // Dados da empresa
  let yPos = 55;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DA EMPRESA:', 20, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPos += 8;
  doc.text('Esmeralda - Bijuterias Personalizadas', 20, yPos);
  yPos += 5;
  doc.text('Porto, Portugal', 20, yPos);
  yPos += 5;
  doc.text('Email: contato@esmeralda.pt', 20, yPos);
  yPos += 5;
  doc.text('Telefone: +351 939 053 105', 20, yPos);
  
  // Dados do cliente
  yPos = 55;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO CLIENTE:', 110, yPos);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPos += 8;
  doc.text(`${orderData.customerName}`, 110, yPos);
  yPos += 5;
  doc.text(`${orderData.customerEmail}`, 110, yPos);
  yPos += 5;
  doc.text(`${orderData.shippingAddress}`, 110, yPos);
  
  // Linha separadora
  yPos += 15;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  
  // Cabeçalho da tabela de itens
  yPos += 10;
  doc.setFillColor(...secondaryColor);
  doc.rect(20, yPos, 170, 8, 'F');
  
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIÇÃO', 25, yPos + 5);
  doc.text('QTD', 140, yPos + 5);
  doc.text('PREÇO', 160, yPos + 5);
  doc.text('TOTAL', 180, yPos + 5);
  
  // Itens do pedido
  yPos += 12;
  doc.setFont('helvetica', 'normal');
  
  orderData.items.forEach((item, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 30;
    }
    
    doc.text(item.name, 25, yPos);
    if (item.customization) {
      yPos += 4;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Personalização: ${item.customization}`, 25, yPos);
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      yPos += 4;
    }
    
    doc.text(item.quantity.toString(), 145, yPos);
    doc.text(`€${item.price}`, 160, yPos);
    doc.text(`€${(parseFloat(item.price.replace('€', '')) * item.quantity).toFixed(2)}`, 180, yPos);
    
    yPos += 8;
  });
  
  // Linha separadora
  yPos += 5;
  doc.line(20, yPos, 190, yPos);
  
  // Totais
  yPos += 10;
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', 140, yPos);
  doc.text(`€${orderData.subtotal}`, 180, yPos);
  
  yPos += 6;
  doc.text('Frete:', 140, yPos);
  doc.text(orderData.shipping === '0.00' ? 'Grátis' : `€${orderData.shipping}`, 180, yPos);
  
  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', 140, yPos);
  doc.text(`€${orderData.total}`, 180, yPos);
  
  // Informações de pagamento (se Multibanco)
  if (orderData.paymentMethod === 'multibanco') {
    yPos += 20;
    doc.setFillColor(255, 248, 220); // Amarelo claro
    doc.rect(20, yPos - 5, 170, 35, 'F');
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('💳 DADOS PARA PAGAMENTO - MULTIBANCO', 25, yPos + 2);
    
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    yPos += 8;
    doc.text(`Entidade: 12345`, 25, yPos);
    yPos += 5;
    doc.text(`Referência: ${orderData.multibancoRef}`, 25, yPos);
    yPos += 5;
    doc.text(`Valor: €${orderData.total}`, 25, yPos);
    yPos += 5;
    doc.text('Validade: 3 dias', 25, yPos);
    yPos += 8;
    doc.setFont('helvetica', 'italic');
    doc.text('Após o pagamento, o seu pedido será processado automaticamente.', 25, yPos);
  }
  
  // Rodapé
  yPos = 280;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Obrigado pela sua compra! Para dúvidas, contacte-nos através de contato@esmeralda.pt', 20, yPos);
  doc.text('Esta fatura foi gerada automaticamente pelo sistema da Esmeralda.', 20, yPos + 4);
  
  return doc;
};

export const generateMultibancoReference = () => {
  // Gerar referência fictícia para Multibanco
  const timestamp = Date.now().toString();
  const ref = timestamp.slice(-9); // Últimos 9 dígitos
  return `${ref.slice(0, 3)} ${ref.slice(3, 6)} ${ref.slice(6, 9)}`;
};

