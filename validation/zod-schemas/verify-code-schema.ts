import z from "zod";

export const verifyCodeSchema = z.object({
  email: z.email("E-mail inválido."),
  classId: z.uuid("O ID da turma fornecido é inválido."),
  verificationCode: z.string().min(6).max(6),
});