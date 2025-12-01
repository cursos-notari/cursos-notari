"use server"

import { createClient } from "@/supabase/server-client";

interface GetNewVerificationCodeParams {
  email: string;
  classId: string;
}

interface GetNewVerificationCodeResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    verification_code: string;
  };
}

export async function getNewVerificationCode({ email, classId }: GetNewVerificationCodeParams): Promise<GetNewVerificationCodeResponse> {
  try {
    const supabase = await createClient();

    const { data: result, error } = await supabase.rpc("resend_verification_code", {
      p_email: email,
      p_class_id: classId
    });

    if (error) {
      console.error("Erro na RPC resend_verification_code:", error.message);
      throw new Error("Erro ao reenviar código. Tente novamente.");
    }

    return result as GetNewVerificationCodeResponse;
  } catch (error) {
    console.error("Erro ao reenviar código:", error);
    throw error;
  }
}