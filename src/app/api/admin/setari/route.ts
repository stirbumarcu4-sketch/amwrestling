import { NextResponse } from "next/server";
import { citesteSetari, scrieSetari } from "@/lib/admin-date";
import type { SetariSite } from "@/data/site";

export async function GET() {
  return NextResponse.json(await citesteSetari());
}

const text = (v: unknown, implicit: string): string =>
  typeof v === "string" && v.trim() ? v.trim() : implicit;

const numar = (v: unknown, implicit: number): number => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : implicit;
};

/** Actualizare parțială: câmpurile lipsă sau invalide păstrează valoarea curentă. */
export async function PUT(request: Request) {
  let corp: Record<string, unknown>;
  try {
    corp = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ eroare: "Corp invalid." }, { status: 400 });
  }

  const curente = await citesteSetari();
  const social = (corp.social ?? {}) as Record<string, unknown>;

  const noi: SetariSite = {
    nume: text(corp.nume, curente.nume),
    numeScurt: text(corp.numeScurt, curente.numeScurt),
    tagline: text(corp.tagline, curente.tagline),
    descriere: text(corp.descriere, curente.descriere),
    url: text(corp.url, curente.url),
    email: text(corp.email, curente.email),
    telefon: text(corp.telefon, curente.telefon),
    adresa: text(corp.adresa, curente.adresa),
    idno: text(corp.idno, curente.idno),
    program: text(corp.program, curente.program),
    livrareGratuitaPeste: numar(
      corp.livrareGratuitaPeste,
      curente.livrareGratuitaPeste,
    ),
    costLivrare: numar(corp.costLivrare, curente.costLivrare),
    costLivrareVoluminos: numar(
      corp.costLivrareVoluminos,
      curente.costLivrareVoluminos,
    ),
    zileRetur: numar(corp.zileRetur, curente.zileRetur),
    social: {
      instagram: text(social.instagram, curente.social.instagram),
      facebook: text(social.facebook, curente.social.facebook),
      youtube: text(social.youtube, curente.social.youtube),
    },
  };

  await scrieSetari(noi);
  return NextResponse.json(noi);
}
