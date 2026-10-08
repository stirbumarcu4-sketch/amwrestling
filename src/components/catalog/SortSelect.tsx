"use client";

import { useId } from "react";
import { optiuniSortare, type Sortare } from "@/lib/filters";

export default function SortSelect({
  valoare,
  laSchimbare,
}: {
  valoare: Sortare;
  laSchimbare: (sort: Sortare) => void;
}) {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="type-eticheta whitespace-nowrap">
        Sortează
      </label>
      <select
        id={id}
        value={valoare}
        onChange={(e) => laSchimbare(e.target.value as Sortare)}
        className="h-10 rounded-[var(--radius-sm)] border border-steel-300 bg-suprafata px-3 text-sm text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
      >
        {optiuniSortare.map((optiune) => (
          <option key={optiune.valoare} value={optiune.valoare}>
            {optiune.eticheta}
          </option>
        ))}
      </select>
    </div>
  );
}
