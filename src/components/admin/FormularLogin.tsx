"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FormularLogin() {
  const router = useRouter();
  const parametri = useSearchParams();
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [eroare, setEroare] = useState<string | null>(null);
  const [seTrimite, setSeTrimite] = useState(false);

  async function trimite(e: React.FormEvent) {
    e.preventDefault();
    setEroare(null);
    setSeTrimite(true);

    try {
      const raspuns = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, parola }),
      });

      if (!raspuns.ok) {
        const date = await raspuns.json().catch(() => ({}));
        setEroare(date.eroare ?? "Autentificare eșuată.");
        setSeTrimite(false);
        return;
      }

      // `refresh()` invalidează cache-ul routerului, ca middleware-ul să vadă
      // noul cookie la navigarea următoare.
      const destinatie = parametri.get("redirect") ?? "/admin";
      router.replace(destinatie.startsWith("/admin") ? destinatie : "/admin");
      router.refresh();
    } catch {
      setEroare("Serverul nu răspunde.");
      setSeTrimite(false);
    }
  }

  return (
    <form onSubmit={trimite} className="mt-8 space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-400"
        >
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-[var(--radius-sm)] border border-steel-600 bg-ink-800 px-3 py-2.5 text-chalk-50 outline-none focus:border-rust-500"
        />
      </div>

      <div>
        <label
          htmlFor="parola"
          className="block font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-400"
        >
          Parolă
        </label>
        <input
          id="parola"
          name="parola"
          type="password"
          autoComplete="current-password"
          required
          value={parola}
          onChange={(e) => setParola(e.target.value)}
          className="mt-2 w-full rounded-[var(--radius-sm)] border border-steel-600 bg-ink-800 px-3 py-2.5 text-chalk-50 outline-none focus:border-rust-500"
        />
      </div>

      {eroare ? (
        <p role="alert" className="text-sm text-rust-500">
          {eroare}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={seTrimite || !email || !parola}
        className="h-11 w-full rounded-[var(--radius-sm)] bg-rust-600 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-pe-accent transition-colors hover:bg-rust-700 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {seTrimite ? "Se verifică…" : "Intră"}
      </button>
    </form>
  );
}
