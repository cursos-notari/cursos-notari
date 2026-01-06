"use server"

import { createClient } from "@/lib/supabase/service";
import { PersonalDataFormSchema, personalDataFormSchema } from "@/validation/zod-schemas/personal-data-form-schema";
import { cookies } from "next/headers";

export interface CreatePreRegistrationParams {
  personalData: PersonalDataFormSchema
  classId: string
}

export async function createPreRegistration({ classId, personalData }: CreatePreRegistrationParams) {

  const isValidData = personalDataFormSchema.safeParse(personalData);

  if (!isValidData.success) {
    const formattedErrors = isValidData.error.issues.map((issue) => ({
      field: issue.path.join('.') as keyof PersonalDataFormSchema,
      message: issue.message
    }));

    return {
      success: false,
      message: 'Dados inválidos, verifique suas informações e tente novamente.',
      errors: formattedErrors,
      code: 'invalid_data'
    }
  }

  const supabase = createClient();

  if (!supabase) return { success: false };

  const { data: result, error } = await supabase.rpc("create_pre_registration", {
    p_class_id: classId,
    p_name: personalData.name,
    p_surname: personalData.surname,
    p_email: personalData.email,
    p_cpf: personalData.cpf,
    p_phone: personalData.phone,
    p_street: personalData.street,
    p_number: personalData.number,
    p_complement: personalData.complement,
    p_locality: personalData.locality,
    p_city: personalData.city,
    p_region_code: personalData.regionCode,
    p_state: personalData.state,
    p_postal_code: personalData.postalCode,
  });

  if (error) {
    console.error("Erro ao chamar RPC create_pre_registration:", error);
    return { success: false };
  }

  if (!result.success) {
    const { code, message } = result;

    const isInternalError = code === 'internal_error';

    if (isInternalError) {
      console.error(`Ocorreu um erro interno ao criar o pré-registro: ${message}`);
    }

    return {
      success: false,
      message: isInternalError ? null : message
    }
  }

  // salva o ID em um cookie
  const cookieStore = await cookies();
  cookieStore.set('pre_registration_id', result.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 // 1 hora de duração
  });

  return result;
}