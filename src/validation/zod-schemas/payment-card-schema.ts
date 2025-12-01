import z from "zod";

// função aprimorada para validar número do cartão usando o algoritmo de luhn
const validateCardNumberLuhn = (cardNumber: string): boolean => {
  // remove espaços em branco
  const cleanNumber = cardNumber.replace(/\s/g, '');

  // valida formato básico
  if (cleanNumber.length < 13 || cleanNumber.length > 19 || !/^\d+$/.test(cleanNumber)) {
    return false; // falha na validação básica
  }

  // algoritmo de luhn
  let sum = 0;
  let double = false; // flag para alternar entre dobrar e não dobrar o dígito

  // itera sobre os dígitos do final para o início
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);

    if (double) {
      digit *= 2; // dobra o dígito
      if (digit > 9) digit -= 9; // se for maior que nove subtrai nove
    }

    sum += digit;
    // alterna a flag
    double = !double;
  }

  // o cartão é válido se a soma for um múltiplo de 10
  return (sum % 10) === 0;
};

// função para validar CVV
const validateCVV = (cvv: string) => {
  return /^\d{3,4}$/.test(cvv);
};

const validateExpiryFormat = (expiryDate: string): boolean => {
  const dateParts = expiryDate.split('/');

  if (dateParts.length !== 2) return false;

  const [monthStr, yearStr] = dateParts;

  const expMonth = parseInt(monthStr, 10);
  const expYear = parseInt(yearStr, 10);

  if (isNaN(expMonth) || expMonth < 1 || expMonth > 12) return false;

  if (isNaN(expYear)) return false;

  return true;
};

const isCardNotExpired = (expiryDate: string): boolean => {

  if (!validateExpiryFormat(expiryDate)) return false;

  const [monthStr, yearStr] = expiryDate.split('/');

  const expMonth = parseInt(monthStr, 10);
  let expYear = parseInt(yearStr, 10);

  if (yearStr.length === 2) { expYear += 2000; }

  const now = new Date();
  const currentYear = now.getFullYear();

  // date.getmonth() retorna 0-11, então adicionamos 1 para obter 1-12
  const currentMonth = now.getMonth() + 1;

  // ano de expiração deve ser maior que o ano atual
  if (expYear > currentYear) return true;

  // se o ano for o atual, o mês deve ser o atual ou um mês futuro
  if (expYear === currentYear && expMonth >= currentMonth) return true;

  return false;
};

export const paymentCardSchema = z.object({
  holderName: z
    .string()
    .nonempty("Nome do titular é obrigatório")
    .min(3, "Digite o nome como está no cartão")
    .max(50, "Nome muito longo")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

  cardNumber: z
    .string()
    .nonempty("Número do cartão é obrigatório")
    .min(16, "O número precisa ter pelo menos 16 dígitos")
    .refine(validateCardNumberLuhn, "Número do cartão inválido"),

  cvv: z
    .string()
    .min(1, "CVV é obrigatório")
    .refine(validateCVV, "Deve ter 3 ou 4 dígitos"),

  expiryDate: z
    .string()
    .min(1, "Validade é obrigatória")
    .refine(validateExpiryFormat, "Formato inválido")
    .refine(isCardNotExpired, "Cartão expirado"),

  installments: z
    .number()
    .min(1, "Número de parcelas inválido")
    .max(12, "Máximo 12 parcelas"),

  acceptContract: z.boolean()
    .refine((val) => val === true, "Você deve aceitar os termos do contrato"),

   acceptPolicy: z.boolean()
    .refine((val) => val === true, "Você deve aceitar os termos de política de privacidade"),
    
}).superRefine((data, ctx) => {
  if (data.expiryDate && !isCardNotExpired(data.expiryDate)) {
    ctx.addIssue({
      code: "custom",
      message: "Cartão expirado",
      path: ["expiryDate"],
    });
  }
});

export type TPaymentCardSchema = z.infer<typeof paymentCardSchema>;