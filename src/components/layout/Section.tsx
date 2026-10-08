import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Ritm vertical între secțiuni: 40px pe mobil, 56px pe desktop.
 * Două secțiuni alăturate dau deci 80px, respectiv 112px între ele — față de
 * 128 / 192px cât era înainte, la `py-16 lg:py-24`.
 */
export default function Section({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("py-10 lg:py-14", className)}>{children}</section>;
}
