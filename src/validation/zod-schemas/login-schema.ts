import z from "zod";

export const loginFormSchema = z.object({
  email: z.email({
      message: "Por favor, insira um endereço de e-mail válido.",
    }),
  password: z.string()
    .nonempty("Informe sua senha")
    .min(6, {
      message: "A senha deve ter no mínimo 6 caracteres.",
    }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;