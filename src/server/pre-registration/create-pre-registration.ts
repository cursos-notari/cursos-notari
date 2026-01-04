'use server'

import { createClient } from "@/lib/supabase/server";
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

  const supabase = await createClient();

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
    console.error("Erro na RPC create_pre_registration:", error);
    return { success: false };
  }

  if (!result.success) {
    const { code, message } = result;

    if (code === 'internal_error') {
      console.error(`${code} : ${message}`);
    }

    return {
      success: false,
      message: code === 'internal_error' ? null : message
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