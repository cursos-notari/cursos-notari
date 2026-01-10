'use server'

import { createClient  } from "@/lib/supabase/server";

export async function deletePreRegistrationById(preRegistrationId: string) {
  const supabase = await createClient();

  if(!supabase) return { success: false }

  const { error } = await supabase
    .from("pre_registrations")
    .delete()
    .eq("id", preRegistrationId);

  if (error) {
    console.error("Erro ao deletar pré-inscrição:", error);
    throw new Error("Não foi possível reverter a pré-inscrição.");
  }
}