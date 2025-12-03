"use server"

import { createServiceClient } from "@/supabase/service-client";
import { PublicClass } from "@/types/database/class";
import { cacheLife } from "next/cache";
import { cache } from "react";

export const getOpenClasses = cache(async (): Promise<PublicClass[]> => {
  "use cache"

  cacheLife("seconds")

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
})