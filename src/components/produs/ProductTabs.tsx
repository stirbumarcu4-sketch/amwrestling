"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { site } from "@/data/site";
import { faq } from "@/data/faq";
import { cn } from "@/lib/utils";
import { formatPret } from "@/lib/format";
import type { Produs } from "@/types";

const NUME_TABURI = [
  "Descriere",
  "Specificații",
  "Livrare și retur",
  "Întrebări",
] as const;

export default function ProductTabs({ produs }: { produs: Produs }) {
  const idBaza = useId();
  const [activ, setActiv] = useState(0);
  const butoane = useRef<(HTMLButtonElement | null)[]>([]);

  const intrebari = faq
    .filter((i) => i.categorie === "Comenzi și livrare")
    .slice(0, 3);

  function laTasta(eveniment: KeyboardEvent<HTMLDivElement>) {
    if (eveniment.key !== "ArrowRight" && eveniment.key !== "ArrowLeft") return;
    eveniment.preventDefault();
    const directie = eveniment.key === "ArrowRight" ? 1 : -1;
    const urmator =
      (activ + directie + NUME_TABURI.length) % NUME_TABURI.length;
    setActiv(urmator);
    butoane.current[urmator]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Detalii produs"
        onKeyDown={laTasta}
        className="flex flex-wrap gap-x-8 gap-y-2 border-b border-chalk-200"
      >
        {NUME_TABURI.map((nume, index) => (
          <button
            key={nume}
            ref={(element) => {
              butoane.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`${idBaza}-tab-${index}`}
            aria-selected={index === activ}
            aria-controls={`${idBaza}-panou-${index}`}
            tabIndex={index === activ ? 0 : -1}
            onClick={() => setActiv(index)}
            className={cn(
              "-mb-px border-b-2 py-4 font-heading text-sm font-semibold uppercase tracking-[0.06em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600",
              index === activ
                ? "border-ink-900 text-ink-900"
                : "border-transparent text-steel-500 hover:text-ink-700",
            )}
          >
            {nume}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${idBaza}-panou-0`}
        aria-labelledby={`${idBaza}-tab-0`}
        hidden={activ !== 0}
        tabIndex={0}
        className="py-8"
      >
        <p className="masura text-steel-500">{produs.descriere}</p>
      </div>

      <div
        role="tabpanel"
        id={`${idBaza}-panou-1`}
        aria-labelledby={`${idBaza}-tab-1`}
        hidden={activ !== 1}
        tabIndex={0}
        className="py-8"
      >
        <table className="w-full max-w-2xl border-collapse text-sm">
          <caption className="sr-only">
            Specificații tehnice pentru {produs.nume}
          </caption>
          <tbody>
            {produs.specificatii.map((rand) => (
              <tr key={rand.eticheta} className="border-b border-chalk-200">
                <th
                  scope="row"
                  className="w-1/2 py-3 pr-4 text-left font-medium text-steel-500"
                >
                  {rand.eticheta}
                </th>
                <td className="py-3 text-ink-700">{rand.valoare}</td>
              </tr>
            ))}
            <tr className="border-b border-chalk-200">
              <th
                scope="row"
                className="py-3 pr-4 text-left font-medium text-steel-500"
              >
                Cod produs
              </th>
              <td className="py-3 text-ink-700">{produs.sku}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        role="tabpanel"
        id={`${idBaza}-panou-2`}
        aria-labelledby={`${idBaza}-tab-2`}
        hidden={activ !== 2}
        tabIndex={0}
        className="py-8"
      >
        <div className="masura space-y-4 text-steel-500">
          {produs.voluminos ? (
            <p>
              Acest produs este voluminos și se livrează prin curier de marfă, cu
              un cost fix de {site.costLivrareVoluminos} MDL și un termen de 5–10
              zile lucrătoare.
            </p>
          ) : (
            <p>
              Livrare prin curier în 24–48 de ore, cu un cost de{" "}
              {site.costLivrare} MDL. Transportul este gratuit pentru comenzile de
              peste {formatPret(site.livrareGratuitaPeste)}.
            </p>
          )}
          {produs.personalizat ? (
            <p>
              Produsul se execută după specificațiile tale, așa că este exceptat
              de la dreptul de retragere în {site.zileRetur} zile. Rămâne acoperit
              de garanția legală de conformitate: dacă execuția este defectuoasă
              sau nu corespunde comenzii, îl înlocuim.
            </p>
          ) : (
            <p>
              Ai {site.zileRetur} zile calendaristice de la primire în care te poți
              retrage din contract, fără să motivezi decizia. Produsul trebuie
              returnat în starea în care l-ai primit.
            </p>
          )}
          <p>
            <Link
              href="/livrare-si-retur"
              className="text-ink-900 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
            >
              Vezi condițiile complete de livrare și retur
            </Link>
          </p>
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${idBaza}-panou-3`}
        aria-labelledby={`${idBaza}-tab-3`}
        hidden={activ !== 3}
        tabIndex={0}
        className="py-8"
      >
        <dl className="masura space-y-6">
          {intrebari.map((intrebare) => (
            <div key={intrebare.intrebare}>
              <dt className="type-h3 text-base text-ink-900">
                {intrebare.intrebare}
              </dt>
              <dd className="mt-2 text-steel-500">{intrebare.raspuns}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6">
          <Link
            href="/intrebari-frecvente"
            className="text-ink-900 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
          >
            Toate întrebările frecvente
          </Link>
        </p>
      </div>
    </div>
  );
}
