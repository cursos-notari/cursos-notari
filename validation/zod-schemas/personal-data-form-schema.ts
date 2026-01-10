import z from "zod";
import { isValidCPF } from "@/utils/is-valid-CPF";

export const personalDataFormSchema = z.object({
  name: z.string()
    .trim()
    .pipe(z.string().nonempty("Informe seu nome"))
    .pipe(z.string().min(2, "Informe um nome válido"))
    .pipe(z.string().max(50, "Insira no máximo 50 caracteres"))
    .pipe(z.string().regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Insira apenas letras")),

  surname: z.string()
    .trim()
    .pipe(z.string().nonempty("Informe seu sobrenome"))
    .pipe(z.string().min(2, "Informe um sobrenome válido"))
    .pipe(z.string().max(50, "Insira no máximo 50 caracteres"))
    .pipe(z.string().regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Insira apenas letras")),

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
    .trim()
    .transform((cpf) => cpf.replace(/[^\d]/g, ''))
    .pipe(z.string().nonempty(('Informe seu CPF')))
    .pipe(z.string().length(11, "Informe um CPF válido"))
    .pipe(z.string().refine((cpf) => isValidCPF(cpf), "CPF inválido")),

  email: z.string()
    .trim()
    .pipe(z.string().nonempty("Informe seu e-mail"))
    .pipe(z.email("Informe um e-mail válido")),

  phone: z.string()
    .transform((telefone) => telefone.replace(/[^\d]/g, ''))
    .pipe(z.string().nonempty(("Informe seu número do WhatsApp")))
    .pipe(z.string().length(11, "Informe um WhatsApp válido"))
    .pipe(z.string().regex(/^\d+$/, "O WhatsApp deve conter apenas números")),

  street: z.string()
    .trim()
    .pipe(z.string().nonempty("Informe o nome da sua rua"))
    .pipe(z.string().min(5, "O nome da rua deve ter pelo menos 5 caracteres"))
    .pipe(z.string().max(100, "Insira no máximo 100 caracteres"))
    .pipe(z.string().regex(/^[a-zA-Z0-9À-ÿ\s.,'-]+$/, "Insira um endereço válido")),

  number: z.string()
    .trim()
    .max(4, "Insira no máximo 4 caracteres"),

  noNumber: z.boolean(),

  complement: z.string()
    .trim()
    .max(50, "O complemento deve ter no máximo 50 caracteres")
    .optional(),

  locality: z.string()
    .trim()
    .pipe(z.string().nonempty("Informe o nome do seu bairro"))
    .pipe(z.string().min(2, "Informe um bairro válido"))
    .pipe(z.string().max(50, "Insira no máximo 50 caracteres"))
    .pipe(z.string().regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Insira um bairro válido")),

  city: z.string()
    .trim()
    .pipe(z.string().nonempty('Informe o nome da sua cidade'))
    .pipe(z.string().min(2, "Informe uma cidade válida"))
    .pipe(z.string().max(50, "O nome da cidade deve ter no máximo 50 caracteres"))
    .pipe(z.string().regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Insira um nome válido")),

  regionCode: z.string()
    .pipe(z.string().length(2, "Estado deve ter 2 caracteres"))
    .pipe(z.string().regex(/^[A-Z]{2}$/, "Estado deve conter apenas letras maiúsculas")),

  postalCode: z.string()
    .trim()
    .transform((cep) => cep.replace(/[^\d]/g, ''))
    .pipe(z.string().nonempty("Informe seu CEP"))
    .pipe(z.string().length(8, "Informe um CEP válido"))
    .pipe(z.string().regex(/^\d+$/, "CEP deve conter apenas números")),

  state: z.string()
    .trim()
    .pipe(z.string().min(1, "Informe o estado")),

}).refine((data) => data.noNumber || data.number.trim().length > 0, {
  message: "Informe o número ou marque 'Sem número'",
  path: ["number"],
});

export type PersonalDataFormSchema = z.infer<typeof personalDataFormSchema>;