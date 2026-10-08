"use client";

import { useId } from "react";
import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({
  valoare,
  laSchimbare,
  min = 1,
  max = 10,
  eticheta = "Cantitate",
}: {
  valoare: number;
  laSchimbare: (cantitate: number) => void;
  min?: number;
  max?: number;
  eticheta?: string;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-eticheta">
        {eticheta}
      </label>
      <div className="inline-flex h-11 w-fit items-center border border-steel-300 bg-suprafata">
        <button
          type="button"
          onClick={() => laSchimbare(Math.max(valoare - 1, min))}
          disabled={valoare <= min}
          aria-label="Scade cantitatea"
          className="inline-flex h-full w-11 items-center justify-center text-ink-700 hover:bg-chalk-100 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
        >
          <Minus size={16} aria-hidden="true" />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={valoare}
          min={min}
          max={max}
          onChange={(e) => {
            const nou = Number(e.target.value);
            if (!Number.isFinite(nou)) return;
            laSchimbare(Math.min(Math.max(nou, min), max));
          }}
          className="h-full w-12 border-x border-steel-300 bg-suprafata text-center text-sm text-ink-700 tabular focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rust-600"
        />
        <button
          type="button"
          onClick={() => laSchimbare(Math.min(valoare + 1, max))}
          disabled={valoare >= max}
          aria-label="Crește cantitatea"
          className="inline-flex h-full w-11 items-center justify-center text-ink-700 hover:bg-chalk-100 disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
        >
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
