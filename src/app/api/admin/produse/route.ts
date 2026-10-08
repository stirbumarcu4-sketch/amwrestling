import { NextResponse } from "next/server";
import { citesteProduse, scrieProduse } from "@/lib/admin-date";
import { validaProdus } from "@/lib/admin-validare";

export async function GET() {
  return NextResponse.json(await citesteProduse());
}

/** Creează un produs nou. Slug-ul trebuie să fie unic. */
export async function POST(request: Request) {
  let corp: unknown;
  try {
    corp = await request.json();
  } catch {
    return NextResponse.json({ eroare: "Corp invalid." }, { status: 400 });
  }

  const rezultat = validaProdus(corp);
  if (!rezultat.ok) {
    return NextResponse.json({ erori: rezultat.erori }, { status: 400 });
  }

  const produse = await citesteProduse();
  if (produse.some((p) => p.slug === rezultat.date.slug)) {
    return NextResponse.json(
      { erori: [`Există deja un produs cu slug-ul „${rezultat.date.slug}”.`] },
      { status: 409 },
    );
  }

  // Produsele noi intră la început, ca să fie vizibile imediat în listă.
  await scrieProduse([rezultat.date, ...produse]);
  return NextResponse.json(rezultat.date, { status: 201 });
}
