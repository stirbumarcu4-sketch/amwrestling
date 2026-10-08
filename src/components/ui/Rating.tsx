import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Stele pline / goale, plus numărul de evaluări. Datele sunt demonstrative. */
export default function Rating({
  valoare,
  nrRecenzii,
  className,
}: {
  valoare: number;
  nrRecenzii?: number;
  className?: string;
}) {
  const plineIntregi = Math.round(valoare);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={14}
            className={
              i <= plineIntregi
                ? "fill-amber-600 text-amber-600"
                : "fill-transparent text-steel-400"
            }
          />
        ))}
      </span>
      <span className="text-sm text-steel-500 tabular">
        {valoare.toString().replace(".", ",")}
        {typeof nrRecenzii === "number" ? (
          <> ({nrRecenzii} evaluări)</>
        ) : null}
      </span>
    </div>
  );
}
