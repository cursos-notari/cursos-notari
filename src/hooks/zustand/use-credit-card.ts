import { create } from "zustand";
import { TPaymentCardSchema } from "@/validation/zod-schemas/payment-card-schema";
import { immer } from 'zustand/middleware/immer';
import { EMPTY_CREDIT_CARD_DATA_MOCK, CREDIT_CARD_DATA_MOCK } from "@/mocks/credit-card-data-mock";

interface CreditCardStore {
  creditCardData: TPaymentCardSchema | null;
  setCreditCardData: (data: TPaymentCardSchema) => void;
  updateCreditCardDataField: <K extends keyof TPaymentCardSchema>(
    field: K,
    value: TPaymentCardSchema[K]
  ) => void;
  resetCreditCardData: () => void;
}

const useCreditCardData = create<CreditCardStore>()(
  immer((set) => ({
    creditCardData: CREDIT_CARD_DATA_MOCK,

    setCreditCardData: (data) =>
      set((state) => {
        state.creditCardData = data;
      }),

    updateCreditCardDataField: (field, value) =>
      set((state) => {
        if (state.creditCardData) {
          state.creditCardData[field] = value;
        }
      }),

    resetCreditCardData: () =>
      set((state) => {
        state.creditCardData = EMPTY_CREDIT_CARD_DATA_MOCK;
      }),
  }))
);

export default useCreditCardData;