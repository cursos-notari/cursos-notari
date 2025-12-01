"use server"

import { createServiceClient } from "@/supabase/service-client";
import { PublicClass } from "@/types/database/class";

export async function getOpenClasses(): Promise<PublicClass[]> {
  "use cache"

  const supabase = createServiceClient();

  if (!supabase) return [];

  console.log('buscou');

  const { data, error } = await supabase
    .from('open_classes')
    .select('*');

  if (error) {
    console.error("Erro ao buscar turmas públicas com horários:", error);
    return [];
  }

  return data;
}