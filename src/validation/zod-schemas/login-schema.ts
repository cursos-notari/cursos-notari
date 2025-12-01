import z from "zod";

export const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, insira um endereço de e-mail válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter no mínimo 6 caracteres.",
  }),
});

export type TLoginFormSchema = z.infer<typeof formSchema>;