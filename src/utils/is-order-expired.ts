export function isOrderExpired(order_created_at: string | null | undefined): boolean {
  const oneHourInMs = 60 * 60 * 1000;

  if (!order_created_at) {
    console.error("ERRO: order_created_at é nulo ou vazio.");
    return true; 
  }

  const orderCreationTime = new Date(order_created_at).getTime();
  
  if (isNaN(orderCreationTime)) {
    console.error("ERRO: order_created_at resultou em data inválida.");
    return true; 
  }

  const orderAge = Date.now() - orderCreationTime;

  return orderAge >= oneHourInMs;
}