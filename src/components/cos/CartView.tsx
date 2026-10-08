"use client";

// DECIZIE: pagina /cos exportă `metadata`, deci rămâne componentă server.
// CartView este partea client care citește coșul din context.

import CartLine from "@/components/cos/CartLine";
import CartSummary from "@/components/cos/CartSummary";
import FreeShippingBar from "@/components/cos/FreeShippingBar";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { produse } from "@/data/produse";
import { useCos } from "@/lib/cart-context";

export default function CartView() {
  const { linii, subtotal, gata, goleste } = useCos();

  if (!gata) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (linii.length === 0) {
    return (
      <EmptyState
        titlu="Coșul este gol"
        descriere="Nu ai adăugat încă niciun produs. Pornește de la catalog sau de la ghidul de echipament."
        actiune={<Button href="/produse">Vezi produsele</Button>}
      />
    );
  }

  const perechi = linii
    .map((linie) => ({
      linie,
      produs: produse.find((p) => p.slug === linie.slug),
    }))
    .filter(
      (pereche): pereche is { linie: typeof pereche.linie; produs: NonNullable<typeof pereche.produs> } =>
        pereche.produs !== undefined,
    );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
      <div>
        <FreeShippingBar subtotal={subtotal} />

        <div className="mt-6 hidden grid-cols-[88px_1fr_auto_auto_auto] gap-6 border-b border-chalk-200 pb-3 md:grid">
          <span className="type-eticheta">Produs</span>
          <span className="sr-only">Denumire</span>
          <span className="type-eticheta">Preț</span>
          <span className="type-eticheta">Cantitate</span>
          <span className="type-eticheta text-right">Subtotal</span>
        </div>

        <ul>
          {perechi.map(({ linie, produs }) => (
            <CartLine
              key={`${linie.slug}-${linie.marime ?? ""}`}
              linie={linie}
              produs={produs}
            />
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/produse" varianta="ghost">
            Continuă cumpărăturile
          </Button>
          <Button varianta="link" onClick={goleste}>
            Golește coșul
          </Button>
        </div>
      </div>

      <CartSummary />
    </div>
  );
}
