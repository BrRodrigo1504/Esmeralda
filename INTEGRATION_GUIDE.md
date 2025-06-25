# Guia de Integração de Pagamentos Portugueses - Esmeralda

## Visão Geral

Este documento fornece instruções detalhadas para integrar APIs de pagamento portuguesas no site da Esmeralda. O sistema foi preparado para suportar os principais métodos de pagamento utilizados em Portugal.

## Métodos de Pagamento Suportados

### 1. Multibanco
- **Descrição**: Pagamento por referência Multibanco
- **Taxa**: 0.5%
- **Tempo de processamento**: Instantâneo após pagamento
- **Vantagens**: Método mais popular em Portugal, sem necessidade de cartão

### 2. MB WAY
- **Descrição**: Pagamento instantâneo via aplicação móvel
- **Taxa**: 0.3%
- **Tempo de processamento**: Instantâneo
- **Vantagens**: Rápido e conveniente para utilizadores móveis

### 3. Cartão de Crédito/Débito
- **Descrição**: Visa, Mastercard, American Express
- **Taxa**: 2.9%
- **Tempo de processamento**: Instantâneo
- **Vantagens**: Aceite internacionalmente

### 4. PayPal
- **Descrição**: Pagamento via conta PayPal
- **Taxa**: 3.4%
- **Tempo de processamento**: Instantâneo
- **Vantagens**: Confiança internacional, proteção ao comprador

### 5. Transferência Bancária
- **Descrição**: Transferência bancária SEPA
- **Taxa**: 0%
- **Tempo de processamento**: 1-3 dias úteis
- **Vantagens**: Sem taxas, ideal para valores elevados

## Fornecedores de API Recomendados

### 1. SIBS API Market (Recomendado)
- **Website**: https://developer.sibsapimarket.com/
- **Vantagens**: 
  - Líder de mercado em Portugal
  - Suporte completo para Multibanco e MB WAY
  - Documentação em português
  - Suporte técnico local
- **Configuração**:
  ```env
  REACT_APP_SIBS_API_ENDPOINT=https://api.sibsapimarket.com/gateway
  REACT_APP_SIBS_API_KEY=your_api_key
  REACT_APP_SIBS_MERCHANT_ID=your_merchant_id
  ```

### 2. Eupago (Alternativa)
- **Website**: https://www.eupago.pt/
- **Vantagens**:
  - Foco no mercado português
  - Integração simples
  - Preços competitivos
- **Configuração**:
  ```env
  REACT_APP_EUPAGO_API_ENDPOINT=https://api.eupago.pt
  REACT_APP_EUPAGO_API_KEY=your_api_key
  REACT_APP_EUPAGO_MERCHANT_ID=your_merchant_id
  ```

### 3. myPOS Checkout
- **Website**: https://www.mypos.com/pt-pt/
- **Vantagens**:
  - Solução completa de pagamentos
  - Suporte para múltiplos países
  - Interface moderna
- **Configuração**:
  ```env
  REACT_APP_MYPOS_API_ENDPOINT=https://api.mypos.com
  REACT_APP_MYPOS_API_KEY=your_api_key
  REACT_APP_MYPOS_MERCHANT_ID=your_merchant_id
  ```

## Configuração do Ambiente

### 1. Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env.local` e preencha com suas credenciais:

```bash
cp .env.example .env.local
```

### 2. Configurações Obrigatórias
```env
# Ambiente (development/production)
REACT_APP_ENVIRONMENT=development

# URL do site
REACT_APP_SITE_URL=https://seu-dominio.com

# Configurações da API escolhida
REACT_APP_PAYMENT_API_ENDPOINT=https://api.provider.com
REACT_APP_PAYMENT_API_KEY=your_api_key_here
REACT_APP_MERCHANT_ID=your_merchant_id_here

# Configurações de e-mail
REACT_APP_EMAIL_SERVICE_ENDPOINT=your_email_service
REACT_APP_FROM_EMAIL=noreply@esmeralda.pt
REACT_APP_SUPPORT_EMAIL=suporte@esmeralda.pt
```

## Implementação

### 1. Serviço de Pagamento
O arquivo `src/services/PaymentService.js` contém toda a lógica de integração:

```javascript
import { paymentService } from '@/services/PaymentService';

// Criar pagamento Multibanco
const result = await paymentService.createMultibancoPayment(orderData);

// Criar pagamento MB WAY
const result = await paymentService.createMBWayPayment(orderData, phoneNumber);

// Processar pagamento com cartão
const result = await paymentService.processCardPayment(orderData, cardData);
```

### 2. Componente de Checkout
O componente `PaymentCheckout.jsx` foi atualizado para suportar todos os métodos de pagamento portugueses.

### 3. Serviço de E-mail
O arquivo `src/services/EmailService.js` gere o envio de confirmações de pedido:

```javascript
import { emailService } from '@/services/EmailService';

// Enviar confirmação de pedido
const result = await emailService.sendOrderConfirmation(orderData);
```

## Fluxo de Pagamento

### Multibanco
1. Cliente seleciona Multibanco
2. Sistema gera referência de pagamento
3. Cliente recebe e-mail com dados (Entidade, Referência, Valor)
4. Cliente paga em caixa Multibanco ou homebanking
5. Sistema recebe notificação automática
6. Pedido é processado

### MB WAY
1. Cliente seleciona MB WAY e insere número de telemóvel
2. Sistema envia pedido de pagamento
3. Cliente recebe notificação no telemóvel
4. Cliente confirma pagamento na app MB WAY
5. Sistema recebe confirmação instantânea
6. Pedido é processado

### Cartão de Crédito/Débito
1. Cliente insere dados do cartão
2. Sistema valida dados localmente
3. Dados são enviados para processamento seguro
4. Se necessário, redireciona para 3D Secure
5. Pagamento é processado instantaneamente
6. Pedido é confirmado

## Segurança

### 1. Validação de Dados
- Validação de cartão usando algoritmo de Luhn
- Verificação de data de expiração
- Validação de CVV
- Sanitização de inputs

### 2. Encriptação
- Dados sensíveis nunca armazenados localmente
- Comunicação via HTTPS obrigatória
- Tokens de API protegidos

### 3. Compliance
- PCI DSS compliance para dados de cartão
- GDPR compliance para dados pessoais
- Webhooks com verificação de assinatura

## Webhooks

### Configuração
Configure os webhooks para receber notificações de pagamento:

```env
REACT_APP_WEBHOOK_URL=https://seu-dominio.com/api/webhooks/payment
REACT_APP_WEBHOOK_SECRET=your_webhook_secret
```

### Endpoints Necessários
- `POST /api/webhooks/payment` - Notificações de pagamento
- `POST /api/webhooks/refund` - Notificações de reembolso

## Testes

### Dados de Teste
Use os seguintes dados para testes em ambiente sandbox:

```env
# Cartão de teste
REACT_APP_TEST_CARD_NUMBER=4111111111111111
REACT_APP_TEST_CARD_EXPIRY=12/25
REACT_APP_TEST_CARD_CVV=123

# MB WAY de teste
REACT_APP_TEST_MBWAY_PHONE=910000000
```

### Cenários de Teste
1. Pagamento Multibanco bem-sucedido
2. Pagamento MB WAY bem-sucedido
3. Pagamento com cartão bem-sucedido
4. Pagamento com cartão rejeitado
5. Timeout de pagamento
6. Reembolso parcial/total

## Monitorização

### Logs
- Todos os pagamentos são registados
- Erros são capturados e reportados
- Métricas de conversão são recolhidas

### Alertas
Configure alertas para:
- Falhas de pagamento acima de 5%
- Timeouts de API
- Webhooks falhados

## Suporte

### Documentação das APIs
- **SIBS**: https://developer.sibsapimarket.com/docs
- **Eupago**: https://www.eupago.pt/api/
- **myPOS**: https://developers.mypos.com/

### Contactos de Suporte
- **SIBS**: suporte@sibs.com
- **Eupago**: suporte@eupago.pt
- **myPOS**: support@mypos.com

## Próximos Passos

1. **Escolher fornecedor de API** baseado nas necessidades específicas
2. **Criar conta de teste** no fornecedor escolhido
3. **Configurar variáveis de ambiente** com credenciais de teste
4. **Testar integração** em ambiente de desenvolvimento
5. **Implementar webhooks** para notificações automáticas
6. **Configurar monitorização** e alertas
7. **Fazer testes completos** antes de ir para produção
8. **Obter credenciais de produção** e fazer deploy

## Considerações Legais

### Requisitos em Portugal
- **NIF**: Obrigatório para faturação
- **Livro de Reclamações**: Link obrigatório no site
- **Política de Privacidade**: Conforme GDPR
- **Termos e Condições**: Claros e acessíveis
- **Direito de Retratação**: 14 dias para produtos online

### Faturação
- Emissão de fatura obrigatória
- Comunicação à AT (Autoridade Tributária)
- Arquivo digital obrigatório por 10 anos

Este guia fornece uma base sólida para implementar pagamentos portugueses no site da Esmeralda. Para questões específicas, consulte a documentação do fornecedor escolhido ou contacte o suporte técnico.

