"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash2 } from "lucide-react";
import type { ComandaSalvata, StatusComanda } from "@/types";
import { formatPret } from "@/lib/format";

const STATUSURI: { valoare: StatusComanda; eticheta: string; clasa: string }[] = [
  { valoare: "noua", eticheta: "Nouă", clasa: "bg-rust-600/10 text-rust-600" },
  { valoare: "confirmata", eticheta: "Confirmată", clasa: "bg-amber-600/10 text-amber-600" },
  { valoare: "expediata", eticheta: "Expediată", clasa: "bg-steel-500/10 text-steel-500" },
  { valoare: "livrata", eticheta: "Livrată", clasa: "bg-moss-600/10 text-moss-600" },
  { valoare: "anulata", eticheta: "Anulată", clasa: "bg-chalk-200 text-steel-500" },
];

const dataScurta = (iso: string) =>
  new Date(iso).toLocaleString("ro-MD", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ListaComenzi({
  comenziInitiale,
}: {
  comenziInitiale: ComandaSalvata[];
}) {
  const router = useRouter();
  const [comenzi, setComenzi] = useState(comenziInitiale);
  const [filtru, setFiltru] = useState<StatusComanda | "">("");
  const [deschisa, setDeschisa] = useState<string | null>(null);

  const afisate = filtru ? comenzi.filter((c) => c.status === filtru) : comenzi;

  async function schimbaStatus(numar: string, status: StatusComanda) {
    const raspuns = await fetch(`/api/admin/comenzi/${numar}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!raspuns.ok) {
      window.alert("Schimbarea statusului a eșuat.");
      return;
    }

    setComenzi((lista) =>
      lista.map((c) => (c.numar === numar ? { ...c, status } : c)),
    );
    router.refresh();
  }

  async function sterge(numar: string) {
    if (!window.confirm(`Ștergi definitiv comanda ${numar}?`)) return;

    const raspuns = await fetch(`/api/admin/comenzi/${numar}`, { method: "DELETE" });
    if (!raspuns.ok) {
      window.alert("Ștergerea a eșuat.");
      return;
    }

    setComenzi((lista) => lista.filter((c) => c.numar !== numar));
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-[0.04em] text-ink-900">
        Comenzi
      </h1>
      <p className="mt-1 text-sm text-steel-500">
        {comenzi.length} în total
        {filtru ? ` · ${afisate.length} afișate` : ""}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltru("")}
          className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
            filtru === "" ? "bg-ink-900 text-chalk-50" : "bg-suprafata text-steel-500 hover:text-ink-900"
          }`}
        >
          Toate
        </button>
        {STATUSURI.map((s) => (
          <button
            key={s.valoare}
            type="button"
            onClick={() => setFiltru(s.valoare)}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
              filtru === s.valoare
                ? "bg-ink-900 text-chalk-50"
                : "bg-suprafata text-steel-500 hover:text-ink-900"
            }`}
          >
            {s.eticheta} ({comenzi.filter((c) => c.status === s.valoare).length})
          </button>
        ))}
      </div>

      {afisate.length === 0 ? (
        <p className="mt-5 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-6 text-sm text-steel-500">
          Nicio comandă {filtru ? "cu acest status" : "încă"}.
        </p>
      ) : (
        <ul className="mt-5 space-y-2">
          {afisate.map((c) => {
            const stare = STATUSURI.find((s) => s.valoare === c.status);
            const extinsa = deschisa === c.numar;

            return (
              <li
                key={c.numar}
                className="overflow-hidden rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata"
              >
                <div className="flex flex-wrap items-center gap-3 p-4">
                  <button
                    type="button"
                    onClick={() => setDeschisa(extinsa ? null : c.numar)}
                    aria-expanded={extinsa}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-steel-400 transition-transform ${extinsa ? "rotate-180" : ""}`}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="font-heading text-sm font-semibold text-ink-900">
                        {c.numar}
                      </p>
                      <p className="truncate text-xs text-steel-500">
                        {c.client.prenume} {c.client.nume} · {dataScurta(c.primitaLa)}
                      </p>
                    </div>
                  </button>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${stare?.clasa ?? ""}`}
                  >
                    {stare?.eticheta ?? c.status}
                  </span>

                  <span className="shrink-0 whitespace-nowrap font-heading text-sm font-semibold text-ink-900">
                    {formatPret(c.total)}
                  </span>
                </div>

                {extinsa ? (
                  <div className="border-t border-chalk-200 bg-chalk-50 p-4">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-500">
                          Client
                        </h3>
                        <address className="mt-2 text-sm not-italic text-ink-700">
                          {c.client.prenume} {c.client.nume}
                          <br />
                          <a href={`mailto:${c.client.email}`} className="underline underline-offset-4">
                            {c.client.email}
                          </a>
                          <br />
                          <a href={`tel:${c.client.telefon}`} className="underline underline-offset-4">
                            {c.client.telefon}
                          </a>
                          <br />
                          {c.client.strada}, {c.client.localitate}
                          <br />
                          r-nul {c.client.raion}, {c.client.codPostal}
                          {c.client.detalii ? (
                            <>
                              <br />
                              <span className="text-steel-500">{c.client.detalii}</span>
                            </>
                          ) : null}
                        </address>
                      </div>

                      <div>
                        <h3 className="font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-500">
                          Produse
                        </h3>
                        <ul className="mt-2 space-y-1 text-sm text-ink-700">
                          {c.linii.map((l, i) => (
                            <li key={`${l.slug}-${i}`} className="flex justify-between gap-3">
                              <span className="min-w-0">
                                {l.cantitate} × {l.nume}
                                {l.marime ? ` (${l.marime})` : ""}
                              </span>
                              <span className="shrink-0 whitespace-nowrap">
                                {formatPret(l.pretUnitar * l.cantitate)}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <dl className="mt-3 space-y-1 border-t border-chalk-200 pt-3 text-sm">
                          <div className="flex justify-between">
                            <dt className="text-steel-500">Subtotal</dt>
                            <dd>{formatPret(c.subtotal)}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-steel-500">Livrare</dt>
                            <dd>{c.costLivrare === 0 ? "Gratuit" : formatPret(c.costLivrare)}</dd>
                          </div>
                          <div className="flex justify-between font-heading font-semibold text-ink-900">
                            <dt>Total</dt>
                            <dd>{formatPret(c.total)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {c.observatii ? (
                      <p className="mt-4 rounded-[var(--radius-sm)] bg-suprafata p-3 text-sm text-steel-500">
                        <strong className="text-ink-700">Observații:</strong> {c.observatii}
                      </p>
                    ) : null}

                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-chalk-200 pt-4">
                      <label className="flex items-center gap-2 text-sm">
                        <span className="text-steel-500">Status:</span>
                        <select
                          value={c.status}
                          onChange={(e) =>
                            schimbaStatus(c.numar, e.target.value as StatusComanda)
                          }
                          className="rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata px-2.5 py-1.5 text-sm outline-none focus:border-ink-900"
                        >
                          {STATUSURI.map((s) => (
                            <option key={s.valoare} value={s.valoare}>
                              {s.eticheta}
                            </option>
                          ))}
                        </select>
                      </label>

                      <span className="text-sm text-steel-500">
                        {c.metodaLivrare} · {c.metodaPlata}
                      </span>

                      <button
                        type="button"
                        onClick={() => sterge(c.numar)}
                        className="ml-auto inline-flex items-center gap-1.5 text-sm text-steel-500 transition-colors hover:text-rust-600"
                      >
                        <Trash2 size={15} aria-hidden />
                        Șterge
                      </button>
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
