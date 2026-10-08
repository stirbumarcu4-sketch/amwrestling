import type { Metadata } from "next";
import { citesteSetari } from "@/lib/admin-date";
import FormularSetari from "@/components/admin/FormularSetari";

export const metadata: Metadata = { title: "Setări" };
export const dynamic = "force-dynamic";

export default async function PaginaSetari() {
  return <FormularSetari setariInitiale={await citesteSetari()} />;
}
