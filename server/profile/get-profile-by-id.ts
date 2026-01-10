"use server"

import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types/interfaces/database/role-type";
import { isValidUUID } from "@/utils/is-valid-UUID";

export async function getProfileById(id: string) {
  
  const valid = isValidUUID(id);

  if(!valid) return { success: false };

  const supabase = await createClient();

  if(!supabase) return { success: false };

  const { data, error } = await supabase.rpc('get_profile_by_id', {
    user_id: id
  }).single();

  if(error) {
    console.error('Erro ao buscar perfil do usuário', error);
    return { success: false };
  }

  return {
    success: true,
    data: data as Profile
  }
}