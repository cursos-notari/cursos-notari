"use server"

import { Class } from "@/types/database/class";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getAllClassesWithSchedules(supabase: SupabaseClient): Promise<Class[]> {
  const { data, error } = await supabase.rpc('get_all_classes_with_schedules');

  if (error) {
    console.error("Erro ao buscar turmas com horários:", error);
    return [];
  }

  return data as Class[];
}