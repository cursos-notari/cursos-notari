// estas interfaces já foram criadas, mas as incluímos novamente para contexto
// e com pequenas alterações baseadas nos novos dados de order:

import { Charge } from "./charge";

interface ChargeAmount {
  value: number; 
  currency: 'brl'; 
}

interface ChargeSummary {
  total: number;
  paid: number;
  refunded: number;
}

// ----------------------------------------------------------------------
// novas interfaces de cliente e endereço
// ----------------------------------------------------------------------

interface CustomerPhone {
  // código de operadora do país (ddi).
  country: number;
  // código de operadora local (ddd).
  area: number;
  // número do telefone.
  number: number;
  // tipo de telefone.
  type: 'mobile' | 'business' | 'home';
}

interface CustomerAddress {
  street: string;
  number: string;
  complement?: string;
  locality: string;
  city: string;
  region: string;
  // código do estado (padrão iso 3166-2).
  regionCode: string;
  // país (padrão iso 3166-1 alpha-3).
  country: string;
  // cep do endereço.
  postalCode: string;
}

interface Customer {
  name: string;
  email: string;
  // documento de identificação pessoal (cpf/cnpj).
  taxId: string;
  // contém uma lista de telefones do cliente.
  phone?: CustomerPhone[];
}

export interface OrderItem {
  name: string;
  quantity: number;
  // valor unitário do item em centavos.
  unit_amount: number;
  // identificador único atribuído para o item.
  referenceId?: string;
}

interface OrderShipping {
  // contém informações do endereço de entrega do pedido.
  address: CustomerAddress;
  // outros campos de frete podem existir (ex: cost)
  [key: string]: any; 
}

// ----------------------------------------------------------------------
// interfaces de split (divisão de pagamento)
// ----------------------------------------------------------------------

interface SplitAccount {
  // identificador único da conta pagbank do recebedor.
  id: string;
}

interface SplitAmount {
  // valor em centavos ou percentual destinado ao recebedor.
  value: number;
}

interface SplitCustodyConfiguration {
  // define se a transação terá custódia.
  apply: boolean;
}

interface SplitChargebackChargeTransfer {
  // porcentagem referente ao valor do chargeback.
  percentage: number;
}

interface SplitChargebackConfiguration {
  chargeTransfer: SplitChargebackChargeTransfer;
}

interface SplitConfigurations {
  custody?: SplitCustodyConfiguration;
  chargeback?: SplitChargebackConfiguration;
}

interface SplitReceiver {
  amount: SplitAmount;
  account: SplitAccount;
  configurations?: SplitConfigurations;
  // descrição opcional para o recebedor.
  reason?: string; 
}

interface Splits {
  // define se a divisão é fixed ou percentage.
  method: 'fixed' | 'percentage';
  // lista de recebedores participantes.
  receivers: SplitReceiver[];
}

// ----------------------------------------------------------------------
// interfaces de notificação e links
// ----------------------------------------------------------------------

interface NotificationUrl {
  // url que receberá as notificações.
  url: string; 
}

interface OrderLink {
  rel: string; // ex: 'self'
  href: string;
  media: string;
  type: 'get' | 'post' | 'delete' | 'put';
}

// ----------------------------------------------------------------------
// interfaces de qr code (atualizada)
// ----------------------------------------------------------------------

interface QrCodeAmount {
  // valor do qr code.
  value: number;
}

interface QrCodeLink {
  rel: string;
  href: string;
  media: string;
  type: 'GET' | 'POST' | 'DELETE' | 'PUT';
}

export interface QrCode {
  // data de expiração do qr code.
  expirationDate: string; 
  // informações do valor do qr code.
  amount: QrCodeAmount;
  links: QrCodeLink[]
  // outros campos específicos do pix/qr code.
  [key: string]: any;
}

// ----------------------------------------------------------------------
// interfaces submerchant (sub lojista)
// ----------------------------------------------------------------------

interface SubMerchantAddress extends CustomerAddress {}

interface SubMerchantPhone {
  country: number;
  area: number;
  number: number;
  type: 'mobile' | 'business' | 'home';
}

interface SubMerchant {
  // identificador próprio referente ao lojista.
  referenceId: string;
  // razão social ou nome completo.
  name: string;
  // número do documento (cpf ou cnpj).
  taxId: string;
  // código de atuação comercial do lojista (mcc).
  mcc: string;
  address: SubMerchantAddress;
  phone?: SubMerchantPhone;
}

// ----------------------------------------------------------------------
// interface principal order
// ----------------------------------------------------------------------

export interface Order {
  // identificador do pedido pagbank.
  id: string;
  // identificador único atribuído para o pedido.
  referenceId: string;
  // informações do cliente.
  customer: Customer;
  // informações dos itens inseridos no pedido.
  items: OrderItem[];
  // informações de entrega do pedido.
  shipping?: OrderShipping[];
  // objeto contendo os qr codes vinculados.
  qr_codes?: QrCode[];
  // contém informações da divisão de pagamento.
  splits?: Splits;
  // url que receberá as notificações.
  notificationUrls?: NotificationUrl[];
  // representa todos os dados disponíveis em uma cobrança.
  charges: Charge[]; // chamada à interface charge previamente definida
  // dados do sub lojista.
  subMerchant?: SubMerchant;
  // conjunto de pares de valores-chave adicionais.
  metadata?: { [key: string]: string };
  // informações de links relacionados ao recurso.
  links?: OrderLink[];
  // timestamp 
  created_at: string;
}