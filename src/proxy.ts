import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./supabase/helper";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Cria o cliente e a resposta para todas as rotas do matcher
  const { supabase, supabaseResponse } = createClient(req);

  // Verifica se o usuário está logado
  const { data: { session } } = await supabase.auth.getSession();

  // --- LÓGICA PARA USUÁRIO LOGADO ---
  if (session) {
    // Se o usuário logado tentar acessar a página de login OU a raiz /admin,
    // redireciona para o dashboard.
    if (path === "/admin/login" || path === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    // Para qualquer outra rota /admin, permite o acesso.
    return supabaseResponse;
  }

  // --- LÓGICA PARA USUÁRIO NÃO LOGADO ---
  if (!session) {
    // Se o usuário não logado já está na página de login, permite o acesso.
    if (path === "/admin/login") {
      return NextResponse.next();
    }
    // Para qualquer outra rota /admin (incluindo a raiz /admin),
    // redireciona para a página de login.
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return supabaseResponse;
}

export const config = {
  // O matcher já garante que este middleware só roda para as rotas /admin
  matcher: ["/admin/:path*"],
};