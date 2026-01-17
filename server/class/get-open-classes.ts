"use server"

import { cache } from "react";
import { cacheLife } from "next/cache";
import { PublicClass } from "@/types/interfaces/database/class";
import { createClient } from "@/lib/supabase/service";

export const getOpenClasses = cache(async (): Promise<PublicClass[]> => {
  "use cache"

  cacheLife("seconds");

  const supabase = createClient();

  if (!supabase) return [];

  const { data, error } = await supabase
    .from('open_classes')
    .select('*');

  if (error) {
    console.error("Erro ao buscar turmas públicas com horários:", error);
    return [];
  }

  return data;
})