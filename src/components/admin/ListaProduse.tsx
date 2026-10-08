"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, Search } from "lucide-react";
import type { Categorie, Produs } from "@/types";
import { formatPret } from "@/lib/format";

const ETICHETE_STOC: Record<string, string> = {
  "in-stoc": "În stoc",
  "stoc-limitat": "Stoc limitat",
  "la-comanda": "La comandă",
  epuizat: "Epuizat",
};

const CULORI_STOC: Record<string, string> = {
  "in-stoc": "bg-moss-600/10 text-moss-600",
  "stoc-limitat": "bg-amber-600/10 text-amber-600",
  "la-comanda": "bg-steel-500/10 text-steel-500",
  epuizat: "bg-rust-600/10 text-rust-600",
};

export default function ListaProduse({
  produseInitiale,
  categorii,
}: {
  produseInitiale: Produs[];
  categorii: Categorie[];
}) {
  const router = useRouter();
  const [produse, setProduse] = useState(produseInitiale);
  const [cautare, setCautare] = useState("");
  const [filtruCategorie, setFiltruCategorie] = useState("");
  const [seSterge, setSeSterge] = useState<string | null>(null);

  const filtrate = useMemo(() => {
    const termen = cautare.trim().toLowerCase();
    return produse.filter((p) => {
      if (filtruCategorie && p.categorie !== filtruCategorie) return false;
      if (!termen) return true;
      return (
        p.nume.toLowerCase().includes(termen) ||
        p.sku.toLowerCase().includes(termen) ||
        p.slug.includes(termen)
      );
    });
  }, [produse, cautare, filtruCategorie]);

  async function sterge(produs: Produs) {
    const confirmat = window.confirm(
      `Ștergi definitiv „${produs.nume}”? Acțiunea nu poate fi anulată.`,
    );
    if (!confirmat) return;

    setSeSterge(produs.slug);
    const raspuns = await fetch(`/api/admin/produse/${produs.slug}`, {
      method: "DELETE",
    });
    setSeSterge(null);

    if (!raspuns.ok) {
      window.alert("Ștergerea a eșuat.");
      return;
    }

    setProduse((lista) => lista.filter((p) => p.slug !== produs.slug));
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-[0.04em] text-ink-900">
            Produse
          </h1>
          <p className="mt-1 text-sm text-steel-500">
            {produse.length} în catalog
            {filtrate.length !== produse.length ? ` · ${filtrate.length} afișate` : ""}
          </p>
        </div>
        <Link
          href="/admin/produse/nou"
          className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] bg-rust-600 px-4 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-pe-accent transition-colors hover:bg-rust-700"
        >
          <Plus size={16} aria-hidden />
          Produs nou
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative min-w-56 flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel-400"
            aria-hidden
          />
          <input
            type="search"
            value={cautare}
            onChange={(e) => setCautare(e.target.value)}
            placeholder="Caută după nume, SKU sau slug…"
            aria-label="Caută produse"
            className="h-10 w-full rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata pl-9 pr-3 text-sm outline-none focus:border-ink-900"
          />
        </div>
        <select
          value={filtruCategorie}
          onChange={(e) => setFiltruCategorie(e.target.value)}
          aria-label="Filtrează după categorie"
          className="h-10 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata px-3 text-sm outline-none focus:border-ink-900"
        >
          <option value="">Toate categoriile</option>
          {categorii.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.nume}
            </option>
          ))}
        </select>
      </div>

      {filtrate.length === 0 ? (
        <p className="mt-6 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-6 text-sm text-steel-500">
          Niciun produs nu corespunde filtrelor.
        </p>
      ) : (
        <ul className="mt-5 divide-y divide-chalk-200 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata">
          {filtrate.map((p) => (
            <li key={p.slug} className="flex items-center gap-4 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-chalk-100">
                {p.imagini[0] ? (
                  <Image
                    src={p.imagini[0]}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-sm font-semibold text-ink-900">
                  {p.nume}
                </p>
                <p className="truncate text-xs text-steel-500">
                  {p.sku} · {categorii.find((c) => c.slug === p.categorie)?.nume ?? p.categorie}
                </p>
              </div>

              <span
                className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold sm:inline ${CULORI_STOC[p.stoc] ?? ""}`}
              >
                {ETICHETE_STOC[p.stoc] ?? p.stoc}
              </span>

              <span className="shrink-0 whitespace-nowrap font-heading text-sm font-semibold text-ink-900">
                {formatPret(p.pret)}
              </span>

              <div className="flex shrink-0 gap-1">
                <Link
                  href={`/admin/produse/${p.slug}`}
                  aria-label={`Editează ${p.nume}`}
                  className="rounded-[var(--radius-sm)] p-2 text-steel-500 transition-colors hover:bg-chalk-100 hover:text-ink-900"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => sterge(p)}
                  disabled={seSterge === p.slug}
                  aria-label={`Șterge ${p.nume}`}
                  className="rounded-[var(--radius-sm)] p-2 text-steel-500 transition-colors hover:bg-rust-600/10 hover:text-rust-600 disabled:opacity-40"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
