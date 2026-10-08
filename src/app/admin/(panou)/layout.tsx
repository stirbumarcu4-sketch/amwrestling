import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import NavigatieAdmin from "@/components/admin/NavigatieAdmin";
import { sePoateScrie } from "@/lib/admin-date";

export const metadata: Metadata = {
  title: { default: "Administrare", template: "%s · Administrare" },
  robots: { index: false, follow: false },
};

export default async function LayoutAdmin({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const scriere = await sePoateScrie();

  return (
    <div className="flex min-h-screen flex-col bg-chalk-50 lg:flex-row">
      <NavigatieAdmin />
      <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-10">
        {/* Pe găzduirile serverless discul e doar-citire: panoul arată datele,
            dar orice salvare eșuează. Mai bine se spune din capul locului
            decât să se afle după ce formularul a fost completat. */}
        {!scriere ? (
          <div className="mx-auto mb-6 flex max-w-6xl items-start gap-3 rounded-[var(--radius-sm)] border border-amber-600/40 bg-amber-600/10 p-4">
            <TriangleAlert
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
              aria-hidden
            />
            <div className="text-sm">
              <p className="font-heading font-semibold text-amber-600">
                Modificările nu pot fi salvate aici
              </p>
              <p className="mt-1 text-steel-500">
                Site-ul publicat rulează de pe un disc pe care nu se poate
                scrie. Poți vedea produsele, categoriile și comenzile, dar
                salvarea, ștergerea și încărcarea de imagini vor eșua.
                Modifică-le pe calculatorul tău, apoi publică din nou.
              </p>
            </div>
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
