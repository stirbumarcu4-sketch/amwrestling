import type { Categorie, Produs } from "@/types";

// Validare manuală pentru datele trimise din panoul de administrare. Proiectul
// nu are zod în dependențe, iar schema e mică și stabilă — nu merită o
// bibliotecă nouă doar pentru atât.

const STARI_STOC = ["in-stoc", "stoc-limitat", "la-comanda", "epuizat"];
const ETICHETE = ["nou", "bestseller", "reducere", "produs-moldovenesc"];

export type RezultatValidare<T> =
  | { ok: true; date: T }
  | { ok: false; erori: string[] };

const esteObiect = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const textCurat = (v: unknown): string =>
  typeof v === "string" ? v.trim() : "";

/** Acceptă doar căi locale sub /produse/ sau /categorii/, niciodată URL-uri externe sau `../`. */
const esteCaleImagine = (v: unknown): v is string =>
  typeof v === "string" &&
  /^\/(produse|categorii)\/[A-Za-z0-9._-]+$/.test(v) &&
  !v.includes("..");

export function validaProdus(brut: unknown): RezultatValidare<Produs> {
  const erori: string[] = [];
  if (!esteObiect(brut)) return { ok: false, erori: ["Corp invalid."] };

  const slug = textCurat(brut.slug);
  if (!/^[a-z0-9-]{2,80}$/.test(slug)) {
    erori.push("Slug invalid (doar litere mici, cifre și cratime).");
  }

  const nume = textCurat(brut.nume);
  if (nume.length < 2) erori.push("Numele e obligatoriu.");

  const sku = textCurat(brut.sku);
  if (sku.length < 1) erori.push("SKU-ul e obligatoriu.");

  const categorie = textCurat(brut.categorie);
  if (!categorie) erori.push("Categoria e obligatorie.");

  const pret = Number(brut.pret);
  if (!Number.isFinite(pret) || pret < 0) erori.push("Prețul trebuie să fie un număr pozitiv.");

  let pretVechi: number | undefined;
  if (brut.pretVechi !== undefined && brut.pretVechi !== null && brut.pretVechi !== "") {
    pretVechi = Number(brut.pretVechi);
    if (!Number.isFinite(pretVechi) || pretVechi < 0) {
      erori.push("Prețul vechi trebuie să fie un număr pozitiv.");
    } else if (pretVechi <= pret) {
      erori.push("Prețul vechi trebuie să fie mai mare decât prețul curent.");
    }
  }

  const descriereScurta = textCurat(brut.descriereScurta);
  if (!descriereScurta) erori.push("Descrierea scurtă e obligatorie.");
  if (descriereScurta.length > 160) erori.push("Descrierea scurtă depășește 160 de caractere.");

  const descriere = textCurat(brut.descriere);
  if (!descriere) erori.push("Descrierea e obligatorie.");

  const stoc = textCurat(brut.stoc);
  if (!STARI_STOC.includes(stoc)) erori.push("Starea stocului e invalidă.");

  const specificatiiBrute = Array.isArray(brut.specificatii) ? brut.specificatii : [];
  const specificatii = specificatiiBrute
    .filter(esteObiect)
    .map((s) => ({ eticheta: textCurat(s.eticheta), valoare: textCurat(s.valoare) }))
    .filter((s) => s.eticheta && s.valoare);

  const imagini = (Array.isArray(brut.imagini) ? brut.imagini : []).filter(esteCaleImagine);
  if (imagini.length < 1) erori.push("E nevoie de cel puțin o imagine.");
  if (imagini.length > 4) erori.push("Maximum 4 imagini.");

  const etichete = (Array.isArray(brut.etichete) ? brut.etichete : [])
    .filter((e): e is string => typeof e === "string")
    .filter((e) => ETICHETE.includes(e));

  const marimi = (Array.isArray(brut.marimi) ? brut.marimi : [])
    .map(textCurat)
    .filter(Boolean);

  if (erori.length) return { ok: false, erori };

  const produs: Produs = {
    slug,
    nume,
    sku,
    categorie,
    pret,
    descriereScurta,
    descriere,
    specificatii,
    imagini,
    stoc: stoc as Produs["stoc"],
  };

  // Câmpurile opționale se adaugă doar dacă au valoare, ca JSON-ul să nu se
  // umple de `undefined`/`null` acolo unde tipul le declară lipsă.
  if (pretVechi !== undefined) produs.pretVechi = pretVechi;
  if (etichete.length) produs.etichete = etichete as Produs["etichete"];
  if (marimi.length) produs.marimi = marimi;

  const greutate = Number(brut.greutateKg);
  if (Number.isFinite(greutate) && greutate > 0) produs.greutateKg = greutate;

  if (brut.voluminos === true) produs.voluminos = true;
  if (brut.personalizat === true) produs.personalizat = true;

  const rating = Number(brut.rating);
  if (Number.isFinite(rating) && rating > 0 && rating <= 5) produs.rating = rating;

  const nrRecenzii = Number(brut.nrRecenzii);
  if (Number.isFinite(nrRecenzii) && nrRecenzii > 0) {
    produs.nrRecenzii = Math.round(nrRecenzii);
  }

  return { ok: true, date: produs };
}

export function validaCategorie(brut: unknown): RezultatValidare<Categorie> {
  const erori: string[] = [];
  if (!esteObiect(brut)) return { ok: false, erori: ["Corp invalid."] };

  const slug = textCurat(brut.slug);
  if (!/^[a-z0-9-]{2,60}$/.test(slug)) {
    erori.push("Slug invalid (doar litere mici, cifre și cratime).");
  }

  const nume = textCurat(brut.nume);
  if (nume.length < 2) erori.push("Numele e obligatoriu.");

  const descriere = textCurat(brut.descriere);
  if (!descriere) erori.push("Descrierea e obligatorie.");

  const imagine = textCurat(brut.imagine);
  if (!esteCaleImagine(imagine)) {
    erori.push("Imaginea trebuie să fie o cale locală validă.");
  }

  if (erori.length) return { ok: false, erori };
  return { ok: true, date: { slug, nume, descriere, imagine } };
}
