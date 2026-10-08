"use client";

import Button from "@/components/ui/Button";
import { useCos } from "@/lib/cart-context";
import { formatPret } from "@/lib/format";

export default function CartSummary() {
  const { subtotal, costLivrare, total, nrArticole } = useCos();

  return (
    <div className="border border-chalk-200 bg-suprafata p-6 lg:sticky lg:top-24">
      <h2 className="type-h3 text-lg">Sumar comandă</h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-steel-500">Subtotal</dt>
          <dd className="font-medium text-ink-700 tabular">{formatPret(subtotal)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-steel-500">Livrare</dt>
          <dd className="font-medium text-ink-700 tabular">
            {costLivrare === 0 ? "Gratuită" : formatPret(costLivrare)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-chalk-200 pt-3">
          <dt className="font-heading text-base font-semibold uppercase tracking-[0.06em] text-ink-900">
            Total
          </dt>
          <dd className="text-xl font-semibold text-ink-900 tabular">
            {formatPret(total)}
          </dd>
        </div>
      </dl>

      <p className="mt-2 text-sm text-steel-500">TVA inclus</p>

      <Button
        href="/checkout"
        varianta="accent"
        dimensiune="lg"
        className="mt-6 w-full"
        aria-disabled={nrArticole === 0}
      >
        Finalizează comanda
      </Button>
    </div>
  );
}
