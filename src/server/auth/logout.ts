"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation";

export async function logout() {

  const supabase = await createClient();

  if(!supabase) return { success: false };

  await supabase.auth.signOut();

  redirect('/admin/login');
}