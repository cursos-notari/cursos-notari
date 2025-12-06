// interface para o objeto aninhado 'amount'
interface ChargeAmount {
  // valor a ser cobrado em centavos.
  value: number; 
  // código de moeda iso de três letras.
  currency: 'brl'; 
}

// interface para o objeto aninhado 'summary'
interface ChargeSummary {
  // valor total da cobrança.
  total: number;
  // valor que foi pago na cobrança.
  paid: number;
  // valor que foi devolvido da cobrança.
  refunded: number;
}

// interface para o objeto aninhado 'rawData' (dados brutos)
interface PaymentRawData {
  // código de autorização gerado.
  authorizationCode?: number;
  // código identificador único (nsu).
  nsu?: string;
  // código de retorno enviado pela bandeira/emissor.
  reasonCode?: string;
  // código complementar ao reasonCode (mastercard).
  merchantAdviceCode?: string;
}

// interface para o objeto aninhado 'paymentResponse'
interface PaymentResponse {
  // código pagbank que indica o motivo da resposta.
  code: number;
  // mensagem amigável (ex: sucesso).
  message: string;
  // nsu da autorização.
  reference?: string;
  // informações puras vindas dos emissores/bandeiras
  rawData?: PaymentRawData;
}

// interface para o objeto aninhado 'card'
interface PaymentCard {
  // identificador pagbank do cartão salvo (cartão tokenizado).
  id?: string;
  // número do cartão.
  number?: string;
  // número do token de bandeira.
  networkToken?: string;
  // mês de expiração.
  expMonth: number;
  // ano de expiração.
  expYear: number;
  // código de segurança.
  securityCode: string;
  // indica se o cartão deverá ser armazenado.
  store?: boolean;
  // bandeira do cartão.
  brand?: string;
  // retornado quando o cartão de crédito é 'pre_paid'.
  product?: string;
  // primeiros 6 dígitos do cartão (opcional, só para leitura)
  firstDigits?: number;
}

// interface para o objeto aninhado 'boleto'
interface PaymentBoleto {
  url?: string;
  barCode?: string;
}

// interface para o objeto aninhado 'paymentMethod'
interface PaymentMethod {
  // tipo de método de pagamento.
  type: 'credit_card' | 'debit_card' | 'boleto';
  // quantidade de parcelas (obrigatório para credit_card).
  installments?: number; 
  // indica se deve ser pré-autorizada (false) ou capturada (true).
  capture?: boolean;
  // data e horário limite para captura (se authorized).
  captureBefore?: string; 
  // nome na fatura do cliente.
  softDescriptor?: string; 
  // dados do cartão.
  card?: PaymentCard; 
  // dados do boleto.
  boleto?: PaymentBoleto;
}

// interface para o objeto aninhado 'qrCodes.amount'
interface QrCodeAmount {
  // valor do qr code em centavos.
  value: number;
}

// interface para o objeto aninhado 'qrCodes'
interface QrCode {
  // data de expiração do qr code.
  expirationDate: string; 
  // informações do valor do qr code.
  amount: QrCodeAmount;
  // outros campos específicos do pix/qr code.
  [key: string]: any;
}

// interface principal 'charge' (cobrança)
export interface Charge {
  // identificador da cobrança pagbank.
  id: string;
  // status da cobrança.
  status: 'authorized' | 'paid' | 'in_analysis' | 'declined' | 'canceled' | 'waiting';
  // data e horário em que foi criada.
  createdAt: string; 
  // data e horário em que foi paga.
  paidAt?: string; 
  // identificador único atribuído para a cobrança.
  referenceId?: string; 
  // descrição da cobrança.
  description?: string; 
  // informações do valor a ser cobrado.
  amount: ChargeAmount;
  // resumo de valores da cobrança.
  summary?: ChargeSummary;
  // informações de resposta do provedor de pagamento.
  paymentResponse?: PaymentResponse;
  // informações do método de pagamento.
  paymentMethod: PaymentMethod;
  // objeto contendo os qr codes vinculados.
  qrCodes?: QrCode[];
}