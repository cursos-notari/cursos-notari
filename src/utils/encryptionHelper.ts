import { TPaymentCardSchema } from '@/validation/zod-schemas/payment-card-schema';

declare global { interface Window { PagSeguro: any } };

// valida disponibilidade do SDK
const validatePagSeguroSDK = (): void => {
  if (
    typeof window.PagSeguro === 'undefined' ||
    typeof window.PagSeguro.encryptCard === 'undefined'
  ) {
    throw new Error('SDK do PagBank indisponível.');
  }
};

// valida chave pública
const getPublicKey = (): string => {
  const publicKey = process.env.NEXT_PUBLIC_PAGBANK_SANDBOX_API_PUBLIC_KEY;
  if (!publicKey) throw new Error('Chave pública não configurada.');
  return publicKey;
};

// prepara dados do cartão
const prepareCardData = (paymentData: TPaymentCardSchema) => {
  const [month, year] = paymentData.expiryDate.split('/');
  return {
    holder: paymentData.holderName.trim(),
    number: paymentData.cardNumber.replace(/\s/g, ''),
    expMonth: month,
    expYear: '20' + year,
    securityCode: paymentData.cvv,
  };
};

// criptografa cartão
const encryptCardData = (publicKey: string, cardData: ReturnType<typeof prepareCardData>) => {
  const card = window.PagSeguro.encryptCard({
    publicKey,
    ...cardData,
  });

  if (card.hasErrors) {
    const error = card.errors[0];
    console.error('Erro ao criptografar o cartão:', error);
    throw new Error('Não foi possível processar os dados do cartão. Verifique as informações e tente novamente.');
  }

  return card.encryptedCard;
};

// limpa dados sensíveis
const clearSensitiveData = (paymentData: TPaymentCardSchema): void => {
  paymentData.cardNumber = '';
  paymentData.cvv = '';
  paymentData.holderName = '';
};

export {
  validatePagSeguroSDK,
  getPublicKey,
  prepareCardData,
  encryptCardData,
  clearSensitiveData,
}