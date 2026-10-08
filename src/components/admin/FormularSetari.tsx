"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SetariSite } from "@/data/site";

const eticheta =
  "block font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-500";
const camp =
  "mt-1.5 w-full rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata px-3 py-2 text-sm outline-none focus:border-ink-900";

export default function FormularSetari({
  setariInitiale,
}: {
  setariInitiale: SetariSite;
}) {
  const router = useRouter();
  const [setari, setSetari] = useState(setariInitiale);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [eroare, setEroare] = useState<string | null>(null);
  const [seSalveaza, setSeSalveaza] = useState(false);

  const seteaza = <C extends keyof SetariSite>(cheie: C, valoare: SetariSite[C]) =>
    setSetari((s) => ({ ...s, [cheie]: valoare }));

  async function salveaza(e: React.FormEvent) {
    e.preventDefault();
    setMesaj(null);
    setEroare(null);
    setSeSalveaza(true);

    try {
      const raspuns = await fetch("/api/admin/setari", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setari),
      });

      if (!raspuns.ok) {
        const date = await raspuns.json().catch(() => ({}));
        setEroare(date.eroare ?? "Salvarea a eșuat.");
      } else {
        setMesaj("Setările au fost salvate.");
        router.refresh();
      }
    } catch {
      setEroare("Serverul nu răspunde.");
    } finally {
      setSeSalveaza(false);
    }
  }

  return (
    <form onSubmit={salveaza} className="mx-auto max-w-3xl pb-16">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-[0.04em] text-ink-900">
        Setări
      </h1>
      <p className="mt-1 text-sm text-steel-500">
        Datele magazinului, folosite în antet, subsol, facturi și pagini legale.
      </p>

      {mesaj ? (
        <p role="status" className="mt-4 rounded-[var(--radius-sm)] border border-moss-600/30 bg-moss-600/5 p-3 text-sm text-moss-600">
          {mesaj}
        </p>
      ) : null}
      {eroare ? (
        <p role="alert" className="mt-4 rounded-[var(--radius-sm)] border border-rust-600/30 bg-rust-600/5 p-3 text-sm text-rust-700">
          {eroare}
        </p>
      ) : null}

      <section className="mt-6 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-5">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900">
          Identitate
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="nume" className={eticheta}>Nume magazin</label>
            <input id="nume" value={setari.nume} onChange={(e) => seteaza("nume", e.target.value)} className={camp} />
          </div>
          <div>
            <label htmlFor="numeScurt" className={eticheta}>Nume scurt</label>
            <input id="numeScurt" value={setari.numeScurt} onChange={(e) => seteaza("numeScurt", e.target.value)} className={camp} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="tagline" className={eticheta}>Slogan</label>
            <input id="tagline" value={setari.tagline} onChange={(e) => seteaza("tagline", e.target.value)} className={camp} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="descriere" className={eticheta}>Descriere (SEO)</label>
            <textarea id="descriere" rows={3} value={setari.descriere} onChange={(e) => seteaza("descriere", e.target.value)} className={camp} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="url" className={eticheta}>Adresă site</label>
            <input id="url" type="url" value={setari.url} onChange={(e) => seteaza("url", e.target.value)} className={camp} />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-5">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900">
          Contact
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={eticheta}>E-mail</label>
            <input id="email" type="email" value={setari.email} onChange={(e) => seteaza("email", e.target.value)} className={camp} />
          </div>
          <div>
            <label htmlFor="telefon" className={eticheta}>Telefon</label>
            <input id="telefon" value={setari.telefon} onChange={(e) => seteaza("telefon", e.target.value)} className={camp} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="adresa" className={eticheta}>Adresă</label>
            <input id="adresa" value={setari.adresa} onChange={(e) => seteaza("adresa", e.target.value)} className={camp} />
          </div>
          <div>
            <label htmlFor="idno" className={eticheta}>IDNO</label>
            <input id="idno" value={setari.idno} onChange={(e) => seteaza("idno", e.target.value)} className={camp} />
          </div>
          <div>
            <label htmlFor="program" className={eticheta}>Program</label>
            <input id="program" value={setari.program} onChange={(e) => seteaza("program", e.target.value)} className={camp} />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-5">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900">
          Livrare și retur
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="livrareGratuita" className={eticheta}>Livrare gratuită peste (MDL)</label>
            <input id="livrareGratuita" type="number" min={0} value={setari.livrareGratuitaPeste} onChange={(e) => seteaza("livrareGratuitaPeste", Number(e.target.value))} className={camp} />
          </div>
          <div>
            <label htmlFor="costLivrare" className={eticheta}>Cost livrare (MDL)</label>
            <input id="costLivrare" type="number" min={0} value={setari.costLivrare} onChange={(e) => seteaza("costLivrare", Number(e.target.value))} className={camp} />
          </div>
          <div>
            <label htmlFor="costVoluminos" className={eticheta}>Cost livrare voluminos (MDL)</label>
            <input id="costVoluminos" type="number" min={0} value={setari.costLivrareVoluminos} onChange={(e) => seteaza("costLivrareVoluminos", Number(e.target.value))} className={camp} />
          </div>
          <div>
            <label htmlFor="zileRetur" className={eticheta}>Zile retur</label>
            <input id="zileRetur" type="number" min={0} value={setari.zileRetur} onChange={(e) => seteaza("zileRetur", Number(e.target.value))} className={camp} />
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-5">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900">
          Rețele sociale
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {(["instagram", "facebook", "youtube"] as const).map((retea) => (
            <div key={retea}>
              <label htmlFor={retea} className={`${eticheta} capitalize`}>{retea}</label>
              <input
                id={retea}
                type="url"
                value={setari.social[retea]}
                onChange={(e) =>
                  seteaza("social", { ...setari.social, [retea]: e.target.value })
                }
                className={camp}
              />
            </div>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={seSalveaza}
        className="mt-6 h-11 rounded-[var(--radius-sm)] bg-ink-900 px-6 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-chalk-50 transition-colors hover:bg-ink-800 disabled:opacity-45"
      >
        {seSalveaza ? "Se salvează…" : "Salvează setările"}
      </button>
    </form>
  );
}
