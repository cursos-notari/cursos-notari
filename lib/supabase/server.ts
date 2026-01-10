import 'server-only';
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function createClient() {

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error(`
      Variáveis de ambiente não definidas:\n
      SUPABASE_URL: ${SUPABASE_URL}\n
      SUPABASE_PUBLISHABLE_KEY: ${SUPABASE_PUBLISHABLE_KEY}
    `);
    return false;
  }

  const cookieStore = await cookies();

  return createServerClient(
   SUPABASE_URL,
   SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { }
        },
      },
    }
  );
}