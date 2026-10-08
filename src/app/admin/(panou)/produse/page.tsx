import type { Metadata } from "next";
import { citesteCategorii, citesteProduse } from "@/lib/admin-date";
import ListaProduse from "@/components/admin/ListaProduse";

export const metadata: Metadata = { title: "Produse" };
export const dynamic = "force-dynamic";

export default async function PaginaProduse() {
  const [produse, categorii] = await Promise.all([
    citesteProduse(),
    citesteCategorii(),
  ]);

  return <ListaProduse produseInitiale={produse} categorii={categorii} />;
}
