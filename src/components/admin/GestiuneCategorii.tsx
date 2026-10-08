"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import type { Categorie } from "@/types";

function slugificaClient(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[șş]/gi, "s")
    .replace(/[țţ]/gi, "t")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

const GOALA: Categorie = { slug: "", nume: "", descriere: "", imagine: "" };

const eticheta =
  "block font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-500";
const camp =
  "mt-1.5 w-full rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata px-3 py-2 text-sm outline-none focus:border-ink-900";

export default function GestiuneCategorii({
  categoriiInitiale,
  numarProduse,
}: {
  categoriiInitiale: Categorie[];
  numarProduse: Record<string, number>;
}) {
  const router = useRouter();
  const [categorii, setCategorii] = useState(categoriiInitiale);

  // `null` = formular închis; string gol = creare; altfel slug-ul editat.
  const [slugEditat, setSlugEditat] = useState<string | null>(null);
  const [ciorna, setCiorna] = useState<Categorie>(GOALA);
  const [erori, setErori] = useState<string[]>([]);
  const [ocupat, setOcupat] = useState(false);

  function deschideCreare() {
    setCiorna(GOALA);
    setSlugEditat("");
    setErori([]);
  }

  function deschideEditare(c: Categorie) {
    setCiorna(c);
    setSlugEditat(c.slug);
    setErori([]);
  }

  async function incarcaImagine(fisier: File) {
    setOcupat(true);
    setErori([]);

    const formular = new FormData();
    formular.append("fisier", fisier);
    formular.append("destinatie", "categorii");

    try {
      const raspuns = await fetch("/api/admin/upload", {
        method: "POST",
        body: formular,
      });
      const date = await raspuns.json();
      if (!raspuns.ok) setErori([date.eroare ?? "Încărcarea a eșuat."]);
      else setCiorna((c) => ({ ...c, imagine: date.cale }));
    } catch {
      setErori(["Încărcarea a eșuat."]);
    } finally {
      setOcupat(false);
    }
  }

  async function salveaza(e: React.FormEvent) {
    e.preventDefault();
    setErori([]);
    setOcupat(true);

    const eCreare = slugEditat === "";
    const url = eCreare
      ? "/api/admin/categorii"
      : `/api/admin/categorii/${slugEditat}`;

    try {
      const raspuns = await fetch(url, {
        method: eCreare ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ciorna),
      });
      const date = await raspuns.json();

      if (!raspuns.ok) {
        setErori(date.erori ?? [date.eroare ?? "Salvarea a eșuat."]);
        setOcupat(false);
        return;
      }

      setCategorii((lista) =>
        eCreare
          ? [...lista, date]
          : lista.map((c) => (c.slug === slugEditat ? date : c)),
      );
      setSlugEditat(null);
      setOcupat(false);
      router.refresh();
    } catch {
      setErori(["Serverul nu răspunde."]);
      setOcupat(false);
    }
  }

  async function sterge(c: Categorie) {
    if (!window.confirm(`Ștergi categoria „${c.nume}”?`)) return;

    const raspuns = await fetch(`/api/admin/categorii/${c.slug}`, {
      method: "DELETE",
    });

    if (!raspuns.ok) {
      const date = await raspuns.json().catch(() => ({}));
      window.alert(date.erori?.[0] ?? "Ștergerea a eșuat.");
      return;
    }

    setCategorii((lista) => lista.filter((x) => x.slug !== c.slug));
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-[0.04em] text-ink-900">
            Categorii
          </h1>
          <p className="mt-1 text-sm text-steel-500">{categorii.length} în magazin</p>
        </div>
        <button
          type="button"
          onClick={deschideCreare}
          className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] bg-rust-600 px-4 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-pe-accent transition-colors hover:bg-rust-700"
        >
          <Plus size={16} aria-hidden />
          Categorie nouă
        </button>
      </div>

      {slugEditat !== null ? (
        <form
          onSubmit={salveaza}
          className="mt-5 rounded-[var(--radius-sm)] border border-ink-900 bg-suprafata p-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900">
              {slugEditat === "" ? "Categorie nouă" : `Editează „${ciorna.nume}”`}
            </h2>
            <button
              type="button"
              onClick={() => setSlugEditat(null)}
              aria-label="Închide formularul"
              className="rounded-[var(--radius-sm)] p-1.5 text-steel-500 hover:bg-chalk-100"
            >
              <X size={16} />
            </button>
          </div>

          {erori.length > 0 ? (
            <ul role="alert" className="mt-3 space-y-1 text-sm text-rust-700">
              {erori.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="cat-nume" className={eticheta}>Nume *</label>
              <input
                id="cat-nume"
                required
                value={ciorna.nume}
                onChange={(e) =>
                  setCiorna((c) => ({
                    ...c,
                    nume: e.target.value,
                    // La creare slug-ul urmează numele; la editare nu-l atingem,
                    // ca să nu rupem adresele existente din greșeală.
                    slug: slugEditat === "" ? slugificaClient(e.target.value) : c.slug,
                  }))
                }
                className={camp}
              />
            </div>

            <div>
              <label htmlFor="cat-slug" className={eticheta}>Slug *</label>
              <input
                id="cat-slug"
                required
                value={ciorna.slug}
                onChange={(e) =>
                  setCiorna((c) => ({ ...c, slug: slugificaClient(e.target.value) }))
                }
                className={camp}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="cat-descriere" className={eticheta}>Descriere *</label>
              <textarea
                id="cat-descriere"
                required
                rows={3}
                value={ciorna.descriere}
                onChange={(e) => setCiorna((c) => ({ ...c, descriere: e.target.value }))}
                className={camp}
              />
            </div>

            <div className="sm:col-span-2">
              <span className={eticheta}>Imagine *</span>
              <div className="mt-2 flex items-center gap-3">
                {ciorna.imagine ? (
                  <div className="relative h-20 w-30 overflow-hidden rounded-[var(--radius-sm)] border border-chalk-200 bg-chalk-100">
                    <Image
                      src={ciorna.imagine}
                      alt=""
                      width={120}
                      height={80}
                      className="h-20 w-30 object-cover"
                    />
                  </div>
                ) : null}

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border border-dashed border-steel-300 px-4 py-2.5 text-sm text-steel-500 transition-colors hover:border-ink-900 hover:text-ink-900">
                  <Upload size={16} aria-hidden />
                  {ocupat ? "Se încarcă…" : ciorna.imagine ? "Schimbă" : "Încarcă imagine"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="sr-only"
                    disabled={ocupat}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) incarcaImagine(f);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={ocupat}
            className="mt-5 h-10 rounded-[var(--radius-sm)] bg-ink-900 px-5 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-chalk-50 transition-colors hover:bg-ink-800 disabled:opacity-45"
          >
            {ocupat ? "Se salvează…" : "Salvează"}
          </button>
        </form>
      ) : null}

      <ul className="mt-5 divide-y divide-chalk-200 rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata">
        {categorii.map((c) => (
          <li key={c.slug} className="flex items-center gap-4 p-3">
            <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-chalk-100">
              {c.imagine ? (
                <Image src={c.imagine} alt="" fill sizes="80px" className="object-cover" />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-semibold text-ink-900">
                {c.nume}
              </p>
              <p className="truncate text-xs text-steel-500">
                /{c.slug} · {numarProduse[c.slug] ?? 0}{" "}
                {(numarProduse[c.slug] ?? 0) === 1 ? "produs" : "produse"}
              </p>
            </div>

            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => deschideEditare(c)}
                aria-label={`Editează ${c.nume}`}
                className="rounded-[var(--radius-sm)] p-2 text-steel-500 transition-colors hover:bg-chalk-100 hover:text-ink-900"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={() => sterge(c)}
                aria-label={`Șterge ${c.nume}`}
                className="rounded-[var(--radius-sm)] p-2 text-steel-500 transition-colors hover:bg-rust-600/10 hover:text-rust-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
