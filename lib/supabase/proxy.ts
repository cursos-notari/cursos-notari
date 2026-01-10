import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function updateSession(request: NextRequest): Promise<{ 
  supabaseResponse: NextResponse; 
  user: any 
} | false> {

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    console.error(`
      Variáveis de ambiente não definidas:\n
      SUPABASE_URL: ${SUPABASE_URL}\n
      SUPABASE_PUBLISHABLE_KEY: ${SUPABASE_PUBLISHABLE_KEY}
    `);
    return false;
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          
          supabaseResponse = NextResponse.next({ request });
          
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const { data } =  await supabase.auth.getUser();

  return { supabaseResponse, user: data.user };
}