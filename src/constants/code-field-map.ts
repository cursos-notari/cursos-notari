import { CardErrorCode } from "@/types/interfaces/payment/pagbank/card";
import { TPaymentCardSchema } from "@/validation/zod-schemas/payment-card-schema";

export const fieldError: Record<CardErrorCode, { name: keyof TPaymentCardSchema; message: string }> = {
  INVALID_NUMBER: { 
    name: 'cardNumber', 
    message: 'Número do cartão inválido' 
  },
  INVALID_SECURITY_CODE: { 
    name: 'cvv', 
    message: 'CVV inválido' 
  },
  INVALID_EXPIRATION_MONTH: { 
    name: 'expirationDate', 
    message: 'Data inválida' 
  },
  INVALID_EXPIRATION_YEAR: { 
    name: 'expirationDate', 
    message: 'Data inválida' 
  },
  INVALID_HOLDER: { 
    name: 'holderName', 
    message: 'Nome inválido' 
  }
};