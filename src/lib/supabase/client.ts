import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function createClient() {

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error(`
      Variáveis de ambiente não definidas:\n
      SUPABASE_URL: ${SUPABASE_URL}\n
      SUPABASE_PUBLISHABLE_KEY: ${SUPABASE_PUBLISHABLE_KEY}
    `);
    return false;
  }

  return createBrowserClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
  );
}