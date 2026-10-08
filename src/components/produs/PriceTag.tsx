import { formatPret, procentReducere } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function PriceTag({
  pret,
  pretVechi,
  dimensiune = "md",
  className,
}: {
  pret: number;
  pretVechi?: number;
  dimensiune?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dimensiuni = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  } as const;

  // Prețul vechi stă în aceeași grupă `whitespace-nowrap` cu cel nou, ca să
  // rămână lângă el și pe cardurile înguste din grilă. Înainte erau doi copii
  // separați ai unui `flex-wrap` și treceau pe rânduri diferite.
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span className="inline-flex items-baseline gap-2 whitespace-nowrap">
        <span
          className={cn(
            "font-semibold tabular",
            dimensiuni[dimensiune],
            pretVechi ? "text-rust-600" : "text-ink-900",
          )}
        >
          {formatPret(pret)}
        </span>
        {pretVechi ? (
          <span
            className={cn(
              "text-steel-500 line-through tabular",
              dimensiune === "sm" ? "text-xs" : "text-sm",
            )}
          >
            {formatPret(pretVechi)}
          </span>
        ) : null}
      </span>
      {pretVechi ? (
        <span
          className="rounded-[var(--radius-sm)] bg-rust-100 px-1.5 py-0.5 font-heading text-[11px] font-bold leading-none tracking-[0.04em] text-rust-700 tabular"
          aria-label={`Reducere de ${procentReducere(pretVechi, pret)}%`}
        >
          −{procentReducere(pretVechi, pret)}%
        </span>
      ) : null}
    </p>
  );
}
