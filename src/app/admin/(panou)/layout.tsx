import type { Metadata } from "next";
import NavigatieAdmin from "@/components/admin/NavigatieAdmin";

export const metadata: Metadata = {
  title: { default: "Administrare", template: "%s · Administrare" },
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-chalk-50 lg:flex-row">
      <NavigatieAdmin />
      <main className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
