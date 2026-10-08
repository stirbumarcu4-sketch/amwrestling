import ProductCard from "@/components/produs/ProductCard";
import type { Produs } from "@/types";

/**
 * Câte coloane încap depinde de cât spațiu are grila, nu doar de lățimea
 * ecranului: în catalog stă lângă o bară de filtre de 260px, pe pagina
 * principală ocupă toată lățimea. La 1024px cu bară rămân ~660px, adică 4
 * coloane de 150px — prea înghesuit, de aceea acolo trecem la 4 abia de la `xl`.
 */
export type VariantaLatime = "plina" | "cu-bara";

const coloane: Record<VariantaLatime, string> = {
  plina: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  "cu-bara": "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
};

export default function ProductGrid({
  produse,
  termen,
  variantaLatime = "plina",
}: {
  produse: Produs[];
  termen?: string;
  variantaLatime?: VariantaLatime;
}) {
  return (
    <ul className={`grid gap-4 md:gap-6 ${coloane[variantaLatime]}`}>
      {produse.map((produs) => (
        <li key={produs.slug} className="flex">
          <ProductCard produs={produs} termen={termen} />
        </li>
      ))}
    </ul>
  );
}
