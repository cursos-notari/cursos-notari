import { create } from "zustand";

interface CheckoutStore {
  installments: number;
  installmentsPrice: number | null;
  setInstallments: (installments: number, totalPrice: number) => void;
}

const useCheckout = create<CheckoutStore>((set) => ({
  installments: 1,
  installmentsPrice: null,
  setInstallments: (installments: number, totalPrice: number) => 
    set({   
      installments, 
      installmentsPrice: totalPrice / installments
    }),
}));

export default useCheckout;