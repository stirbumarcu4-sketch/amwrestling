"use client";

// DECIZIE: la fel ca la coș, pagina rămâne server pentru `metadata`, iar
// citirea din localStorage se face în această componentă client.

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import PriceTag from "@/components/produs/PriceTag";
import StockBadge from "@/components/produs/StockBadge";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { produse } from "@/data/produse";
import { useFavorite } from "@/lib/wishlist";
import { useCos } from "@/lib/cart-context";

export default function WishlistView() {
  const { sluguri, elimina, gata } = useFavorite();
  const { adauga } = useCos();

  if (!gata) {
    return <Skeleton className="h-64 w-full" />;
  }

  const salvate = sluguri
    .map((slug) => produse.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (salvate.length === 0) {
    return (
      <EmptyState
        titlu="Nu ai produse salvate"
        descriere="Salvează produsele la care vrei să revii, folosind butonul „Adaugă la favorite” din pagina fiecărui produs."
        actiune={<Button href="/produse">Vezi produsele</Button>}
      />
    );
  }

  return (
    <ul className="divide-y divide-chalk-200 border-y border-chalk-200">
      {salvate.map((produs) => (
        <li
          key={produs.slug}
          className="grid grid-cols-[88px_1fr] items-start gap-4 py-6 md:grid-cols-[88px_1fr_auto] md:items-center md:gap-6"
        >
          <Link
            href={`/produse/${produs.slug}`}
            className="relative block aspect-square w-[88px] overflow-hidden border border-chalk-200 bg-chalk-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
          >
            <Image
              src={produs.imagini[0]}
              alt={`${produs.nume} — imagine 1`}
              fill
              sizes="88px"
              className="object-cover"
            />
          </Link>

          <div className="min-w-0">
            <Link
              href={`/produse/${produs.slug}`}
              className="type-h3 text-base text-ink-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
            >
              {produs.nume}
            </Link>
            <div className="mt-2">
              <PriceTag
                pret={produs.pret}
                pretVechi={produs.pretVechi}
                dimensiune="sm"
              />
            </div>
            <StockBadge stoc={produs.stoc} className="mt-2" />
          </div>

          <div className="col-span-2 flex flex-wrap items-center gap-3 md:col-span-1">
            {produs.marimi?.length ? (
              <Button href={`/produse/${produs.slug}`} varianta="ghost">
                Alege mărimea
              </Button>
            ) : (
              <Button
                onClick={() => adauga(produs.slug)}
                disabled={produs.stoc === "epuizat"}
              >
                {produs.stoc === "epuizat" ? "Stoc epuizat" : "Adaugă în coș"}
              </Button>
            )}
            <button
              type="button"
              onClick={() => elimina(produs.slug)}
              aria-label={`Elimină ${produs.nume} de la favorite`}
              className="inline-flex h-10 w-10 items-center justify-center text-steel-500 hover:text-rust-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
            >
              <Trash2 size={18} aria-hidden="true" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
