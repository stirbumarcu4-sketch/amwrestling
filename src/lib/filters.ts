import { normalizeaza } from "@/lib/utils";
import type { CategorieSlug, Eticheta, Produs, StareStoc } from "@/types";

export const PRODUSE_PE_PAGINA = 12;

export const optiuniSortare = [
  { valoare: "relevanta", eticheta: "Relevanță" },
  { valoare: "pret-asc", eticheta: "Preț crescător" },
  { valoare: "pret-desc", eticheta: "Preț descrescător" },
  { valoare: "alfabetic", eticheta: "Alfabetic A–Z" },
  { valoare: "rating", eticheta: "Cele mai bine cotate" },
] as const;

export type Sortare = (typeof optiuniSortare)[number]["valoare"];

// Praguri în MDL, alese pe distribuția reală a catalogului (172 – 10.018 MDL):
// accesoriile mici stau sub 500, mânerele și protecțiile între 500 și 2.000,
// seturile și scripeții între 2.000 și 6.000, mesele peste 6.000.
export const intervalePret = [
  { id: "sub-500", eticheta: "Sub 500 MDL", min: 0, max: 500 },
  { id: "500-2000", eticheta: "500 – 2.000 MDL", min: 500, max: 2000 },
  { id: "2000-6000", eticheta: "2.000 – 6.000 MDL", min: 2000, max: 6000 },
  { id: "peste-6000", eticheta: "Peste 6.000 MDL", min: 6000, max: null },
] as const;

export const optiuniDisponibilitate = [
  { valoare: "in-stoc", eticheta: "În stoc" },
  { valoare: "stoc-limitat", eticheta: "Stoc limitat" },
] as const;

export const optiuniEtichete = [
  { valoare: "nou", eticheta: "Nou" },
  { valoare: "bestseller", eticheta: "Bestseller" },
  { valoare: "reducere", eticheta: "Reducere" },
  { valoare: "produs-moldovenesc", eticheta: "Produs moldovenesc" },
] as const;

export type StareFiltre = {
  categorii: CategorieSlug[];
  pretMin: number | null;
  pretMax: number | null;
  disponibilitate: StareStoc[];
  etichete: Eticheta[];
  sort: Sortare;
  pagina: number;
};

export const filtreImplicite: StareFiltre = {
  categorii: [],
  pretMin: null,
  pretMax: null,
  disponibilitate: [],
  etichete: [],
  sort: "relevanta",
  pagina: 1,
};

const listaDinParam = (valoare: string | null): string[] =>
  valoare ? valoare.split(",").filter(Boolean) : [];

const numarDinParam = (valoare: string | null): number | null => {
  if (!valoare) return null;
  const n = Number(valoare);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

const esteSortare = (v: string | null): v is Sortare =>
  optiuniSortare.some((o) => o.valoare === v);

/** Transformă parametrii din URL în starea de filtrare. */
export function citesteFiltre(params: URLSearchParams): StareFiltre {
  const sort = params.get("sort");
  const pagina = Number(params.get("pagina"));

  return {
    categorii: listaDinParam(params.get("categorie")) as CategorieSlug[],
    pretMin: numarDinParam(params.get("pretMin")),
    pretMax: numarDinParam(params.get("pretMax")),
    disponibilitate: listaDinParam(params.get("stoc")) as StareStoc[],
    etichete: listaDinParam(params.get("eticheta")) as Eticheta[],
    sort: esteSortare(sort) ? sort : "relevanta",
    pagina: Number.isInteger(pagina) && pagina > 0 ? pagina : 1,
  };
}

/** Serializează starea înapoi în query string, omițând valorile implicite. */
export function scrieFiltre(stare: StareFiltre): string {
  const params = new URLSearchParams();

  if (stare.categorii.length) params.set("categorie", stare.categorii.join(","));
  if (stare.pretMin !== null) params.set("pretMin", String(stare.pretMin));
  if (stare.pretMax !== null) params.set("pretMax", String(stare.pretMax));
  if (stare.disponibilitate.length)
    params.set("stoc", stare.disponibilitate.join(","));
  if (stare.etichete.length) params.set("eticheta", stare.etichete.join(","));
  if (stare.sort !== "relevanta") params.set("sort", stare.sort);
  if (stare.pagina > 1) params.set("pagina", String(stare.pagina));

  return params.toString();
}

export function areFiltreActive(stare: StareFiltre): boolean {
  return (
    stare.categorii.length > 0 ||
    stare.pretMin !== null ||
    stare.pretMax !== null ||
    stare.disponibilitate.length > 0 ||
    stare.etichete.length > 0
  );
}

/** Aplică filtrele și sortarea. Paginarea se face separat, după numărare. */
export function aplicaFiltre(lista: Produs[], stare: StareFiltre): Produs[] {
  const filtrate = lista.filter((produs) => {
    if (stare.categorii.length && !stare.categorii.includes(produs.categorie)) {
      return false;
    }
    if (stare.pretMin !== null && produs.pret < stare.pretMin) return false;
    if (stare.pretMax !== null && produs.pret > stare.pretMax) return false;
    if (
      stare.disponibilitate.length &&
      !stare.disponibilitate.includes(produs.stoc)
    ) {
      return false;
    }
    if (stare.etichete.length) {
      const ale = produs.etichete ?? [];
      if (!stare.etichete.some((e) => ale.includes(e))) return false;
    }
    return true;
  });

  switch (stare.sort) {
    case "pret-asc":
      return [...filtrate].sort((a, b) => a.pret - b.pret);
    case "pret-desc":
      return [...filtrate].sort((a, b) => b.pret - a.pret);
    case "alfabetic":
      return [...filtrate].sort((a, b) => a.nume.localeCompare(b.nume, "ro"));
    case "rating":
      return [...filtrate].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    default:
      return filtrate;
  }
}

export function paginare<T>(lista: T[], pagina: number) {
  const totalPagini = Math.max(1, Math.ceil(lista.length / PRODUSE_PE_PAGINA));
  const paginaCurenta = Math.min(Math.max(pagina, 1), totalPagini);
  const inceput = (paginaCurenta - 1) * PRODUSE_PE_PAGINA;
  return {
    elemente: lista.slice(inceput, inceput + PRODUSE_PE_PAGINA),
    totalPagini,
    paginaCurenta,
  };
}

/** Căutare fără accente peste nume, descriere scurtă și SKU. */
export function cauta(lista: Produs[], termen: string): Produs[] {
  const q = normalizeaza(termen);
  if (!q) return [];
  return lista.filter((p) =>
    [p.nume, p.descriereScurta, p.sku].some((camp) =>
      normalizeaza(camp).includes(q),
    ),
  );
}
