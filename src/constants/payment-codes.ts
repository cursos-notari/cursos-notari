// Códigos NÃO retentáveis (definitivos)
export const nonRetryableCodes = [
  '10001', // Qtd de tentativas excedidas
  '10003', // Transação inválida
  '10004', // Transação não permitida
  '20007', // Dados do cartão inválidos
  '20008', // Parcelamento inválido
  '20012', // Valor da transação não permitido
  '20017', // Transação não permitida (cartão perdido/roubado/bloqueado)
  '20018', // Contate central (recolher cartão)
  '20039', // Transação não permitida para o cartão
  '20101', // Senha inválida
  '20110', // Conta destino inválida
  '20111', // Conta origem inválida
  '20112', // Valor diferente da pré-autorização
  '20113', // Utilize função crédito
  '20114', // Utilize função débito
  '20115', // Saque não disponível
  '20116', // Dados do cartão inválido
  '20117', // Erro no cartão
  '20118', // Suspensão de pagamento recorrente
];

// Códigos RETENTÁVEIS
export const retryableCodes = [
  '10000', // Não autorizado pelo PagSeguro (antifraude)
  '10002', // Não autorizado pelo emissor (genérica)
  '20001', // Contate central do cartão
  '20003', // Saldo/limite insuficiente
  '20019', // Falha de comunicação
  '20102', // Senha inválida - utilize nova senha
  '20103', // Excedidas tentativas de senha
  '20104', // Valor excedido
  '20105', // Qtd de saques excedida
  '20119', // Refazer transação
  '20158', // Não autorizada - tente mais tarde
  '20159', // Não autorizada - use autenticação
  '20301', // Desbloqueie o cartão
  '20999', // Lojista, contate adquirente
];