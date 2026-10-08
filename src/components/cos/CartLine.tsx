"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import QuantityStepper from "@/components/cos/QuantityStepper";
import { useCos } from "@/lib/cart-context";
import { formatPret } from "@/lib/format";
import type { LinieCos, Produs } from "@/types";

export default function CartLine({
  linie,
  produs,
}: {
  linie: LinieCos;
  produs: Produs;
}) {
  const { seteazaCantitate, elimina } = useCos();

  return (
    <li className="grid grid-cols-[88px_1fr] items-start gap-4 border-b border-chalk-200 py-6 md:grid-cols-[88px_1fr_auto_auto_auto] md:items-center md:gap-6">
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
        {linie.marime ? (
          <p className="mt-1 text-sm text-steel-500">Mărime: {linie.marime}</p>
        ) : null}
        <p className="mt-1 text-sm text-steel-500 tabular md:hidden">
          {formatPret(produs.pret)} / buc.
        </p>
      </div>

      <p className="hidden text-sm text-steel-500 tabular md:block">
        {formatPret(produs.pret)}
      </p>

      <div className="col-span-2 md:col-span-1">
        <QuantityStepper
          valoare={linie.cantitate}
          laSchimbare={(cantitate) =>
            seteazaCantitate(produs.slug, cantitate, linie.marime)
          }
          eticheta="Cantitate"
        />
      </div>

      <div className="col-span-2 flex items-center justify-between gap-4 md:col-span-1 md:justify-end">
        <p className="font-semibold text-ink-900 tabular">
          {formatPret(produs.pret * linie.cantitate)}
        </p>
        <button
          type="button"
          onClick={() => elimina(produs.slug, linie.marime)}
          aria-label={`Elimină ${produs.nume} din coș`}
          className="inline-flex h-10 w-10 items-center justify-center text-steel-500 hover:text-rust-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
