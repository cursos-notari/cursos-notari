import { Card } from '@/types/interfaces/payment/pagbank/card';
import { TPaymentCardSchema } from '@/validation/zod-schemas/payment-card-schema';

declare global { interface Window { PagSeguro: any } };

// verifica disponibilidade do SDK
const isPagSeguroSDKAvailable = (): boolean => {
  if (
    typeof window.PagSeguro === 'undefined' ||
    typeof window.PagSeguro.encryptCard === 'undefined'
  ) {
    return false;
  }
  return true;
};

// prepara dados do cartão
const formatCardData = (paymentData: TPaymentCardSchema) => {
  const [month, year] = paymentData.expirationDate.split('/');

  return {
    holder: paymentData.holderName.trim(),
    number: paymentData.cardNumber.replace(/\s/g, ''),
    expMonth: month,
    expYear: '20' + year,
    securityCode: paymentData.cvv,
  };
};

// criptografa cartão
const encryptCard = (cardData: TPaymentCardSchema): Card => {
  try {
    if (!isPagSeguroSDKAvailable()) {
      throw new Error('O SDK do Pag Seguro só pode ser utilizado em Client Components.');
    }

    const publicKey = process.env.NEXT_PUBLIC_PAGBANK_SANDBOX_API_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error('Chave pública do PagBank não encontrada.');
    }

    const formatedCardData = formatCardData(cardData);

    const card: Card = window.PagSeguro.encryptCard({
      publicKey,
      ...formatedCardData,
    });

    return card;

  } catch (error: any) {
    console.error(error.message);
    throw new Error('Ocorreu um erro ao processar os dados do cartão.');
  }
};

export {
  isPagSeguroSDKAvailable,
  formatCardData,
  encryptCard,
}