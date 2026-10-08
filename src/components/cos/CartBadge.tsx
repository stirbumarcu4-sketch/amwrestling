"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCos } from "@/lib/cart-context";
import Skeleton from "@/components/ui/Skeleton";

export default function CartBadge() {
  const { nrArticole, gata } = useCos();

  return (
    <Link
      href="/cos"
      aria-label={
        gata && nrArticole > 0
          ? `Coș de cumpărături, ${nrArticole} articole`
          : "Coș de cumpărături"
      }
      className="relative inline-flex h-10 w-10 items-center justify-center text-ink-700 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
    >
      <ShoppingBag size={20} aria-hidden="true" />
      {!gata ? (
        <Skeleton className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full" />
      ) : nrArticole > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rust-600 px-1 text-[11px] font-semibold leading-none text-pe-accent tabular">
          {nrArticole}
        </span>
      ) : null}
    </Link>
  );
}
