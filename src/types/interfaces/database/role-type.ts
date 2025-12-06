export type RoleType = 'owner' | 'admin'

export interface Profile {
  id: string
  email: string
  name: string | null
  role: RoleType
  created_at: string
  updated_at: string
}