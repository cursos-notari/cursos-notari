import { nonRetryableCodes, retryableCodes } from "@/constants/payment-codes";

/**
 * Mapeia códigos de resposta do PagBank para determinar se são retentáveis
 * Baseado na documentação: https://developer.pagbank.com.br/reference/motivos-de-compra-negada
 */
export function isRetryablePaymentCode(code: string): boolean {

  if (nonRetryableCodes.includes(code)) return false;
  if (retryableCodes.includes(code)) return true;
  
  // se não estiver mapeado, considerar não retentável por segurança
  return false;
}