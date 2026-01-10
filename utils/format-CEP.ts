/**
 * formata uma string de CEP no padrão 00000-000
 * @param value - String do CEP com ou sem formatação
 * @returns String formatada no padrão 00000-000
 */
export function formatCEP(value: string | undefined | null): string {
  if (!value) return ''
  // remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '')

  if (!numbers) return ''

  const limitedNumbers = numbers.slice(0, 8)
  return limitedNumbers.replace(/^(\d{5})(\d{1,3})$/, '$1-$2')
}