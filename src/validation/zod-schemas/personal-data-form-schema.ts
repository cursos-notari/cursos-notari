import z from "zod";
import { isValidCPF } from "@/utils/is-valid-CPF";

export const personalDataFormSchema = z.object({
  name: z.string()
    .nonempty("Informe seu nome")
    .trim()
    .min(2, "Insira um nome válido")
    .max(50, "Insira no máximo 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome deve conter apenas letras"),

  surname: z.string()
    .nonempty("Informe seu sobrenome")
    .trim()
    .min(2, "Insira um sobrenome válido")
    .max(50, "Insira no máximo 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Insira apenas letras"),

  birthdate: z.date({
    message: "Informe sua data de nascimento",
  }).refine((date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      return age - 1 >= 17;
    }
    return age >= 17;
  }, {
    message: "Você deve ter no mínimo 17 anos para se cadastrar",
  }),

  cpf: z.string()
    .nonempty("Informe seu CPF")
    .transform((cpf) => cpf.replace(/[^\d]/g, '')) // remove tudo que não é número
    .pipe(
      z.string()
        .length(11, "Insira o CPF completo")
        .refine((cpf) => isValidCPF(cpf), "CPF inválido")
    ),

  email: z.email("Informe um e-mail válido"),

  phone: z.string()
    .transform((telefone) => telefone.replace(/[^\d]/g, '')) // remove tudo que não é número
    .pipe(
      z.string()
        .nonempty("Informe seu WhatsApp")
        .min(11, "O número deve ter pelo menos 11 dígitos")
        .max(11, "O número deve ter no máximo 11 dígitos")
        .regex(/^\d+$/, "O número deve conter apenas números")
    ),

  street: z.string()
    .nonempty("Informe o nome da rua")
    .trim()
    .min(5, "O nome da rua deve ter pelo menos 5 caracteres")
    .max(100, "O nome da rua deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-Z0-9À-ÿ\s.,'-]+$/, "Insira uma cidade válida"),

  number: z.string()
    .max(4, "Insira no máximo 4 caracteres"),

  noNumber: z.boolean(),

  complement: z.string()
    .max(50, "O complemento deve ter no máximo 50 caracteres")
    .optional(),

  locality: z.string()
    .nonempty("Informe o bairro")
    .min(2, "Informe um bairro válido")
    .max(50, "Insira no máximo 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Insira um bairro válido"),

  city: z.string()
    .nonempty("Informe a cidade")
    .trim()
    .min(2, "Informe uma cidade válida")
    .max(50, "Cidade deve ter no máximo 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Insira um nome válido"),

  regionCode: z.string()
    .length(2, "Estado deve ter 2 caracteres")
    .regex(/^[A-Z]{2}$/, "Estado deve conter apenas letras maiúsculas"),

  postalCode: z.string()
  .nonempty("Informe o CEP")
    .transform((cep) => cep.replace(/[^\d]/g, '')) // remove tudo que não é número
    .pipe(
      z.string()
        .length(8, "O CEP deve ter 8 dígitos")
        .regex(/^\d+$/, "CEP deve conter apenas números")
    ),

  // acceptTerms: z.boolean()
  //   .refine((val) => val === true, "Você deve aceitar os termos de política de privacidade"),

  // acceptEmails: z.boolean(),
}).refine((data) => data.noNumber || data.number.trim().length >   0, {
  message: "Informe o número ou marque 'Sem número'",
  path: ["number"],
});

export type PersonalDataFormSchema = z.infer<typeof personalDataFormSchema>;