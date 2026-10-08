import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_SESIUNE, sesiuneValida } from "@/lib/admin-auth";

// Începând cu Next.js 16, fișierul de middleware se numește `proxy.ts`.
// Rolul lui aici e doar poarta de intrare: blochează rutele de administrare
// pentru cine nu are cookie de sesiune valid. Rutele API își verifică oricum
// sesiunea încă o dată, ca protecția să nu stea doar pe acest strat.

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pagina de login și ruta care o deservește trebuie să rămână publice,
  // altfel nimeni nu s-ar putea autentifica.
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_SESIUNE)?.value;
  if (await sesiuneValida(token)) {
    return NextResponse.next();
  }

  // API-ul primește 401 (ca fetch-ul din client să poată reacționa), paginile
  // primesc redirect către login, cu adresa cerută păstrată în query.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ eroare: "Neautentificat" }, { status: 401 });
  }

  const login = new URL("/admin/login", request.url);
  login.searchParams.set("redirect", pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
