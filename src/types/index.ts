// DECIZIE: slug-ul de categorie e `string`, nu o uniune fixă. Panoul de
// administrare poate crea categorii noi, deci lista nu mai e cunoscută la
// compilare. Cele șase de mai jos rămân documentate ca referință.
// „mese” | „manere” | „antrenament” | „protectie” | „imbracaminte” | „recuperare”
export type CategorieSlug = string;

export type StareStoc = "in-stoc" | "stoc-limitat" | "la-comanda" | "epuizat";

export type Eticheta = "nou" | "bestseller" | "reducere" | "produs-moldovenesc";

export type Produs = {
  slug: string;
  nume: string;
  sku: string;
  categorie: CategorieSlug;
  pret: number; // MDL, TVA inclus
  pretVechi?: number; // pentru afișarea reducerii
  descriereScurta: string; // 1 propoziție, max 120 caractere
  descriere: string; // 2–4 propoziții
  specificatii: { eticheta: string; valoare: string }[];
  imagini: string[]; // minim 2, maxim 4
  stoc: StareStoc;
  etichete?: Eticheta[];
  marimi?: string[]; // doar textile
  greutateKg?: number;
  voluminos?: boolean; // mesele → transport special
  personalizat?: boolean; // executat după specificațiile clientului → exceptat de la retur
  rating?: number; // 0–5, DEMO
  nrRecenzii?: number; // DEMO
};

export type Categorie = {
  slug: CategorieSlug;
  nume: string;
  descriere: string;
  imagine: string;
};

export type LinieCos = { slug: string; cantitate: number; marime?: string };

export type BlocArticol =
  | { tip: "h2"; text: string }
  | { tip: "p"; text: string }
  | { tip: "lista"; itemi: string[] };

export type Articol = {
  slug: string;
  titlu: string;
  rezumat: string;
  dataPublicare: string; // ISO, ex. „2026-02-11”
  timpCitire: number; // minute
  imagine: string;
  continut: BlocArticol[];
};

export type IntrebareFaq = {
  categorie: string;
  intrebare: string;
  raspuns: string;
};

/** Raion, municipiu sau unitate teritorială autonomă din Republica Moldova. */
export type Raion = { cod: string; nume: string };

/** Comanda trimisă la checkout — ajunge și în `sessionStorage`, și pe server. */
export type Comanda = {
  numar: string;
  data: string;
  linii: {
    slug: string;
    nume: string;
    cantitate: number;
    marime?: string;
    pretUnitar: number;
  }[];
  subtotal: number;
  costLivrare: number;
  total: number;
  client: {
    nume: string;
    prenume: string;
    email: string;
    telefon: string;
    raion: string;
    localitate: string;
    strada: string;
    codPostal: string;
    detalii?: string;
  };
  metodaLivrare: string;
  metodaPlata: string;
  observatii?: string;
};

export type StatusComanda =
  | "noua"
  | "confirmata"
  | "expediata"
  | "livrata"
  | "anulata";

/** Comanda așa cum e păstrată în `comenzi.json` și afișată în administrare. */
export type ComandaSalvata = Comanda & {
  status: StatusComanda;
  /** ISO, momentul în care serverul a primit comanda. */
  primitaLa: string;
};
