import { supabase } from "@/supabase/browser-client";
import type { CheckEmailResult } from "@/types/interfaces/database/pre-registration";

interface CheckEmailInput {
  email: string;
  classId: string;
}

export async function checkEmailExists(data: CheckEmailInput): Promise<CheckEmailResult> {
  try {
    const { data: preRegistrations, error } = await supabase
      .from("pre_registrations")
      .select("token, status, expires_at")
      .eq("email", data.email)
      .eq("class_id", data.classId);

    if (error) {
      console.error("Erro ao verificar email:", error.message);
      throw new Error("Erro ao verificar email. Tente novamente.");
    }

    if (!preRegistrations || preRegistrations.length === 0) {
      return { exists: false };
    }

    // Pega o registro mais recente
    const latestRegistration = preRegistrations[0];
    const isExpired = new Date(latestRegistration.expires_at) < new Date();

    return {
      exists: true,
      token: latestRegistration.token,
      status: latestRegistration.status,
      isExpired
    };
  } catch (error) {
    console.error("Erro na verificação de email:", error);
    throw error;
  }
}