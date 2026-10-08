import { NextResponse } from "next/server";
import { citesteCategorii, scrieCategorii } from "@/lib/admin-date";
import { validaCategorie } from "@/lib/admin-validare";

export async function GET() {
  return NextResponse.json(await citesteCategorii());
}

export async function POST(request: Request) {
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
  if (categorii.some((c) => c.slug === rezultat.date.slug)) {
    return NextResponse.json(
      { erori: [`Există deja o categorie cu slug-ul „${rezultat.date.slug}”.`] },
      { status: 409 },
    );
  }

  await scrieCategorii([...categorii, rezultat.date]);
  return NextResponse.json(rezultat.date, { status: 201 });
}
