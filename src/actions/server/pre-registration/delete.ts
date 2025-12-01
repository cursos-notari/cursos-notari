// DELETE - DELETA PRÉ-INSCRIÇÃO COM BASE NO ID

import { supabase } from "@/supabase/browser-client";

export async function deletePreRegistrationById(preRegistrationId: string) {
  const { error } = await supabase
    .from("pre_registrations")
    .delete()
    .eq("id", preRegistrationId);

  if (error) {
    console.error("Erro ao deletar pré-inscrição:", error);
    throw new Error("Não foi possível reverter a pré-inscrição.");
  }
}