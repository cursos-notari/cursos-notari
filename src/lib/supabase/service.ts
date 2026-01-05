import 'server-only';
import { createClient as createServiceClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

// esta função cria o cliente de acesso irrestrito
export function createClient() {

  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    console.error(`
      Variáveis de ambiente não definidas:\n
      SUPABASE_URL: ${SUPABASE_URL}\n
      SUPABASE_SECRET_KEY: ${SUPABASE_SECRET_KEY}
    `);
    return false;
  }

  return createServiceClient(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY,
    {
      auth: {
        persistSession: false,
      }
    }
  );
};