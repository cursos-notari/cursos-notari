import { create } from "zustand";
import { PayMethod } from "@/types/enum/payment-method";

interface PaymentMethodsStore {
  installments: number; 
  installmentsPrice: number | null;
  paymentMethod: PayMethod;
  lastCreditCardInstallments: number;
  setInstallments: (installments: number, totalPrice: number) => void;
  setPaymentMethod: (method: PayMethod, totalPrice: number) => void;
}

export const usePaymentMethods = create<PaymentMethodsStore>((set, get) => ({
  installments: 12,
  installmentsPrice: null,
  paymentMethod: PayMethod.CREDIT_CARD,
  lastCreditCardInstallments: 12,

  setInstallments: (installments: number, totalPrice: number) => {
    const currentPaymentMethod = get().paymentMethod;
    set({
      installments,
      installmentsPrice: totalPrice / installments,
      // se for cartão de crédito, salva as parcelas escolhidas
      lastCreditCardInstallments: currentPaymentMethod === PayMethod.CREDIT_CARD
        ? installments
        : get().lastCreditCardInstallments
    });
  },

  setPaymentMethod: (method: PayMethod, totalPrice: number) => {
    const state = get();

    if (method === PayMethod.PIX || method === PayMethod.BOLETO) {
      // pix sempre é à vista
      set({
        paymentMethod: method,
        installments: 1,
        installmentsPrice: totalPrice
      });
    } else if (method === PayMethod.CREDIT_CARD) {
      // ao voltar para cartão, restaura o número de parcelas anterior
      const installments = state.lastCreditCardInstallments;
      set({
        paymentMethod: method,
        installments,
        installmentsPrice: totalPrice / installments
      });
    }
  }
}));