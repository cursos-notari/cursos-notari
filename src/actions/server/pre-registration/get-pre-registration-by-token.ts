import { createClient } from '@/supabase/server-client';
import { createServiceClient } from '@/supabase/service-client';
import { PreRegistration } from '@/types/database/pre-registration';
import { SupabaseClient } from '@supabase/supabase-js';

export interface GetPreRegistrationByTokenResult {
  success: boolean;
  message: string;
  code?: string;
  data?: PreRegistration;
}

export async function getPreRegistrationByToken(token: string, supabase?: SupabaseClient): Promise<GetPreRegistrationByTokenResult> {
  if (!supabase) supabase = createServiceClient() as SupabaseClient;

  if (!supabase) {
    return {
      success: false,
      message: 'Erro interno: cliente Supabase não disponível'
    }
  }

  const { data, error } = await supabase.rpc('get_pre_registration_by_token', {
    p_token: token
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