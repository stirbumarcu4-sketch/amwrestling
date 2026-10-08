import { Suspense } from "react";
import type { Metadata } from "next";
import FormularLogin from "@/components/admin/FormularLogin";

export const metadata: Metadata = {
  title: "Autentificare administrare",
  robots: { index: false, follow: false },
};

export default function PaginaLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-carbon px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-[0.06em] text-ink-900">
          Administrare
        </h1>
        <p className="mt-2 text-sm text-steel-500">
          Introdu e-mailul și parola pentru a continua.
        </p>
        {/* `useSearchParams` din formular cere o graniță Suspense. */}
        <Suspense fallback={<div className="mt-8 h-32" />}>
          <FormularLogin />
        </Suspense>
      </div>
    </div>
  );
}
