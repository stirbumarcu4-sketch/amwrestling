import Link from "next/link";
import { Heart } from "lucide-react";
import Container from "@/components/layout/Container";
import MobileMenu, { type LinkNavigatie } from "@/components/layout/MobileMenu";
import SearchForm from "@/components/layout/SearchForm";
import CartBadge from "@/components/cos/CartBadge";
import { site } from "@/data/site";

const linkuri: LinkNavigatie[] = [
  { href: "/produse", eticheta: "Produse" },
  { href: "/categorii", eticheta: "Categorii" },
  { href: "/ghid-echipament", eticheta: "Ghid echipament" },
  { href: "/blog", eticheta: "Blog" },
  { href: "/contact", eticheta: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-chalk-200 bg-suprafata">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="font-heading text-xl font-bold uppercase tracking-[0.04em] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600 lg:text-2xl"
          >
            {site.nume}
          </Link>

          <nav aria-label="Navigație principală" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {linkuri.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-700 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                  >
                    {link.eticheta}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <SearchForm className="hidden w-56 xl:block" />
            <Link
              href="/favorite"
              aria-label="Favorite"
              className="inline-flex h-10 w-10 items-center justify-center text-ink-700 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
            >
              <Heart size={20} aria-hidden="true" />
            </Link>
            <CartBadge />
            <MobileMenu linkuri={linkuri} />
          </div>
        </div>
      </Container>
    </header>
  );
}
