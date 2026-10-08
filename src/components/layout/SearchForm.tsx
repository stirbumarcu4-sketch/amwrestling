"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchForm({
  className,
  laCautare,
}: {
  className?: string;
  laCautare?: () => void;
}) {
  const router = useRouter();
  const id = useId();
  const [termen, setTermen] = useState("");

  function trimite(eveniment: FormEvent<HTMLFormElement>) {
    eveniment.preventDefault();
    const curatat = termen.trim();
    if (!curatat) return;
    laCautare?.();
    router.push(`/cautare?q=${encodeURIComponent(curatat)}`);
  }

  return (
    <form onSubmit={trimite} role="search" className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        Caută produse
      </label>
      <input
        id={id}
        type="search"
        name="q"
        value={termen}
        onChange={(e) => setTermen(e.target.value)}
        placeholder="Caută produse"
        className="h-10 w-full rounded-[var(--radius-sm)] border border-steel-300 bg-suprafata pl-9 pr-3 text-sm text-ink-700 placeholder:text-steel-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
      />
      <Search
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-steel-500"
      />
      <button type="submit" className="sr-only">
        Caută
      </button>
    </form>
  );
}
