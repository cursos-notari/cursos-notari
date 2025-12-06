'use server'
import 'server-only'

import { createServiceClient } from '@/supabase/service-client';
import { PreRegistration } from '@/types/interfaces/database/pre-registration';
import { SupabaseClient } from '@supabase/supabase-js';

export interface GetPreRegistrationByIdResult {
  success: boolean;
  message: string;
  code?: string;
  data?: PreRegistration;
}

export async function getPreRegistrationById(id: string): Promise<GetPreRegistrationByIdResult> {
  const supabase = createServiceClient();

  if (!supabase) {
    return {
      success: false,
      message: 'Erro interno: cliente supabase não disponível'
    }
  }

  const { data, error } = await supabase.rpc('get_pre_registration_by_id', {
    p_id: id
  });

  if (error) {
    console.error('Erro ao executar função get_pre_registration_by_token:', error);
    return {
      success: false,
      code: error.code,
      message: error.message
    };
  }

  // o banco de dados retorna data, com o erro
  if (!data.success) console.error(`CÓDIGO: ${data.code} \n Erro ao buscar pré-registro:`, data.message);

  return data;
}