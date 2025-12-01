"use server"

import { getNewVerificationCode } from "./get-new-verification-code";
import { sendVerificationCode } from "./send-verification-code";

interface ResendVerificationCodeParams {
  email: string;
  classId: string;
  className: string;
  name: string;
}

export async function resendVerificationCode({
  name,
  email,
  classId,
  className,
}: ResendVerificationCodeParams) {
  try {
    const responseCode = await getNewVerificationCode({ classId, email });

    if (!responseCode.success || !responseCode.data?.verification_code) {
      return {
        success: false,
        message: responseCode.message,
        code: responseCode.code
      }
    }
    return{
      success: true,
      message: responseCode.message,
    }
    const res = await sendVerificationCode({
      to: email,
      className: className,
      name: name,
      verificationCode: responseCode.data?.verification_code
    })

    if (!res.success) {
      return {
        success: false,
        message: res.message,
      }
    }

    return {
      success: true,
      message: res.message
    }

  } catch (e: any) {
    console.error(e.message);
    return {
      success: false,
      message: 'Erro inesperado ao reenviar código',
    }
  }
}