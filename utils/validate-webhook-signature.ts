import crypto from 'crypto';

/**
 * Valida a autenticidade da notificação do PagBank
 * usando SHA-256 conforme documentação oficial
 */

export function validateWebhookSignature(
  payload: string,
  receivedSignature: string,
  token: string
): boolean {
  // concatena token + "-" + payload (sem espaços ou formatação)
  const content = `${token}-${payload}`
  
  // gera hash SHA-256
  const hash = crypto
    .createHash('sha256')
    .update(content, 'utf8')
    .digest('hex')
  
  // compara com a assinatura recebida
  return hash === receivedSignature
}