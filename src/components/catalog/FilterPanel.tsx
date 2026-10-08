"use client";

import { useId, useRef } from "react";
import { Check } from "lucide-react";
import { categorii } from "@/data/categorii";
import {
  intervalePret,
  optiuniDisponibilitate,
  optiuniEtichete,
  type StareFiltre,
} from "@/lib/filters";
import { cn } from "@/lib/utils";
import type { CategorieSlug, Eticheta, StareStoc } from "@/types";

function comuta<T>(lista: T[], valoare: T): T[] {
  return lista.includes(valoare)
    ? lista.filter((v) => v !== valoare)
    : [...lista, valoare];
}

// DECIZIE: bifele native sunt ascunse cu `sr-only`, nu eliminate. Interacțiunea
// rămâne a unui checkbox real — tastatură, cititoare de ecran, formular — iar
// aspectul e desenat cu variantele `peer-checked:` pe elementul următor.
const bifa =
  "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] border border-steel-300 bg-suprafata transition-colors " +
  "peer-checked:border-ink-900 peer-checked:bg-ink-900 " +
  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rust-600 " +
  "[&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100";

const rand =
  "group relative flex cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] px-2 py-2 text-sm text-ink-700 transition-colors hover:bg-chalk-100";

/** Punct colorat, ca cel din eticheta de stoc de pe card. */
const culoareStoc: Record<string, string> = {
  "in-stoc": "bg-moss-600",
  "stoc-limitat": "bg-amber-600",
};

export default function FilterPanel({
  stare,
  actualizeaza,
  aratCategorii = true,
  numarPeCategorie,
}: {
  stare: StareFiltre;
  actualizeaza: (modificari: Partial<StareFiltre>) => void;
  aratCategorii?: boolean;
  numarPeCategorie: Record<string, number>;
}) {
  const idMin = useId();
  const idMax = useId();
  // Câmpurile de preț sunt necontrolate: valoarea vine din URL prin
  // `defaultValue`, iar `key` le remontează când filtrul se schimbă din altă
  // parte (buton rapid, chip de filtru activ, navigare înapoi).
  const refMin = useRef<HTMLInputElement>(null);
  const refMax = useRef<HTMLInputElement>(null);

  function aplicaInterval() {
    const brutMin = refMin.current?.value.trim() ?? "";
    const brutMax = refMax.current?.value.trim() ?? "";
    const valMin = brutMin === "" ? null : Number(brutMin);
    const valMax = brutMax === "" ? null : Number(brutMax);
    actualizeaza({
      pretMin: valMin !== null && Number.isFinite(valMin) ? valMin : null,
      pretMax: valMax !== null && Number.isFinite(valMax) ? valMax : null,
    });
  }

  return (
    <div className="divide-y divide-chalk-200 border border-chalk-200 bg-suprafata">
      {aratCategorii ? (
        <fieldset className="p-4">
          <legend className="type-eticheta mb-2 px-2">Categorie</legend>
          <ul>
            {categorii.map((categorie) => {
              const bifat = stare.categorii.includes(categorie.slug);
              return (
                <li key={categorie.slug}>
                  <label className={rand}>
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={bifat}
                      onChange={() =>
                        actualizeaza({
                          categorii: comuta<CategorieSlug>(
                            stare.categorii,
                            categorie.slug,
                          ),
                        })
                      }
                    />
                    <span className={bifa}>
                      <Check
                        size={12}
                        strokeWidth={3}
                        aria-hidden="true"
                        className="text-chalk-50 transition-opacity"
                      />
                    </span>
                    <span
                      className={cn(
                        "flex-1",
                        bifat && "font-semibold text-ink-900",
                      )}
                    >
                      {categorie.nume}
                    </span>
                    <span
                      className={cn(
                        "min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs tabular transition-colors",
                        bifat
                          ? "bg-ink-900 text-chalk-50"
                          : "bg-chalk-100 text-steel-500 group-hover:bg-chalk-200",
                      )}
                    >
                      {numarPeCategorie[categorie.slug] ?? 0}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ) : null}

      <fieldset className="p-4">
        <legend className="type-eticheta mb-3 px-2">Preț</legend>
        <ul className="mb-4 flex flex-wrap gap-2 px-2">
          {intervalePret.map((interval) => {
            const activ =
              stare.pretMin === interval.min && stare.pretMax === interval.max;
            return (
              <li key={interval.id}>
                <button
                  type="button"
                  aria-pressed={activ}
                  onClick={() =>
                    actualizeaza(
                      activ
                        ? { pretMin: null, pretMax: null }
                        : { pretMin: interval.min, pretMax: interval.max },
                    )
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm tabular transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600",
                    activ
                      ? "border-ink-900 bg-ink-900 font-semibold text-chalk-50"
                      : "border-steel-300 text-ink-700 hover:border-ink-900 hover:bg-chalk-100",
                  )}
                >
                  {interval.eticheta}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-end gap-3 px-2">
          {[
            { id: idMin, ref: refMin, eticheta: "De la", val: stare.pretMin, ph: "0" },
            { id: idMax, ref: refMax, eticheta: "Până la", val: stare.pretMax, ph: "6000" },
          ].map((camp) => (
            <div key={camp.eticheta} className="flex-1">
              <label
                htmlFor={camp.id}
                className="mb-1 block text-xs uppercase tracking-[0.06em] text-steel-500"
              >
                {camp.eticheta}
              </label>
              {/* Sufixul „MDL" stă peste input, ca să nu mai fie nevoie de o
                  etichetă separată care ar îngusta și mai mult coloana. */}
              <div className="relative">
                <input
                  id={camp.id}
                  ref={camp.ref}
                  key={`${camp.eticheta}-${camp.val ?? "gol"}`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  defaultValue={camp.val?.toString() ?? ""}
                  onBlur={aplicaInterval}
                  placeholder={camp.ph}
                  className="h-10 w-full rounded-[var(--radius-sm)] border border-steel-300 bg-suprafata pl-3 pr-11 text-sm text-ink-700 tabular transition-colors hover:border-steel-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-steel-400"
                >
                  MDL
                </span>
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="p-4">
        <legend className="type-eticheta mb-2 px-2">Disponibilitate</legend>
        <ul>
          {optiuniDisponibilitate.map((optiune) => {
            const bifat = stare.disponibilitate.includes(optiune.valoare);
            return (
              <li key={optiune.valoare}>
                <label className={rand}>
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={bifat}
                    onChange={() =>
                      actualizeaza({
                        disponibilitate: comuta<StareStoc>(
                          stare.disponibilitate,
                          optiune.valoare,
                        ),
                      })
                    }
                  />
                  <span className={bifa}>
                    <Check
                      size={12}
                      strokeWidth={3}
                      aria-hidden="true"
                      className="text-chalk-50 transition-opacity"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      culoareStoc[optiune.valoare] ?? "bg-steel-400",
                    )}
                  />
                  <span className={cn(bifat && "font-semibold text-ink-900")}>
                    {optiune.eticheta}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset className="p-4">
        <legend className="type-eticheta mb-3 px-2">Etichete</legend>
        {/* Etichetele sunt puține și scurte, deci merg mai bine ca pastile
            decât ca listă pe verticală: ocupă mai puțină înălțime în bara
            laterală și se citesc dintr-o privire. */}
        <ul className="flex flex-wrap gap-2 px-2">
          {optiuniEtichete.map((optiune) => {
            const bifat = stare.etichete.includes(optiune.valoare);
            return (
              <li key={optiune.valoare}>
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={bifat}
                    onChange={() =>
                      actualizeaza({
                        etichete: comuta<Eticheta>(
                          stare.etichete,
                          optiune.valoare,
                        ),
                      })
                    }
                  />
                  <span
                    className={cn(
                      "block rounded-full border px-3 py-1.5 text-sm transition-colors",
                      "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rust-600",
                      bifat
                        ? "border-ink-900 bg-ink-900 font-semibold text-chalk-50"
                        : "border-steel-300 text-ink-700 hover:border-ink-900 hover:bg-chalk-100",
                    )}
                  >
                    {optiune.eticheta}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </fieldset>
    </div>
  );
}
