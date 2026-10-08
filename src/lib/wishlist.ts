"use client";

import { useCallback, useSyncExternalStore } from "react";

const CHEIE = "hp_wishlist_v1";

// Aceeași structură ca la coș: o magazie externă citită prin
// `useSyncExternalStore`, ca prima randare din client să coincidă cu cea de pe
// server și să nu apară diferențe de hidratare.

type Instantaneu = { sluguri: string[]; gata: boolean };

const INSTANTANEU_SERVER: Instantaneu = { sluguri: [], gata: false };

let instantaneu: Instantaneu = INSTANTANEU_SERVER;
let incarcat = false;
let asculta = false;
const abonati = new Set<() => void>();

function citeste(): string[] {
  try {
    const brut = window.localStorage.getItem(CHEIE);
    if (!brut) return [];
    const parsat: unknown = JSON.parse(brut);
    if (!Array.isArray(parsat)) return [];
    return parsat.filter((s): s is string => typeof s === "string");
  } catch {
    return [];
  }
}

function anunta() {
  for (const abonat of abonati) abonat();
}

function scrie(sluguri: string[]) {
  instantaneu = { sluguri, gata: true };
  try {
    window.localStorage.setItem(CHEIE, JSON.stringify(sluguri));
  } catch {
    // Stocarea poate fi blocată; lista rămâne validă în memorie.
  }
  anunta();
}

function laStocare(eveniment: StorageEvent) {
  if (eveniment.key !== CHEIE) return;
  instantaneu = { sluguri: citeste(), gata: true };
  anunta();
}

function aboneaza(callback: () => void) {
  if (!incarcat) {
    incarcat = true;
    instantaneu = { sluguri: citeste(), gata: true };
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

export function useFavorite() {
  const { sluguri, gata } = useSyncExternalStore(
    aboneaza,
    iaInstantaneu,
    iaInstantaneuServer,
  );

  const comuta = useCallback((slug: string) => {
    const actuale = instantaneu.sluguri;
    scrie(
      actuale.includes(slug)
        ? actuale.filter((s) => s !== slug)
        : [...actuale, slug],
    );
  }, []);

  const elimina = useCallback((slug: string) => {
    scrie(instantaneu.sluguri.filter((s) => s !== slug));
  }, []);

  const contine = useCallback(
    (slug: string) => sluguri.includes(slug),
    [sluguri],
  );

  return { sluguri, comuta, elimina, contine, gata };
}
