"use client";

import { usePathname } from "next/navigation";

// Panoul de administrare are propriul cadru și nu trebuie să moștenească bara
// de anunț, header-ul și footer-ul magazinului. Elementele vin ca props —
// rămân Server Components, randate pe server, iar aici doar decidem dacă apar.
export default function ShellSite({
  bara,
  header,
  footer,
  children,
}: {
  bara: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      {bara}
      {header}
      <main id="continut" className="flex-1">
        {children}
      </main>
      {footer}
    </>
  );
}
