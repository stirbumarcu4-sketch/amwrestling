"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { produse } from "@/data/produse";
import { site } from "@/data/site";
import { inBani, inLei } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";
import type { LinieCos } from "@/types";

const CHEIE = "hp_cart_v1";

const CANTITATE_MINIMA = 1;
const CANTITATE_MAXIMA = 10;

type ContextCos = {
  linii: LinieCos[];
  adauga: (slug: string, cantitate?: number, marime?: string) => void;
  seteazaCantitate: (slug: string, cantitate: number, marime?: string) => void;
  elimina: (slug: string, marime?: string) => void;
  goleste: () => void;
  nrArticole: number;
  subtotal: number;
  costLivrare: number;
  total: number;
  gata: boolean;
};

const Context = createContext<ContextCos | null>(null);

export function useCos() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useCos trebuie folosit în interiorul lui CartProvider.");
  }
  return context;
}

const aceeasiLinie = (linie: LinieCos, slug: string, marime?: string) =>
  linie.slug === slug && linie.marime === marime;

// ── Magazie externă ─────────────────────────────────────────────────────────
// Coșul trăiește în `localStorage`, adică în afara React. `useSyncExternalStore`
// este exact mecanismul prevăzut pentru asta: instantaneul de server este gol,
// deci markup-ul randat pe server și prima randare din client coincid, iar
// conținutul real apare abia după hidratare — fără setState într-un efect.

type Instantaneu = { linii: LinieCos[]; gata: boolean };

const INSTANTANEU_SERVER: Instantaneu = { linii: [], gata: false };

let instantaneu: Instantaneu = INSTANTANEU_SERVER;
let incarcat = false;
let asculta = false;
const abonati = new Set<() => void>();

function citesteDinStocare(): LinieCos[] {
  try {
    const brut = window.localStorage.getItem(CHEIE);
    if (!brut) return [];
    const parsat: unknown = JSON.parse(brut);
    if (!Array.isArray(parsat)) return [];
    return parsat.filter(
      (l): l is LinieCos =>
        typeof l === "object" &&
        l !== null &&
        typeof (l as LinieCos).slug === "string" &&
        typeof (l as LinieCos).cantitate === "number",
    );
  } catch {
    return [];
  }
}

function anunta() {
  for (const abonat of abonati) abonat();
}

function scrie(linii: LinieCos[]) {
  instantaneu = { linii, gata: true };
  try {
    window.localStorage.setItem(CHEIE, JSON.stringify(linii));
  } catch {
    // Stocarea poate fi plină sau blocată; coșul rămâne valid în memorie.
  }
  anunta();
}

function laStocare(eveniment: StorageEvent) {
  if (eveniment.key !== CHEIE) return;
  instantaneu = { linii: citesteDinStocare(), gata: true };
  anunta();
}

function aboneaza(callback: () => void) {
  if (!incarcat) {
    incarcat = true;
    instantaneu = { linii: citesteDinStocare(), gata: true };
  }
  if (!asculta) {
    asculta = true;
    window.addEventListener("storage", laStocare);
  }
  abonati.add(callback);
  return () => {
    abonati.delete(callback);
  };
}

const iaInstantaneu = () => instantaneu;
const iaInstantaneuServer = () => INSTANTANEU_SERVER;

// ── Provider ────────────────────────────────────────────────────────────────

export default function CartProvider({ children }: { children: ReactNode }) {
  const { linii, gata } = useSyncExternalStore(
    aboneaza,
    iaInstantaneu,
    iaInstantaneuServer,
  );
  const { arata } = useToast();

  const adauga = useCallback(
    (slug: string, cantitate = 1, marime?: string) => {
      const produs = produse.find((p) => p.slug === slug);
      if (!produs || produs.stoc === "epuizat") return;

      const precedente = instantaneu.linii;
      const existenta = precedente.find((l) => aceeasiLinie(l, slug, marime));

      scrie(
        existenta
          ? precedente.map((l) =>
              aceeasiLinie(l, slug, marime)
                ? {
                    ...l,
                    cantitate: Math.min(l.cantitate + cantitate, CANTITATE_MAXIMA),
                  }
                : l,
            )
          : [
              ...precedente,
              {
                slug,
                marime,
                cantitate: Math.min(
                  Math.max(cantitate, CANTITATE_MINIMA),
                  CANTITATE_MAXIMA,
                ),
              },
            ],
      );

      arata(`${produs.nume} a fost adăugat în coș.`);
    },
    [arata],
  );

  const seteazaCantitate = useCallback(
    (slug: string, cantitate: number, marime?: string) => {
      if (cantitate < CANTITATE_MINIMA) {
        scrie(instantaneu.linii.filter((l) => !aceeasiLinie(l, slug, marime)));
        return;
      }
      scrie(
        instantaneu.linii.map((l) =>
          aceeasiLinie(l, slug, marime)
            ? { ...l, cantitate: Math.min(cantitate, CANTITATE_MAXIMA) }
            : l,
        ),
      );
    },
    [],
  );

  const elimina = useCallback((slug: string, marime?: string) => {
    scrie(instantaneu.linii.filter((l) => !aceeasiLinie(l, slug, marime)));
  }, []);

  const goleste = useCallback(() => scrie([]), []);

  const { nrArticole, subtotal, costLivrare, total } = useMemo(() => {
    let subtotalBani = 0;
    let articole = 0;
    let areVoluminos = false;

    for (const linie of linii) {
      const produs = produse.find((p) => p.slug === linie.slug);
      if (!produs) continue;
      subtotalBani += inBani(produs.pret) * linie.cantitate;
      articole += linie.cantitate;
      if (produs.voluminos) areVoluminos = true;
    }

    const subtotalLei = inLei(subtotalBani);

    let livrareBani = 0;
    if (articole > 0 && subtotalLei < site.livrareGratuitaPeste) {
      livrareBani = areVoluminos
        ? inBani(site.costLivrareVoluminos)
        : inBani(site.costLivrare);
    }

    return {
      nrArticole: articole,
      subtotal: subtotalLei,
      costLivrare: inLei(livrareBani),
      total: inLei(subtotalBani + livrareBani),
    };
  }, [linii]);

  const valoare = useMemo<ContextCos>(
    () => ({
      linii,
      adauga,
      seteazaCantitate,
      elimina,
      goleste,
      nrArticole,
      subtotal,
      costLivrare,
      total,
      gata,
    }),
    [
      linii,
      adauga,
      seteazaCantitate,
      elimina,
      goleste,
      nrArticole,
      subtotal,
      costLivrare,
      total,
      gata,
    ],
  );

  return <Context.Provider value={valoare}>{children}</Context.Provider>;
}
