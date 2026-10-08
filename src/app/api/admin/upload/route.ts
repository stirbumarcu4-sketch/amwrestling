import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { slugifica } from "@/lib/admin-date";

// Încarcă o imagine, o normalizează la WebP și o scrie în `public/`.
//
// Imaginea nu păstrează niciodată numele trimis de client: îl trecem prin
// `slugifica` și adăugăm un sufix de timp. Astfel calea nu poate conține `..`,
// separatori sau alte caractere prin care s-ar scrie în afara directorului.

const MARIME_MAXIMA = 12 * 1024 * 1024; // 12 MB
const TIPURI_PERMISE = ["image/jpeg", "image/png", "image/webp", "image/avif"];

/** Produsele folosesc cadru pătrat 900×900, categoriile 3:2 la 1200×800. */
const FORMATE = {
  produse: { latime: 900, inaltime: 900 },
  categorii: { latime: 1200, inaltime: 800 },
} as const;

export async function POST(request: Request) {
  let formular: FormData;
  try {
    formular = await request.formData();
  } catch {
    return NextResponse.json({ eroare: "Formular invalid." }, { status: 400 });
  }

  const fisier = formular.get("fisier");
  if (!(fisier instanceof File)) {
    return NextResponse.json({ eroare: "Lipsește fișierul." }, { status: 400 });
  }

  const destinatie = String(formular.get("destinatie") ?? "produse");
  if (destinatie !== "produse" && destinatie !== "categorii") {
    return NextResponse.json({ eroare: "Destinație invalidă." }, { status: 400 });
  }

  if (!TIPURI_PERMISE.includes(fisier.type)) {
    return NextResponse.json(
      { eroare: "Doar JPEG, PNG, WebP sau AVIF." },
      { status: 415 },
    );
  }

  if (fisier.size > MARIME_MAXIMA) {
    return NextResponse.json(
      { eroare: "Fișierul depășește 12 MB." },
      { status: 413 },
    );
  }

  const octeti = Buffer.from(await fisier.arrayBuffer());

  const bazaCerut = slugifica(fisier.name.replace(/\.[^.]+$/, "")) || "imagine";
  const nume = `${bazaCerut}-${Date.now().toString(36)}.webp`;

  const format = FORMATE[destinatie];
  const director = join(process.cwd(), "public", destinatie);

  try {
    // `sharp` refuză datele care nu sunt o imagine validă, deci reîncodarea
    // dublează verificarea tipului declarat în `Content-Type`.
    const procesata = await sharp(octeti)
      .resize(format.latime, format.inaltime, { fit: "cover", position: "center" })
      .webp({ quality: 85 })
      .toBuffer();

    await mkdir(director, { recursive: true });
    await writeFile(join(director, nume), procesata);
  } catch {
    return NextResponse.json(
      { eroare: "Imaginea nu a putut fi procesată." },
      { status: 422 },
    );
  }

  return NextResponse.json({ cale: `/${destinatie}/${nume}` }, { status: 201 });
}
