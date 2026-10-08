import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { citesteCategorii, citesteProduse } from "@/lib/admin-date";
import FormularProdus from "@/components/admin/FormularProdus";

export const metadata: Metadata = { title: "Editează produs" };
export const dynamic = "force-dynamic";

export default async function PaginaEditareProdus({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [produse, categorii] = await Promise.all([
    citesteProduse(),
    citesteCategorii(),
  ]);

  const produs = produse.find((p) => p.slug === slug);
  if (!produs) notFound();

  return <FormularProdus produsInitial={produs} categorii={categorii} />;
}
