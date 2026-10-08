"use client";

// DECIZIE: specificația listează componentele de catalog, dar nu și piesa care
// le leagă. CatalogView este acel orchestrator — singura componentă care citește
// parametrii din URL, motiv pentru care paginile o învelesc în <Suspense>.

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FilterPanel from "@/components/catalog/FilterPanel";
import ActiveFilters from "@/components/catalog/ActiveFilters";
import SortSelect from "@/components/catalog/SortSelect";
import ProductGrid from "@/components/produs/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import {
  aplicaFiltre,
  citesteFiltre,
  filtreImplicite,
  PRODUSE_PE_PAGINA,
  scrieFiltre,
  type StareFiltre,
} from "@/lib/filters";
import type { Produs } from "@/types";

export default function CatalogView({
  produse,
  aratCategorii = true,
}: {
  produse: Produs[];
  aratCategorii?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [panouDeschis, setPanouDeschis] = useState(false);

  const stare = useMemo(
    () => citesteFiltre(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const navigheaza = useCallback(
    (noua: StareFiltre) => {
      const query = scrieFiltre(noua);
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const actualizeaza = useCallback(
    (modificari: Partial<StareFiltre>) => {
      // Orice schimbare de filtru readuce utilizatorul pe prima pagină.
      const paginaNoua = "pagina" in modificari ? modificari.pagina : 1;
      navigheaza({ ...stare, ...modificari, pagina: paginaNoua ?? 1 });
    },
    [navigheaza, stare],
  );

  const reseteaza = useCallback(() => {
    navigheaza({ ...filtreImplicite, sort: stare.sort });
  }, [navigheaza, stare.sort]);

  useEffect(() => {
    if (!panouDeschis) return;
    const stilAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = stilAnterior;
    };
  }, [panouDeschis]);

  const numarPeCategorie = useMemo(() => {
    const numar: Record<string, number> = {};
    for (const produs of produse) {
      numar[produs.categorie] = (numar[produs.categorie] ?? 0) + 1;
    }
    return numar;
  }, [produse]);

  const rezultate = useMemo(() => aplicaFiltre(produse, stare), [produse, stare]);

  // „Arată mai multe" în loc de paginare: `pagina` rămâne în URL, dar acum
  // înseamnă „câte loturi sunt afișate", deci lista se acumulează în loc să se
  // înlocuiască. Adresa rămâne partajabilă și butonul înapoi funcționează.
  const elemente = rezultate.slice(0, stare.pagina * PRODUSE_PE_PAGINA);
  const ramase = rezultate.length - elemente.length;

  function laTasta(eveniment: KeyboardEvent<HTMLDivElement>) {
    if (eveniment.key === "Escape") {
      eveniment.preventDefault();
      setPanouDeschis(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
      <aside className="hidden w-[260px] shrink-0 lg:block">
        <h2 className="type-h3 mb-6 text-lg">Filtre</h2>
        <FilterPanel
          stare={stare}
          actualizeaza={actualizeaza}
          aratCategorii={aratCategorii}
          numarPeCategorie={numarPeCategorie}
        />
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-steel-500 tabular">
            {rezultate.length}{" "}
            {rezultate.length === 1 ? "produs găsit" : "produse găsite"}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPanouDeschis(true)}
              aria-expanded={panouDeschis}
              aria-controls="panou-filtre"
              className="inline-flex h-10 items-center gap-2 border border-steel-300 px-4 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-700 hover:bg-chalk-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600 lg:hidden"
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filtre
            </button>
            <SortSelect
              valoare={stare.sort}
              laSchimbare={(sort) => actualizeaza({ sort })}
            />
          </div>
        </div>

        <div className="mb-6">
          <ActiveFilters
            stare={stare}
            actualizeaza={actualizeaza}
            reseteaza={reseteaza}
          />
        </div>

        {elemente.length === 0 ? (
          <EmptyState
            titlu="Niciun produs nu corespunde filtrelor"
            descriere="Încearcă un interval de preț mai larg sau elimină câteva filtre."
            actiune={
              <Button varianta="ghost" onClick={reseteaza}>
                Resetează filtrele
              </Button>
            }
          />
        ) : (
          <ProductGrid produse={elemente} variantaLatime="cu-bara" />
        )}

        {ramase > 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3">
            <Button
              varianta="ghost"
              dimensiune="lg"
              onClick={() => actualizeaza({ pagina: stare.pagina + 1 })}
            >
              Arată mai multe
            </Button>
            <p aria-live="polite" className="text-sm text-steel-500 tabular">
              {elemente.length} din {rezultate.length} produse afișate
            </p>
          </div>
        ) : null}
      </div>

      {panouDeschis ? (
        <div className="fixed inset-0 z-50 lg:hidden" onKeyDown={laTasta}>
          <button
            type="button"
            aria-label="Închide filtrele"
            onClick={() => setPanouDeschis(false)}
            className="absolute inset-0 h-full w-full bg-ink-950/50"
          />
          <div
            id="panou-filtre"
            role="dialog"
            aria-modal="true"
            aria-label="Filtre"
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-suprafata"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-chalk-200 bg-suprafata px-5 py-4">
              <h2 className="font-heading text-lg font-bold uppercase tracking-[0.04em] text-ink-900">
                Filtre
              </h2>
              <button
                type="button"
                onClick={() => setPanouDeschis(false)}
                aria-label="Închide filtrele"
                className="inline-flex h-10 w-10 items-center justify-center text-ink-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="px-5 py-6">
              <FilterPanel
                stare={stare}
                actualizeaza={actualizeaza}
                aratCategorii={aratCategorii}
                numarPeCategorie={numarPeCategorie}
              />
            </div>
            <div className="sticky bottom-0 border-t border-chalk-200 bg-suprafata px-5 py-4">
              <Button
                className="w-full"
                onClick={() => setPanouDeschis(false)}
              >
                Arată {rezultate.length} produse
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
