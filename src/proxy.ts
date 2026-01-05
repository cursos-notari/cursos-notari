import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const result = await updateSession(req);
  
  if (result === false) {
    return NextResponse.json(
      { error: "Erro de configuração do servidor" },
      { status: 500 }
    );
  }

  const { supabaseResponse, user } = result;

  if (user) {
    
    if (path === "/admin/login" || path === "/admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    
    return supabaseResponse;
  }

  if (!user) {

    if (path === "/admin/login") return NextResponse.next();
    
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return supabaseResponse;
}

export const config = {
  // o garante que este middleware só roda para as rotas /admin
  matcher: ["/admin/:path*"],
};