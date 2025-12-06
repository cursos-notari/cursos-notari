'use server'

import { cache } from "react";
import { PublicClass } from "@/types/interfaces/database/class";
import { cacheLife } from "next/cache";
import { createServiceClient } from "@/supabase/service-client";

interface Return {
  success: boolean;
  data?: PublicClass;
  code?: string;
  message: string;
}

export const getClassById = cache(async (classId: string): Promise<Return> => {
  "use cache"

  cacheLife('seconds');

  const supabase = createServiceClient();

  if(!supabase) return {
    success: false,
    message: "Não foi possível criar o cliente supabase",
  }

  const { data, error } = await supabase
    .from('open_classes')
    .select('*')
    .eq('id', classId)
    .maybeSingle();

  if (error) {
    console.error(`${error.code}:`, error.message);
    return {
      success: false,
      code: error.code,
      message: error.message
    };
  }

  return {
    success: true,
    message: 'Turma encontrada com sucesso.',
    data: data
  };
})