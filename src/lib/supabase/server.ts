import 'server-only';
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createClient(cookieStore?: Awaited<ReturnType<typeof cookies>>) {
  const cookieStoreToUse = cookieStore || await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStoreToUse.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStoreToUse.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}