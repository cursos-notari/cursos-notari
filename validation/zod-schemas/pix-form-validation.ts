import z from "zod";

export const pixFormSchema = z.object({
  acceptContract: z.boolean()
    .refine((val) => val === true, "Você deve aceitar os termos do contrato"),

  acceptPolicy: z.boolean()
    .refine((val) => val === true, "Você deve aceitar os termos de política de privacidade"),
});

export type PixFormSchema = z.infer<typeof pixFormSchema>;