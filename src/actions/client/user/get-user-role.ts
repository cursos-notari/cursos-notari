import { supabase } from '@/supabase/browser-client'
import type { RoleType } from '@/types/database/role-type'

export async function getUserRole(): Promise<RoleType | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data.role as RoleType
}