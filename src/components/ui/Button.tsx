import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type VariantaButon = "primary" | "accent" | "ghost" | "link";
export type DimensiuneButon = "sm" | "md" | "lg";

const baza =
  "inline-flex items-center justify-center gap-2 font-heading font-semibold uppercase tracking-[0.06em] " +
  "rounded-[var(--radius-sm)] transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600 " +
  "disabled:opacity-45 disabled:cursor-not-allowed aria-disabled:opacity-45 aria-disabled:cursor-not-allowed";

const variante: Record<VariantaButon, string> = {
  primary: "bg-ink-900 text-chalk-50 hover:bg-ink-800",
  accent: "bg-rust-600 text-pe-accent hover:bg-rust-700",
  ghost: "border border-steel-300 text-ink-700 hover:bg-chalk-100",
  // DECIZIE: varianta „link” nu are înălțime fixă — se așază în fluxul textului.
  link: "text-ink-900 underline underline-offset-4 decoration-steel-400 hover:decoration-ink-900",
};

const dimensiuni: Record<DimensiuneButon, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

type ProprietatiComune = {
  varianta?: VariantaButon;
  dimensiune?: DimensiuneButon;
  className?: string;
  children: ReactNode;
};

type ProprietatiButon = ProprietatiComune &
  Omit<ComponentProps<"button">, "className" | "children"> & { href?: never };

type ProprietatiLink = ProprietatiComune &
  Omit<ComponentProps<typeof Link>, "className" | "children" | "href"> & {
    href: string;
  };

export default function Button(props: ProprietatiButon | ProprietatiLink) {
  const {
    varianta = "primary",
    dimensiune = "md",
    className,
    children,
    ...rest
  } = props;

  const clase = cn(
    baza,
    variante[varianta],
    varianta === "link" ? "" : dimensiuni[dimensiune],
    className,
  );

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...restLink } = rest as ProprietatiLink;
    return (
      <Link href={href} className={clase} {...restLink}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...restButon } = rest as ProprietatiButon;
  return (
    <button type={type} className={clase} {...restButon}>
      {children}
    </button>
  );
}
