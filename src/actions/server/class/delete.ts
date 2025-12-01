"use server";

import { createClient } from "@/supabase/server-client";
import { revalidatePath } from "next/cache";

export async function deleteClassAction(classId: string) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Usuário não autenticado. Ação negada.");

    const { data, error } = await supabase
      .from("classes")
      .delete()
      .eq("id", classId)
      .select();

    if (error) {
      console.error("Erro ao deletar turma:", error);
      throw new Error("Não foi possível deletar a turma.");
    }

    if (!data || data.length === 0) {
      console.error(
        `Falha ao deletar: A turma com ID ${classId} não foi encontrada ou o usuário não tem permissão de 'owner'.`
      );
      throw new Error(
        "Falha ao deletar. Verifique suas permissões ou se a turma ainda existe."
      );
    }

    // invalida cache do dashboard
    revalidatePath('/admin/dashboard');

    return { success: true };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
}