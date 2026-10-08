"use client";

// DECIZIE: butonul de favorite are nevoie de `localStorage`, deci de o
// componentă client proprie — specificația listează pagina /favorite, dar nu și
// controlul care adaugă în listă.

import { Heart } from "lucide-react";
import { useFavorite } from "@/lib/wishlist";
import { cn } from "@/lib/utils";

export default function WishlistButton({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const { contine, comuta, gata } = useFavorite();
  const salvat = gata && contine(slug);

  return (
    <button
      type="button"
      onClick={() => comuta(slug)}
      aria-pressed={salvat}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 border border-steel-300 px-6 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-700 transition-colors hover:bg-chalk-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600",
        className,
      )}
    >
      <Heart
        size={16}
        aria-hidden="true"
        className={salvat ? "fill-rust-600 text-rust-600" : undefined}
      />
      {salvat ? "Salvat la favorite" : "Adaugă la favorite"}
    </button>
  );
}
