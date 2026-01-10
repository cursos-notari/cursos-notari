'use server'

import { createClient } from "@/lib/supabase/server";
import { Class } from "@/types/interfaces/database/class";

interface GetAllClassesWithSchedulesReturn {
  success: boolean;
  data?: Class[] | [];
}

export async function getAllClassesWithSchedules(): Promise<GetAllClassesWithSchedulesReturn> {

  const supabase = await createClient();

  if (!supabase) return { success: false };

  const { data, error } = await supabase.rpc('get_all_classes_with_schedules');

  if (error) {
    console.error("Erro ao buscar turmas com horários:", error);
    return { success: false };
  }

  return {
    success: true,
    data: data as Class[]
  }
}