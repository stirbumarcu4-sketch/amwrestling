import { cn } from "@/lib/utils";
import type { StareStoc } from "@/types";

const etichete: Record<StareStoc, string> = {
  "in-stoc": "În stoc",
  "stoc-limitat": "Stoc limitat",
  "la-comanda": "La comandă",
  epuizat: "Stoc epuizat",
};

const culoriText: Record<StareStoc, string> = {
  "in-stoc": "text-moss-600",
  "stoc-limitat": "text-amber-600",
  "la-comanda": "text-steel-500",
  epuizat: "text-steel-500",
};

const culoriPunct: Record<StareStoc, string> = {
  "in-stoc": "bg-moss-600",
  "stoc-limitat": "bg-amber-600",
  "la-comanda": "bg-steel-400",
  epuizat: "bg-steel-400",
};

export default function StockBadge({
  stoc,
  dimensiune = "sm",
  className,
}: {
  stoc: StareStoc;
  /** `xs` pe cardurile din grilă, unde stă pe același nivel cu categoria. */
  dimensiune?: "xs" | "sm";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        dimensiune === "xs" ? "text-xs" : "text-sm",
        culoriText[stoc],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", culoriPunct[stoc])}
      />
      {etichete[stoc]}
    </span>
  );
}
