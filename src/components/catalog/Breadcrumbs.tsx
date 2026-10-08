import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Firimitura = { nume: string; cale: string };

export default function Breadcrumbs({ elemente }: { elemente: Firimitura[] }) {
  return (
    <nav aria-label="Navigație secundară">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-steel-500">
        {elemente.map((element, index) => {
          const ultimul = index === elemente.length - 1;
          return (
            <li key={element.cale} className="flex items-center gap-1">
              {ultimul ? (
                <span aria-current="page" className="text-ink-700">
                  {element.nume}
                </span>
              ) : (
                <>
                  <Link
                    href={element.cale}
                    className="hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                  >
                    {element.nume}
                  </Link>
                  <ChevronRight size={14} aria-hidden="true" className="text-steel-400" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
