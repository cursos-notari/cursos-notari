import { createClient } from '@supabase/supabase-js'

export function createBuildClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  
  return createClient(supabaseUrl, supabaseKey)
}