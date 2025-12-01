// essa função recebe um objeto de ordem do pagbank, e retorna o link de pagamento

export function extractPaymentUrl(orderData: any): string | null {
  const payLink = orderData.links?.find((link: any) => link.rel === "PAY");
  return payLink?.href || null;
}