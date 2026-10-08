import Link from "next/link";
import { Package, FolderTree, ShoppingCart, TriangleAlert } from "lucide-react";
import {
  citesteCategorii,
  citesteComenzi,
  citesteProduse,
} from "@/lib/admin-date";
import { formatPret } from "@/lib/format";

// Panoul citește fișierele la fiecare cerere — altfel ar servi un instantaneu
// vechi imediat după o modificare.
export const dynamic = "force-dynamic";

function Fisa({
  eticheta,
  valoare,
  href,
  Icon,
}: {
  eticheta: string;
  valoare: string | number;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="block rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-5 transition-colors hover:border-ink-900"
    >
      <div className="flex items-center justify-between">
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-500">
          {eticheta}
        </span>
        <Icon size={18} className="text-steel-400" />
      </div>
      <p className="mt-3 font-heading text-3xl font-bold text-ink-900">
        {valoare}
      </p>
    </Link>
  );
}

export default async function PaginaPanou() {
  const [produse, categorii, comenzi] = await Promise.all([
    citesteProduse(),
    citesteCategorii(),
    citesteComenzi(),
  ]);

  const comenziNoi = comenzi.filter((c) => c.status === "noua");
  const incasari = comenzi
    .filter((c) => c.status !== "anulata")
    .reduce((s, c) => s + c.total, 0);
  const epuizate = produse.filter((p) => p.stoc === "epuizat");

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-[0.04em] text-ink-900">
        Panou
      </h1>
      <p className="mt-1 text-sm text-steel-500">
        Privire de ansamblu asupra magazinului.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Fisa eticheta="Produse" valoare={produse.length} href="/admin/produse" Icon={Package} />
        <Fisa eticheta="Categorii" valoare={categorii.length} href="/admin/categorii" Icon={FolderTree} />
        <Fisa eticheta="Comenzi noi" valoare={comenziNoi.length} href="/admin/comenzi" Icon={ShoppingCart} />
        <Fisa
          eticheta="Încasări"
          valoare={formatPret(incasari)}
          href="/admin/comenzi"
          Icon={ShoppingCart}
        />
      </div>

      {epuizate.length > 0 ? (
        <section className="mt-8 rounded-[var(--radius-sm)] border border-amber-600/30 bg-amber-600/5 p-5">
          <h2 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-amber-600">
            <TriangleAlert size={16} aria-hidden />
            {epuizate.length} {epuizate.length === 1 ? "produs epuizat" : "produse epuizate"}
          </h2>
          <ul className="mt-3 space-y-1 text-sm">
            {epuizate.slice(0, 8).map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/admin/produse/${p.slug}`}
                  className="text-ink-700 underline underline-offset-4 hover:text-ink-900"
                >
                  {p.nume}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900">
            Ultimele comenzi
          </h2>
          <Link
            href="/admin/comenzi"
            className="text-sm text-ink-700 underline underline-offset-4"
          >
            Vezi toate
          </Link>
        </div>

        {comenzi.length === 0 ? (
          <p className="mt-3 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-5 text-sm text-steel-500">
            Nu există comenzi încă.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-chalk-200 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata">
            {comenzi.slice(0, 5).map((c) => (
              <li key={c.numar} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <Link
                    href="/admin/comenzi"
                    className="font-heading text-sm font-semibold text-ink-900"
                  >
                    {c.numar}
                  </Link>
                  <p className="truncate text-xs text-steel-500">
                    {c.client.prenume} {c.client.nume} · {c.client.localitate}
                  </p>
                </div>
                <span className="shrink-0 font-heading text-sm font-semibold text-ink-900">
                  {formatPret(c.total)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
