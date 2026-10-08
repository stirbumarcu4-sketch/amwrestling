"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload, X } from "lucide-react";
import type { Categorie, Produs } from "@/types";

const STARI_STOC = [
  { valoare: "in-stoc", eticheta: "În stoc" },
  { valoare: "stoc-limitat", eticheta: "Stoc limitat" },
  { valoare: "la-comanda", eticheta: "La comandă" },
  { valoare: "epuizat", eticheta: "Epuizat" },
];

const ETICHETE = [
  { valoare: "nou", eticheta: "Nou" },
  { valoare: "bestseller", eticheta: "Bestseller" },
  { valoare: "reducere", eticheta: "Reducere" },
  { valoare: "produs-moldovenesc", eticheta: "Produs moldovenesc" },
];

/** `Masă de competiție` → `masa-de-competitie` */
function slugificaClient(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[șş]/gi, "s")
    .replace(/[țţ]/gi, "t")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const GOL: Produs = {
  slug: "",
  nume: "",
  sku: "",
  categorie: "",
  pret: 0,
  descriereScurta: "",
  descriere: "",
  specificatii: [],
  imagini: [],
  stoc: "in-stoc",
};

const eticheta =
  "block font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-500";
const camp =
  "mt-1.5 w-full rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata px-3 py-2 text-sm outline-none focus:border-ink-900";

export default function FormularProdus({
  produsInitial,
  categorii,
}: {
  /** Lipsă la creare, prezent la editare. */
  produsInitial?: Produs;
  categorii: Categorie[];
}) {
  const router = useRouter();
  const eEditare = Boolean(produsInitial);

  const [produs, setProdus] = useState<Produs>(produsInitial ?? GOL);
  // La creare, slug-ul urmează numele până când utilizatorul îl scrie manual.
  const [slugManual, setSlugManual] = useState(eEditare);
  const [erori, setErori] = useState<string[]>([]);
  const [seSalveaza, setSeSalveaza] = useState(false);
  const [seIncarca, setSeIncarca] = useState(false);

  const seteaza = <C extends keyof Produs>(cheie: C, valoare: Produs[C]) =>
    setProdus((p) => ({ ...p, [cheie]: valoare }));

  function schimbaNume(nume: string) {
    setProdus((p) => ({
      ...p,
      nume,
      slug: slugManual ? p.slug : slugificaClient(nume),
    }));
  }

  async function incarcaImagine(fisier: File) {
    if (produs.imagini.length >= 4) {
      setErori(["Maximum 4 imagini per produs."]);
      return;
    }

    setSeIncarca(true);
    setErori([]);

    const formular = new FormData();
    formular.append("fisier", fisier);
    formular.append("destinatie", "produse");

    try {
      const raspuns = await fetch("/api/admin/upload", {
        method: "POST",
        body: formular,
      });
      const date = await raspuns.json();

      if (!raspuns.ok) {
        setErori([date.eroare ?? "Încărcarea a eșuat."]);
      } else {
        setProdus((p) => ({ ...p, imagini: [...p.imagini, date.cale] }));
      }
    } catch {
      setErori(["Încărcarea a eșuat."]);
    } finally {
      setSeIncarca(false);
    }
  }

  async function salveaza(e: React.FormEvent) {
    e.preventDefault();
    setErori([]);
    setSeSalveaza(true);

    const url = eEditare
      ? `/api/admin/produse/${produsInitial!.slug}`
      : "/api/admin/produse";

    try {
      const raspuns = await fetch(url, {
        method: eEditare ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produs),
      });
      const date = await raspuns.json();

      if (!raspuns.ok) {
        setErori(date.erori ?? [date.eroare ?? "Salvarea a eșuat."]);
        setSeSalveaza(false);
        return;
      }

      router.push("/admin/produse");
      router.refresh();
    } catch {
      setErori(["Serverul nu răspunde."]);
      setSeSalveaza(false);
    }
  }

  return (
    <form onSubmit={salveaza} className="mx-auto max-w-3xl pb-16">
      <h1 className="font-heading text-2xl font-bold uppercase tracking-[0.04em] text-ink-900">
        {eEditare ? "Editează produs" : "Produs nou"}
      </h1>

      {erori.length > 0 ? (
        <ul
          role="alert"
          className="mt-4 space-y-1 rounded-[var(--radius-sm)] border border-rust-600/30 bg-rust-600/5 p-4 text-sm text-rust-700"
        >
          {erori.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 space-y-5 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="nume" className={eticheta}>Nume *</label>
            <input
              id="nume"
              required
              value={produs.nume}
              onChange={(e) => schimbaNume(e.target.value)}
              className={camp}
            />
          </div>

          <div>
            <label htmlFor="slug" className={eticheta}>Slug (adresă) *</label>
            <input
              id="slug"
              required
              value={produs.slug}
              onChange={(e) => {
                setSlugManual(true);
                seteaza("slug", slugificaClient(e.target.value));
              }}
              className={camp}
            />
          </div>

          <div>
            <label htmlFor="sku" className={eticheta}>SKU *</label>
            <input
              id="sku"
              required
              value={produs.sku}
              onChange={(e) => seteaza("sku", e.target.value)}
              className={camp}
            />
          </div>

          <div>
            <label htmlFor="categorie" className={eticheta}>Categorie *</label>
            <select
              id="categorie"
              required
              value={produs.categorie}
              onChange={(e) => seteaza("categorie", e.target.value)}
              className={camp}
            >
              <option value="">Alege…</option>
              {categorii.map((c) => (
                <option key={c.slug} value={c.slug}>{c.nume}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stoc" className={eticheta}>Stoc *</label>
            <select
              id="stoc"
              value={produs.stoc}
              onChange={(e) => seteaza("stoc", e.target.value as Produs["stoc"])}
              className={camp}
            >
              {STARI_STOC.map((s) => (
                <option key={s.valoare} value={s.valoare}>{s.eticheta}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="pret" className={eticheta}>Preț (MDL) *</label>
            <input
              id="pret"
              type="number"
              min={0}
              step={1}
              required
              value={produs.pret || ""}
              onChange={(e) => seteaza("pret", Number(e.target.value))}
              className={camp}
            />
          </div>

          <div>
            <label htmlFor="pretVechi" className={eticheta}>
              Preț vechi (opțional)
            </label>
            <input
              id="pretVechi"
              type="number"
              min={0}
              step={1}
              value={produs.pretVechi ?? ""}
              onChange={(e) =>
                setProdus((p) => {
                  const copie = { ...p };
                  if (e.target.value === "") delete copie.pretVechi;
                  else copie.pretVechi = Number(e.target.value);
                  return copie;
                })
              }
              className={camp}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="descriereScurta" className={eticheta}>
              Descriere scurtă * (max. 160 caractere)
            </label>
            <input
              id="descriereScurta"
              required
              maxLength={160}
              value={produs.descriereScurta}
              onChange={(e) => seteaza("descriereScurta", e.target.value)}
              className={camp}
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="descriere" className={eticheta}>Descriere *</label>
            <textarea
              id="descriere"
              required
              rows={5}
              value={produs.descriere}
              onChange={(e) => seteaza("descriere", e.target.value)}
              className={camp}
            />
          </div>
        </div>
      </div>

      {/* ── Imagini ─────────────────────────────────────────────────────── */}
      <section className="mt-5 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-5">
        <h2 className={eticheta}>Imagini * (1–4, prima e cea principală)</h2>

        <div className="mt-3 flex flex-wrap gap-3">
          {produs.imagini.map((cale, index) => (
            <div
              key={cale}
              className="relative h-24 w-24 overflow-hidden rounded-[var(--radius-sm)] border border-chalk-200 bg-chalk-100"
            >
              <Image src={cale} alt="" fill sizes="96px" className="object-cover" />
              {index === 0 ? (
                <span className="absolute left-0 top-0 bg-ink-900 px-1.5 py-0.5 text-[10px] font-semibold text-chalk-50">
                  Principală
                </span>
              ) : null}
              <button
                type="button"
                aria-label={`Elimină imaginea ${index + 1}`}
                onClick={() =>
                  seteaza(
                    "imagini",
                    produs.imagini.filter((i) => i !== cale),
                  )
                }
                className="absolute right-0 top-0 bg-rust-600 p-1 text-pe-accent"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {produs.imagini.length < 4 ? (
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--radius-sm)] border border-dashed border-steel-300 text-steel-500 transition-colors hover:border-ink-900 hover:text-ink-900">
              <Upload size={18} aria-hidden />
              <span className="text-[11px]">
                {seIncarca ? "Se încarcă…" : "Încarcă"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                disabled={seIncarca}
                onChange={(e) => {
                  const fisier = e.target.files?.[0];
                  if (fisier) incarcaImagine(fisier);
                  e.target.value = "";
                }}
              />
            </label>
          ) : null}
        </div>
      </section>

      {/* ── Specificații ────────────────────────────────────────────────── */}
      <section className="mt-5 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-5">
        <h2 className={eticheta}>Specificații</h2>

        <div className="mt-3 space-y-2">
          {produs.specificatii.map((spec, index) => (
            <div key={index} className="flex gap-2">
              <input
                aria-label={`Etichetă specificație ${index + 1}`}
                placeholder="Etichetă"
                value={spec.eticheta}
                onChange={(e) => {
                  const copie = [...produs.specificatii];
                  copie[index] = { ...copie[index], eticheta: e.target.value };
                  seteaza("specificatii", copie);
                }}
                className="w-1/3 rounded-[var(--radius-sm)] border border-chalk-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
              />
              <input
                aria-label={`Valoare specificație ${index + 1}`}
                placeholder="Valoare"
                value={spec.valoare}
                onChange={(e) => {
                  const copie = [...produs.specificatii];
                  copie[index] = { ...copie[index], valoare: e.target.value };
                  seteaza("specificatii", copie);
                }}
                className="flex-1 rounded-[var(--radius-sm)] border border-chalk-200 px-3 py-2 text-sm outline-none focus:border-ink-900"
              />
              <button
                type="button"
                aria-label={`Șterge specificația ${index + 1}`}
                onClick={() =>
                  seteaza(
                    "specificatii",
                    produs.specificatii.filter((_, i) => i !== index),
                  )
                }
                className="rounded-[var(--radius-sm)] p-2 text-steel-500 hover:bg-rust-600/10 hover:text-rust-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            seteaza("specificatii", [
              ...produs.specificatii,
              { eticheta: "", valoare: "" },
            ])
          }
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink-700 underline underline-offset-4"
        >
          <Plus size={14} aria-hidden />
          Adaugă specificație
        </button>
      </section>

      {/* ── Etichete și opțiuni ─────────────────────────────────────────── */}
      <section className="mt-5 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata p-5">
        <h2 className={eticheta}>Etichete</h2>
        <div className="mt-3 flex flex-wrap gap-4">
          {ETICHETE.map((et) => (
            <label key={et.valoare} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={produs.etichete?.includes(et.valoare as never) ?? false}
                onChange={(e) => {
                  const curente = produs.etichete ?? [];
                  const noi = e.target.checked
                    ? [...curente, et.valoare as never]
                    : curente.filter((x) => x !== et.valoare);
                  setProdus((p) => {
                    const copie = { ...p };
                    if (noi.length) copie.etichete = noi;
                    else delete copie.etichete;
                    return copie;
                  });
                }}
              />
              {et.eticheta}
            </label>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="greutate" className={eticheta}>Greutate (kg)</label>
            <input
              id="greutate"
              type="number"
              min={0}
              step="0.1"
              value={produs.greutateKg ?? ""}
              onChange={(e) =>
                setProdus((p) => {
                  const copie = { ...p };
                  if (e.target.value === "") delete copie.greutateKg;
                  else copie.greutateKg = Number(e.target.value);
                  return copie;
                })
              }
              className={camp}
            />
          </div>

          <div>
            <label htmlFor="marimi" className={eticheta}>
              Mărimi (separate prin virgulă)
            </label>
            <input
              id="marimi"
              placeholder="S, M, L, XL"
              value={produs.marimi?.join(", ") ?? ""}
              onChange={(e) =>
                setProdus((p) => {
                  const lista = e.target.value
                    .split(",")
                    .map((m) => m.trim())
                    .filter(Boolean);
                  const copie = { ...p };
                  if (lista.length) copie.marimi = lista;
                  else delete copie.marimi;
                  return copie;
                })
              }
              className={camp}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={produs.voluminos ?? false}
              onChange={(e) => seteaza("voluminos", e.target.checked)}
            />
            Voluminos (transport special)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={produs.personalizat ?? false}
              onChange={(e) => seteaza("personalizat", e.target.checked)}
            />
            Personalizat (exceptat de la retur)
          </label>
        </div>
      </section>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={seSalveaza}
          className="h-11 rounded-[var(--radius-sm)] bg-ink-900 px-6 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-chalk-50 transition-colors hover:bg-ink-800 disabled:opacity-45"
        >
          {seSalveaza ? "Se salvează…" : eEditare ? "Salvează" : "Creează produs"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produse")}
          className="h-11 rounded-[var(--radius-sm)] border border-steel-300 px-6 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-700 transition-colors hover:bg-chalk-100"
        >
          Renunță
        </button>
      </div>
    </form>
  );
}
