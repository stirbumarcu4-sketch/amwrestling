import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TonBadge = "neutru" | "accent" | "stoc" | "limitat" | "inchis";

const tonuri: Record<TonBadge, string> = {
  neutru: "bg-chalk-100 text-ink-700 border-chalk-200",
  accent: "bg-rust-600 text-pe-accent border-rust-600",
  stoc: "bg-suprafata text-moss-600 border-moss-600",
  limitat: "bg-suprafata text-amber-600 border-amber-600",
  inchis: "bg-ink-900 text-chalk-50 border-ink-900",
};

export default function Badge({
  children,
  ton = "neutru",
  className,
}: {
  children: ReactNode;
  ton?: TonBadge;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-1 font-heading text-[11px] font-semibold uppercase tracking-[0.08em] leading-none",
        tonuri[ton],
        className,
      )}
    >
      {children}
    </span>
  );
}
