"use server"

import { verifyCodeSchema } from "@/validation/zod-schemas/verify-code-schema";
import { createServiceClient } from "@/supabase/service-client";

export interface VerifyCodeParams {
  email: string;
  classId: string;
  verificationCode: string;
}

interface VerifyCodeResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    id: string;
    token: string;
    class_id: string;
  };
}

export async function verifyEmailCode(data: VerifyCodeParams): Promise<VerifyCodeResponse> {
  try {
    const supabase = createServiceClient();

    if(!supabase) return {
      success: false,
      code: 'BAD_CLIENT',
      message: 'Erro ao criar cliente'
    }

    const validationResult = verifyCodeSchema.safeParse(data);

    if (!validationResult.success) {
      return {
        success: false,
        code: 'INVALID_INPUT',
        message: validationResult.error.issues[0].message,
      };
    }

    const { data: result, error } = await supabase.rpc("verify_email_code", {
      p_email: data.email,
      p_class_id: data.classId,
      p_verification_code: data.verificationCode
    });

    if (error) {
      console.error("Erro na RPC verify_email_code:", error.message);
      throw new Error("Erro ao verificar código. Tente novamente.");
    }

    return result as VerifyCodeResponse;
  } catch (error: any) {
    console.error("Erro na verificação de código:", error.message);
    return {
      success: false,
      message: error.message,
      code: 'INTERNAL_ERROR'
    }
  }
}