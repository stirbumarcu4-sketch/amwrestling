import type { Metadata } from "next";
import { citesteComenzi } from "@/lib/admin-date";
import ListaComenzi from "@/components/admin/ListaComenzi";

export const metadata: Metadata = { title: "Comenzi" };
export const dynamic = "force-dynamic";

export default async function PaginaComenzi() {
  return <ListaComenzi comenziInitiale={await citesteComenzi()} />;
}
