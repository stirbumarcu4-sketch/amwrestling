import { NextResponse } from "next/server";
import {
  citesteComenzi,
  citesteProduse,
  citesteSetari,
  scrieComenzi,
} from "@/lib/admin-date";
import { anuntaComandaPeTelegram } from "@/lib/notificare-telegram";
import type { ComandaSalvata } from "@/types";

// Ruta publică prin care checkout-ul depune comanda pe server. Până acum
// comanda trăia doar în `sessionStorage`, deci dispărea odată cu fila.

const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  let corp: Record<string, unknown>;
  try {
    corp = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ eroare: "Corp invalid." }, { status: 400 });
  }

  const liniiBrute = Array.isArray(corp.linii) ? corp.linii : [];
  if (!liniiBrute.length) {
    return NextResponse.json({ eroare: "Comandă fără produse." }, { status: 400 });
  }

  const clientBrut = (corp.client ?? {}) as Record<string, unknown>;
  const email = text(clientBrut.email);
  if (!email.includes("@")) {
    return NextResponse.json({ eroare: "E-mail invalid." }, { status: 400 });
  }

  // DECIZIE: prețurile se recalculează din catalog, nu se iau din corpul
  // cererii. Altfel oricine ar putea trimite `pretUnitar: 0`.
  const produse = await citesteProduse();
  const setari = await citesteSetari();

  const linii: ComandaSalvata["linii"] = [];
  for (const brut of liniiBrute) {
    if (typeof brut !== "object" || brut === null) continue;
    const l = brut as Record<string, unknown>;
    const produs = produse.find((p) => p.slug === text(l.slug));
    if (!produs) continue;

    const cantitate = Math.max(1, Math.min(99, Math.round(Number(l.cantitate) || 1)));
    const marime = text(l.marime);

    linii.push({
      slug: produs.slug,
      nume: produs.nume,
      cantitate,
      pretUnitar: produs.pret,
      ...(marime ? { marime } : {}),
    });
  }

  if (!linii.length) {
    return NextResponse.json(
      { eroare: "Niciun produs valid în comandă." },
      { status: 400 },
    );
  }

  const subtotal = linii.reduce((s, l) => s + l.pretUnitar * l.cantitate, 0);
  const areVoluminos = linii.some(
    (l) => produse.find((p) => p.slug === l.slug)?.voluminos,
  );
  const costLivrare =
    subtotal >= setari.livrareGratuitaPeste && !areVoluminos
      ? 0
      : areVoluminos
        ? setari.costLivrareVoluminos
        : setari.costLivrare;

  const acum = new Date();
  const comanda: ComandaSalvata = {
    numar: text(corp.numar) || `HP-${acum.getTime().toString(36).toUpperCase()}`,
    data: text(corp.data) || acum.toISOString(),
    linii,
    subtotal,
    costLivrare,
    total: subtotal + costLivrare,
    client: {
      nume: text(clientBrut.nume),
      prenume: text(clientBrut.prenume),
      email,
      telefon: text(clientBrut.telefon),
      raion: text(clientBrut.raion),
      localitate: text(clientBrut.localitate),
      strada: text(clientBrut.strada),
      codPostal: text(clientBrut.codPostal),
      ...(text(clientBrut.detalii) ? { detalii: text(clientBrut.detalii) } : {}),
    },
    metodaLivrare: text(corp.metodaLivrare),
    metodaPlata: text(corp.metodaPlata),
    ...(text(corp.observatii) ? { observatii: text(corp.observatii) } : {}),
    status: "noua",
    primitaLa: acum.toISOString(),
  };

  const comenzi = await citesteComenzi();
  await scrieComenzi([comanda, ...comenzi]);

  // După salvare, ca o problemă la Telegram să nu piardă comanda. Funcția nu
  // aruncă niciodată; dacă notificarea eșuează, comanda e deja pe disc.
  await anuntaComandaPeTelegram(comanda);

  return NextResponse.json({ ok: true, numar: comanda.numar }, { status: 201 });
}
