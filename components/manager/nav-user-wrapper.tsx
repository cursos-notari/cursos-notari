import { createClient } from "@/lib/supabase/server"
import { NavUser } from "./nav-user"
import { getProfileById } from "@/server/profile/get-profile-by-id";
import { redirect } from "next/navigation";

export async function NavUserWrapper() {

  const supabase = await createClient();

  if (!supabase) throw new Error("Ocorreu um erro");

  const user = await supabase.auth.getUser().then(res => res.data.user);

  if (!user) redirect("/admin/login");

  const res = await getProfileById(user.id);

  const profile = res.success ? res.data : null;

  const userData = {
    name: profile?.name || user?.email?.split('@')[0] || "Usuário",
    email: user?.email || "",
    avatar: profile?.avatar_url || "",
  }

  return <NavUser user={userData} />
}