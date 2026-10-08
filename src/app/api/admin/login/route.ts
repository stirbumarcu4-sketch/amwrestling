import { NextResponse } from "next/server";
import {
  COOKIE_SESIUNE,
  creeazaSesiune,
  credentialeCorecte,
} from "@/lib/admin-auth";

// Ruta e exceptată din `proxy.ts`, altfel nimeni nu s-ar putea autentifica.

export async function POST(request: Request) {
  let corp: unknown;
  try {
    corp = await request.json();
  } catch {
    return NextResponse.json({ eroare: "Corp invalid." }, { status: 400 });
  }

  const { email, parola } = (corp ?? {}) as {
    email?: unknown;
    parola?: unknown;
  };

  if (!credentialeCorecte(email, parola)) {
    // Întârziere scurtă, ca încercarea prin forță brută să fie mai lentă.
    await new Promise((r) => setTimeout(r, 400));
    // Mesaj unic pentru ambele cazuri: nu confirmăm dacă e-mailul există.
    return NextResponse.json(
      { eroare: "E-mail sau parolă greșită." },
      { status: 401 },
    );
  }

  const sesiune = await creeazaSesiune();
  if (!sesiune) {
    // Parola e corectă, dar serverului îi lipsește ADMIN_SECRET, deci nu poate
    // semna cookie-ul. Se întâmplă când variabilele nu sunt puse pe găzduire.
    return NextResponse.json(
      { eroare: "Serverul nu are ADMIN_SECRET configurat." },
      { status: 500 },
    );
  }

  const { valoare, maxAge } = sesiune;
  const raspuns = NextResponse.json({ ok: true });
  raspuns.cookies.set(COOKIE_SESIUNE, valoare, {
    httpOnly: true,
    sameSite: "lax",
    // `secure` doar în producție: pe `localhost` fără HTTPS cookie-ul ar fi respins.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return raspuns;
}

/** Delogare: șterge cookie-ul de sesiune. */
export async function DELETE() {
  const raspuns = NextResponse.json({ ok: true });
  raspuns.cookies.set(COOKIE_SESIUNE, "", { path: "/", maxAge: 0 });
  return raspuns;
}
