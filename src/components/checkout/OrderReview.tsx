import { formatPret } from "@/lib/format";

export type LinieRezumat = {
  slug: string;
  nume: string;
  cantitate: number;
  marime?: string;
  pretUnitar: number;
};

export default function OrderReview({
  linii,
  subtotal,
  costLivrare,
  total,
  titlu = "Comanda ta",
}: {
  linii: LinieRezumat[];
  subtotal: number;
  costLivrare: number;
  total: number;
  titlu?: string;
}) {
  return (
    <div className="border border-chalk-200 bg-suprafata p-6">
      <h2 className="type-h3 text-lg">{titlu}</h2>

      <ul className="mt-6 divide-y divide-chalk-200 border-y border-chalk-200">
        {linii.map((linie) => (
          <li
            key={`${linie.slug}-${linie.marime ?? ""}`}
            className="flex items-start justify-between gap-4 py-3 text-sm"
          >
            <div className="min-w-0">
              <p className="text-ink-700">{linie.nume}</p>
              <p className="mt-0.5 text-steel-500 tabular">
                {linie.cantitate} × {formatPret(linie.pretUnitar)}
                {linie.marime ? ` · Mărime ${linie.marime}` : ""}
              </p>
            </div>
            <p className="shrink-0 font-medium text-ink-700 tabular">
              {formatPret(linie.pretUnitar * linie.cantitate)}
            </p>
          </li>
        ))}
      </ul>

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
    </div>
  );
}
