import type { Metadata } from "next";
import { citesteCategorii } from "@/lib/admin-date";
import FormularProdus from "@/components/admin/FormularProdus";

export const metadata: Metadata = { title: "Produs nou" };
export const dynamic = "force-dynamic";

export default async function PaginaProdusNou() {
  return <FormularProdus categorii={await citesteCategorii()} />;
}
