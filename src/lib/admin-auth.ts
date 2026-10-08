// Sesiunea de administrare: un cookie semnat HMAC-SHA256, fără bibliotecă
// externă și fără stocare pe server.
//
// Folosește Web Crypto (`crypto.subtle`), nu `node:crypto`, fiindcă middleware-ul
// rulează pe Edge runtime, unde modulele Node nu există.

export const COOKIE_SESIUNE = "hp_admin";
const DURATA_SESIUNE_SECUNDE = 60 * 60 * 12; // 12 ore

const codificator = new TextEncoder();

function secret(): string | null {
  return process.env.ADMIN_SECRET || null;
}

/** base64url, fără `+`, `/` sau `=`, ca valoarea să fie validă într-un cookie. */
function base64url(octeti: ArrayBuffer | Uint8Array): string {
  const bytes = octeti instanceof Uint8Array ? octeti : new Uint8Array(octeti);
  let binar = "";
  for (const b of bytes) binar += String.fromCharCode(b);
  return btoa(binar).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function semneaza(mesaj: string, cheieBruta: string): Promise<string> {
  const cheie = await crypto.subtle.importKey(
    "raw",
    codificator.encode(cheieBruta),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const semnatura = await crypto.subtle.sign(
    "HMAC",
    cheie,
    codificator.encode(mesaj),
  );
  return base64url(semnatura);
}

/** Comparație în timp constant, ca să nu scurgem informație prin durata ei. */
function egalConstant(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diferenta = 0;
  for (let i = 0; i < a.length; i++) {
    diferenta |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diferenta === 0;
}

/**
 * Token de forma `expirare.semnatura`. Întoarce `null` dacă serverul nu are
 * `ADMIN_SECRET` — fără el nu se pot semna sesiuni.
 */
export async function creeazaSesiune(): Promise<{
  valoare: string;
  maxAge: number;
} | null> {
  const cheie = secret();
  if (!cheie) return null;

  const expira = Math.floor(Date.now() / 1000) + DURATA_SESIUNE_SECUNDE;
  const payload = String(expira);
  const semnatura = await semneaza(payload, cheie);
  return { valoare: `${payload}.${semnatura}`, maxAge: DURATA_SESIUNE_SECUNDE };
}

export async function sesiuneValida(
  token: string | undefined,
): Promise<boolean> {
  const cheie = secret();
  // DECIZIE: fără secret, nicio sesiune nu e validă — dar nu aruncăm.
  // `proxy.ts` rulează la fiecare cerere spre /admin; o excepție acolo ar da
  // eroare 500 în loc să trimită vizitatorul la pagina de autentificare.
  if (!cheie || !token) return false;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;

  const payload = token.slice(0, separator);
  const semnatura = token.slice(separator + 1);

  const expira = Number(payload);
  if (!Number.isFinite(expira) || expira < Date.now() / 1000) return false;

  return egalConstant(semnatura, await semneaza(payload, cheie));
}

/**
 * Verifică perechea e-mail + parolă față de valorile din mediu. Dacă acestea
 * lipsesc, nicio pereche nu e acceptată — administrarea rămâne închisă.
 */
export function credentialeCorecte(email: unknown, parola: unknown): boolean {
  const emailAsteptat = process.env.ADMIN_EMAIL;
  const parolaAsteptata = process.env.ADMIN_PAROLA;

  if (!emailAsteptat || !parolaAsteptata) return false;
  if (typeof email !== "string" || typeof parola !== "string") return false;

  // E-mailul se compară fără diferență de majuscule și fără spații la capete;
  // parola, exact cum a fost scrisă.
  const emailOk = egalConstant(
    email.trim().toLowerCase(),
    emailAsteptat.trim().toLowerCase(),
  );
  const parolaOk = egalConstant(parola, parolaAsteptata);

  // Ambele comparații rulează mereu, ca durata răspunsului să nu arate care
  // dintre cele două câmpuri a fost greșit.
  return emailOk && parolaOk;
}
