import type { Metadata } from "next";
import { citesteCategorii, citesteProduse } from "@/lib/admin-date";
import GestiuneCategorii from "@/components/admin/GestiuneCategorii";

export const metadata: Metadata = { title: "Categorii" };
export const dynamic = "force-dynamic";

export default async function PaginaCategorii() {
  const [categorii, produse] = await Promise.all([
    citesteCategorii(),
    citesteProduse(),
  ]);

  // Numărul de produse per categorie explică de ce unele nu pot fi șterse.
  const numarProduse: Record<string, number> = {};
  for (const p of produse) {
    numarProduse[p.categorie] = (numarProduse[p.categorie] ?? 0) + 1;
  }

  return (
    <GestiuneCategorii
      categoriiInitiale={categorii}
      numarProduse={numarProduse}
    />
  );
}
