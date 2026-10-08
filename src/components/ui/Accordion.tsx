"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";

export type ElementAccordion = { titlu: string; continut: string };

export default function Accordion({ elemente }: { elemente: ElementAccordion[] }) {
  const idBaza = useId();
  const [deschis, setDeschis] = useState<number | null>(null);

  return (
    <div className="border-t border-chalk-200">
      {elemente.map((element, index) => {
        const esteDeschis = deschis === index;
        const idButon = `${idBaza}-buton-${index}`;
        const idPanou = `${idBaza}-panou-${index}`;

        return (
          <div key={element.titlu} className="border-b border-chalk-200">
            <h3>
              <button
                type="button"
                id={idButon}
                aria-expanded={esteDeschis}
                aria-controls={idPanou}
                onClick={() => setDeschis(esteDeschis ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-heading text-lg font-semibold text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
              >
                {element.titlu}
                {esteDeschis ? (
                  <Minus size={18} className="shrink-0 text-steel-500" aria-hidden="true" />
                ) : (
                  <Plus size={18} className="shrink-0 text-steel-500" aria-hidden="true" />
                )}
              </button>
            </h3>
            <div
              id={idPanou}
              role="region"
              aria-labelledby={idButon}
              hidden={!esteDeschis}
              className="pb-5"
            >
              <p className="masura text-steel-500">{element.continut}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
