import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  citesteCategorii,
  citesteProduse,
  scrieCategorii,
  scrieProduse,
} from "@/lib/admin-date";
import { validaCategorie } from "@/lib/admin-validare";

type Context = { params: Promise<{ slug: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  const { slug } = await params;

  let corp: unknown;
  try {
    corp = await request.json();
  } catch {
    return NextResponse.json({ eroare: "Corp invalid." }, { status: 400 });
  }

  const rezultat = validaCategorie(corp);
  if (!rezultat.ok) {
    return NextResponse.json({ erori: rezultat.erori }, { status: 400 });
  }

  const categorii = await citesteCategorii();
  const index = categorii.findIndex((c) => c.slug === slug);
  if (index === -1) {
    return NextResponse.json({ eroare: "Categorie inexistentă." }, { status: 404 });
  }

  const slugNou = rezultat.date.slug;
  if (slugNou !== slug && categorii.some((c) => c.slug === slugNou)) {
    return NextResponse.json(
      { erori: [`Există deja o categorie cu slug-ul „${slugNou}”.`] },
      { status: 409 },
    );
  }

  categorii[index] = rezultat.date;
  await scrieCategorii(categorii);

  // Redenumirea slug-ului ar lăsa produsele legate de un slug inexistent, deci
  // le mutăm odată cu categoria.
  if (slugNou !== slug) {
    const produse = await citesteProduse();
    let mutate = 0;
    for (const p of produse) {
      if (p.categorie === slug) {
        p.categorie = slugNou;
        mutate++;
      }
    }
    if (mutate) await scrieProduse(produse);
  }

  return NextResponse.json(rezultat.date);
}

/** Refuză ștergerea cât timp categoria mai are produse — altfel ar rămâne orfane. */
export async function DELETE(_request: NextRequest, { params }: Context) {
  const { slug } = await params;

  const produse = await citesteProduse();
  const cuCategoria = produse.filter((p) => p.categorie === slug).length;
  if (cuCategoria > 0) {
    return NextResponse.json(
      {
        erori: [
          `Categoria are ${cuCategoria} ${cuCategoria === 1 ? "produs" : "produse"}. Mută-le sau șterge-le întâi.`,
        ],
      },
      { status: 409 },
    );
  }

  const categorii = await citesteCategorii();
  const ramase = categorii.filter((c) => c.slug !== slug);
  if (ramase.length === categorii.length) {
    return NextResponse.json({ eroare: "Categorie inexistentă." }, { status: 404 });
  }

  await scrieCategorii(ramase);
  return NextResponse.json({ ok: true });
}
