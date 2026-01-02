import { paymentErrorMessageMap } from "@/constants/payment-error-message-map";

// retorna mensagem amigável baseada no código de erro

export function getFriendlyMessage(
  code: string,
  originalMessage: string
): string {

  return paymentErrorMessageMap[code] || 
         originalMessage ||
         'Pagamento não autorizado. Tente outro método de pagamento.'
  ;

}