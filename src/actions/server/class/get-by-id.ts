"use server"

import { cache } from "react";
import { PublicClass } from "@/types/database/class";
import { SupabaseClient } from "@supabase/supabase-js";

interface Return {
  success: boolean;
  data?: PublicClass;
  code?: string;
  message: string;
}

// a função que realmente busca os dados no banco
export async function getClassById(supabase: SupabaseClient, classId: string): Promise<Return> {
  
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
}