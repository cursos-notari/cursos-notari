'use server'
import 'server-only'

import { createClient } from '@/lib/supabase/server';
import { PreRegistration } from '@/types/interfaces/database/pre-registration';

export interface GetPreRegistrationByIdResponse {
  success: boolean;
  message?: string;
  code?: string;
  data?: PreRegistration;
}

export async function getPreRegistrationById(id: string): Promise<GetPreRegistrationByIdResponse> {
  
  const supabase = await createClient();

  if (!supabase) return { success: false };

  const { data, error } = await supabase.rpc('get_pre_registration_by_id', { p_id: id });

  if (error) {
    console.error('Erro ao executar função get_pre_registration_by_id:', error);
    return { success: false };
  }

  if (!data.success) {

    const { code, message } = data;

    if (code === 'internal_error') {
      console.error(`${code} : ${message}`);
    }

    return { success: false };
  }

  return data;
}