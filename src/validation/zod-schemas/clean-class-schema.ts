import { z } from "zod";

/**
 * Schema reutilizável para validação de datas obrigatórias
 * Garante que o campo seja uma data válida e fornece mensagens de erro apropriadas
 */
export const requiredDateSchema = z.date({
  error: (issue) => {
    if (issue.code === 'invalid_type') {
      return {
        message: issue.input === undefined || issue.input === null ?
          "Esse campo é obrigatório."
          : "Formato inválido de data."
      };
    }
    return { message: "Data inválida" };
  }
});

/**
 * Schema de validação para criação/edição de turmas
 * Define todas as regras de negócio e validações necessárias para uma turma válida
 */
export const cleanClassSchema = z.object({
  // Nome da turma - obrigatório, mínimo 3 caracteres
  className: z
    .string()
    .nonempty("Esse campo é obrigatório.")
    .min(3, "O nome da turma deve ter no mínimo 3 caracteres.")
    .max(100, "O nome da turma deve ter no máximo 100 caracteres."),

  // Descrição da turma - opcional
  description: z
    .string()
    .optional(),

  // Data de abertura - deve ser hoje ou posterior
  openingDate: requiredDateSchema
    .min(
      new Date().setHours(0, 0, 0, 0),
      { message: "A data de abertura deve ser hoje ou uma data posterior." }
    ),

  // Data de fechamento - obrigatória
  closingDate: requiredDateSchema,

  // Número de vagas - inteiro positivo obrigatório
  vacancies: z.coerce
    .number({
      error: (issue) => {
        if (issue.code === 'invalid_type') {
          if (issue.input === undefined) {
            return { message: "Esse campo é obrigatório." };
          }
          return { message: "O número de vagas deve ser numérico." };
        }
        return { message: "Valor inválido para vagas." };
      }
    })
    .int("O número de vagas deve ser inteiro.")
    .min(1, "O número de vagas deve ser no mínimo 1.")
    .max(1000, "O número de vagas não pode exceder 1000."),

  // Taxa de inscrição - preprocessa strings com formato brasileiro (1.234,56)
  registrationFee: z.preprocess(
    (val) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        // Remove pontos e substitui vírgula por ponto (formato brasileiro → americano)
        return val.replace(/\./g, '').replace(',', '.');
      }
      return undefined;
    },
    z.coerce
      .number({
        error: (issue) => {
          if (issue.code === 'invalid_type') {
            return {
              message: issue.input === undefined || isNaN(issue.input as number) ?
                "O valor da inscrição é obrigatório." :
                "O valor deve ser numérico."
            };
          }
          return { message: "Valor inválido." };
        }
      })
      .min(0, "O valor deve ser maior ou igual a zero.")
      .max(99999.99, "O valor não pode exceder R$ 99.999,99.")
  ),

  // Status da turma - enum com valores predefinidos
  status: z.enum(["planned", "open", "closed", "paused", "in_progress", "finished", "canceled"], {
    error: (issue) => {
      if (issue.code === 'invalid_value') {
        return { message: "Esse campo é obrigatório." };
      }
      return { message: "Status inválido." };
    }
  }),

  // Endereço onde as aulas acontecerão
  address: z
    .string()
    .nonempty("Esse campo é obrigatório.")
    .max(255, "O endereço deve ter no máximo 255 caracteres."),

  // Dias de aula - array com pelo menos um item
  classDays: z.array(
    z.object({
      // Data da aula
      date: z.date({
        error: (issue) => ({
          message:
            issue.input === undefined || issue.input === null ?
              "A data é obrigatória."
              : "Formato inválido de data."
        })
      }),
      // Horário da aula (formato: HH:MM)
      time: z
        .string()
        .min(1, "O horário é obrigatório.")
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de horário inválido. Use HH:MM"),
    })
  ).min(1, "É necessário informar ao menos um dia de aula"),
})