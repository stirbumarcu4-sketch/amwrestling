import type { Produs } from "@/types";
import dateProduse from "./produse.json";

// DECIZIE: catalogul stă în `produse.json`, nu într-un literal TypeScript, ca
// panoul de administrare să-l poată rescrie la runtime. Modulul acesta rămâne
// punctul unic de intrare — toate paginile și componentele importă în
// continuare `produse` și selectorii de mai jos, exact ca înainte.
//
// În `next dev`, o scriere în JSON declanșează recompilarea și valorile de mai
// jos se recalculează. Într-un build de producție datele sunt înghețate la
// momentul build-ului, deci după modificări din admin trebuie refăcut build-ul.
export const produse = dateProduse as Produs[];

// ── Selectori (fără bibliotecă externă) ──────────────────────────────────────
export const getProdus = (slug: string) => produse.find((p) => p.slug === slug);

export const getProduseDinCategorie = (c: string) =>
  produse.filter((p) => p.categorie === c);

export const getProduseRecomandate = (slug: string, limita = 4) => {
  const p = getProdus(slug);
  if (!p) return [];
  return produse
    .filter((x) => x.slug !== slug && x.categorie === p.categorie)
    .slice(0, limita);
};

export const getBestsellers = (limita = 8) =>
  produse.filter((p) => p.etichete?.includes("bestseller")).slice(0, limita);

export const getNoutati = (limita = 4) =>
  produse.filter((p) => p.etichete?.includes("nou")).slice(0, limita);

export const getReduceri = (limita = 4) =>
  produse.filter((p) => p.pretVechi !== undefined).slice(0, limita);

// Fallback-ul pe 0 acoperă catalogul gol: `Math.min()` fără argumente întoarce
// Infinity, care ar strica slider-ul de preț din filtre.
export const pretMinim = produse.length
  ? Math.min(...produse.map((p) => p.pret))
  : 0;
export const pretMaxim = produse.length
  ? Math.max(...produse.map((p) => p.pret))
  : 0;
