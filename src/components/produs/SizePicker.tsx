"use client";

import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";

export default function SizePicker({
  marimi,
  valoare,
  laSchimbare,
  eroare,
}: {
  marimi: string[];
  valoare?: string;
  laSchimbare: (marime: string) => void;
  eroare?: string;
}) {
  const numeGrup = useId();
  const idEroare = `${numeGrup}-eroare`;

  return (
    <fieldset aria-describedby={eroare ? idEroare : undefined}>
      <div className="mb-2 flex items-center justify-between gap-4">
        <legend className="type-eticheta">
          Mărime <span className="text-rust-600">*</span>
        </legend>
        <Link
          href="/ghid-marimi"
          className="text-sm text-steel-500 underline underline-offset-4 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
        >
          Ghid de mărimi
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {marimi.map((marime) => {
          const selectata = valoare === marime;
          return (
            <label
              key={marime}
              className={cn(
                "inline-flex h-11 min-w-11 cursor-pointer items-center justify-center border px-4 font-heading text-sm font-semibold uppercase tracking-[0.06em] transition-colors",
                "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-rust-600",
                selectata
                  ? "border-ink-900 bg-ink-900 text-chalk-50"
                  : "border-steel-300 text-ink-700 hover:bg-chalk-100",
              )}
            >
              <input
                type="radio"
                name={numeGrup}
                value={marime}
                checked={selectata}
                onChange={() => laSchimbare(marime)}
                className="sr-only"
              />
              {marime}
            </label>
          );
        })}
      </div>

      {eroare ? (
        <p id={idEroare} className="mt-2 text-sm text-rust-600">
          {eroare}
        </p>
      ) : null}
    </fieldset>
  );
}
