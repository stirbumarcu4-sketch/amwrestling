import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { citesteProduse, scrieProduse } from "@/lib/admin-date";
import { validaProdus } from "@/lib/admin-validare";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  const { slug } = await params;
  const produs = (await citesteProduse()).find((p) => p.slug === slug);
  if (!produs) {
    return NextResponse.json({ eroare: "Produs inexistent." }, { status: 404 });
  }
  return NextResponse.json(produs);
}

/** Actualizează produsul. Slug-ul poate fi schimbat, dacă noul slug e liber. */
export async function PUT(request: NextRequest, { params }: Context) {
  const { slug } = await params;

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
  const index = produse.findIndex((p) => p.slug === slug);
  if (index === -1) {
    return NextResponse.json({ eroare: "Produs inexistent." }, { status: 404 });
  }

  const slugNou = rezultat.date.slug;
  if (slugNou !== slug && produse.some((p) => p.slug === slugNou)) {
    return NextResponse.json(
      { erori: [`Există deja un produs cu slug-ul „${slugNou}”.`] },
      { status: 409 },
    );
  }

  produse[index] = rezultat.date;
  await scrieProduse(produse);
  return NextResponse.json(rezultat.date);
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { slug } = await params;
  const produse = await citesteProduse();
  const ramase = produse.filter((p) => p.slug !== slug);

  if (ramase.length === produse.length) {
    return NextResponse.json({ eroare: "Produs inexistent." }, { status: 404 });
  }

  await scrieProduse(ramase);
  return NextResponse.json({ ok: true });
}
