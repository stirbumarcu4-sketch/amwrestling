"use client";

import { X } from "lucide-react";
import { categorii } from "@/data/categorii";
import {
  areFiltreActive,
  optiuniDisponibilitate,
  optiuniEtichete,
  type StareFiltre,
} from "@/lib/filters";
import { formatPret } from "@/lib/format";

type Chip = { cheie: string; eticheta: string; sterge: Partial<StareFiltre> };

export default function ActiveFilters({
  stare,
  actualizeaza,
  reseteaza,
}: {
  stare: StareFiltre;
  actualizeaza: (modificari: Partial<StareFiltre>) => void;
  reseteaza: () => void;
}) {
  if (!areFiltreActive(stare)) return null;

  const chipuri: Chip[] = [];

  for (const slug of stare.categorii) {
    const categorie = categorii.find((c) => c.slug === slug);
    chipuri.push({
      cheie: `categorie-${slug}`,
      eticheta: categorie?.nume ?? slug,
      sterge: { categorii: stare.categorii.filter((c) => c !== slug) },
    });
  }

  if (stare.pretMin !== null || stare.pretMax !== null) {
    const de = stare.pretMin !== null ? formatPret(stare.pretMin) : "0 MDL";
    const pana = stare.pretMax !== null ? formatPret(stare.pretMax) : "fără limită";
    chipuri.push({
      cheie: "pret",
      eticheta: `Preț: ${de} – ${pana}`,
      sterge: { pretMin: null, pretMax: null },
    });
  }

  for (const stoc of stare.disponibilitate) {
    const optiune = optiuniDisponibilitate.find((o) => o.valoare === stoc);
    chipuri.push({
      cheie: `stoc-${stoc}`,
      eticheta: optiune?.eticheta ?? stoc,
      sterge: {
        disponibilitate: stare.disponibilitate.filter((s) => s !== stoc),
      },
    });
  }

  for (const eticheta of stare.etichete) {
    const optiune = optiuniEtichete.find((o) => o.valoare === eticheta);
    chipuri.push({
      cheie: `eticheta-${eticheta}`,
      eticheta: optiune?.eticheta ?? eticheta,
      sterge: { etichete: stare.etichete.filter((e) => e !== eticheta) },
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="type-eticheta">Filtre active</span>
      <ul className="flex flex-wrap gap-2">
        {chipuri.map((chip) => (
          <li key={chip.cheie}>
            <button
              type="button"
              onClick={() => actualizeaza(chip.sterge)}
              className="inline-flex items-center gap-1.5 border border-steel-300 bg-suprafata py-1 pl-3 pr-2 text-sm text-ink-700 hover:bg-chalk-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
            >
              {chip.eticheta}
              <X size={14} aria-hidden="true" className="text-steel-500" />
              <span className="sr-only">Elimină filtrul {chip.eticheta}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={reseteaza}
        className="text-sm text-rust-600 underline underline-offset-4 hover:text-rust-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
      >
        Șterge tot
      </button>
    </div>
  );
}
