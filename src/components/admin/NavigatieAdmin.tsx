"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
  LogOut,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LEGATURI = [
  { href: "/admin", eticheta: "Panou", Icon: LayoutDashboard },
  { href: "/admin/produse", eticheta: "Produse", Icon: Package },
  { href: "/admin/categorii", eticheta: "Categorii", Icon: FolderTree },
  { href: "/admin/comenzi", eticheta: "Comenzi", Icon: ShoppingCart },
  { href: "/admin/setari", eticheta: "Setări", Icon: Settings },
];

export default function NavigatieAdmin() {
  const pathname = usePathname();
  const router = useRouter();

  async function iesi() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    // `lg:self-start` e esențial: într-un flex-row, elementele primesc implicit
    // `align-self: stretch`, iar un element întins pe toată înălțimea nu se
    // poate lipi niciodată — de aceea bara dispărea la derulare. Doar de la
    // `lg`, fiindcă sub acel prag layout-ul e flex-col și `self-start` ar
    // strânge bara la lățimea conținutului.
    // `h-screen` + `overflow-y-auto` o țin exact cât ecranul, cu derulare
    // proprie dacă meniul ar depăși înălțimea.
    <nav className="sticky top-0 z-30 shrink-0 bg-carbon lg:flex lg:h-screen lg:w-60 lg:flex-col lg:self-start lg:overflow-y-auto">
      <div className="flex items-center justify-between px-4 py-4 lg:block lg:px-5 lg:py-6">
        <Link
          href="/admin"
          className="font-heading text-lg font-bold uppercase tracking-[0.06em] text-ink-900"
        >
          Administrare
        </Link>
      </div>

      <ul className="flex gap-1 overflow-x-auto px-2 pb-3 lg:mt-2 lg:flex-col lg:overflow-visible lg:px-3">
        {LEGATURI.map(({ href, eticheta, Icon }) => {
          // `/admin` s-ar potrivi cu orice subpagină, deci îl comparăm exact.
          const activ =
            href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0 lg:shrink">
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm transition-colors",
                  activ
                    ? "bg-rust-600 text-pe-accent"
                    : "text-steel-500 hover:bg-suprafata hover:text-ink-900",
                )}
              >
                <Icon size={17} aria-hidden />
                {eticheta}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Pe mobil bara e lipită sus, deci cele două acțiuni stau pe un rând,
          ca să nu ocupe înălțime. Pe desktop `mt-auto` le împinge la bază. */}
      <div className="flex gap-1 px-3 pb-3 lg:mt-auto lg:block lg:space-y-1 lg:pb-4 lg:pt-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm text-steel-500 transition-colors hover:bg-suprafata hover:text-ink-900"
        >
          <Store size={17} aria-hidden />
          Vezi magazinul
        </Link>
        <button
          type="button"
          onClick={iesi}
          className="flex w-full items-center gap-2.5 rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm text-steel-500 transition-colors hover:bg-suprafata hover:text-ink-900"
        >
          <LogOut size={17} aria-hidden />
          Ieși din cont
        </button>
      </div>
    </nav>
  );
}
