import 'server-only';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

// esta função cria o cliente de acesso irrestrito
export function createClient() {
  if (!supabaseUrl || !supabaseSecretKey) {
    console.error('Variáveis de ambiente não encontradas');
    return false
  }

  return createServiceClient(
    supabaseUrl,
    supabaseSecretKey,
    {
      auth: {
        persistSession: false,
      }
    }
  );
};