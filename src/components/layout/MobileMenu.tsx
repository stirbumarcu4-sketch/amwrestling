"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Menu, X } from "lucide-react";
import SearchForm from "@/components/layout/SearchForm";

export type LinkNavigatie = { href: string; eticheta: string };

const SELECTOR_FOCUSABIL =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function MobileMenu({ linkuri }: { linkuri: LinkNavigatie[] }) {
  const [deschis, setDeschis] = useState(false);
  const panou = useRef<HTMLDivElement>(null);
  const declansator = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!deschis) return;

    const stilAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const primul = panou.current?.querySelector<HTMLElement>(SELECTOR_FOCUSABIL);
    primul?.focus();

    return () => {
      document.body.style.overflow = stilAnterior;
    };
  }, [deschis]);

  function inchide() {
    setDeschis(false);
    declansator.current?.focus();
  }

  function laTasta(eveniment: KeyboardEvent<HTMLDivElement>) {
    if (eveniment.key === "Escape") {
      eveniment.preventDefault();
      inchide();
      return;
    }
    if (eveniment.key !== "Tab") return;

    const focusabile = Array.from(
      panou.current?.querySelectorAll<HTMLElement>(SELECTOR_FOCUSABIL) ?? [],
    );
    if (focusabile.length === 0) return;

    const primul = focusabile[0];
    const ultimul = focusabile[focusabile.length - 1];

    if (eveniment.shiftKey && document.activeElement === primul) {
      eveniment.preventDefault();
      ultimul.focus();
    } else if (!eveniment.shiftKey && document.activeElement === ultimul) {
      eveniment.preventDefault();
      primul.focus();
    }
  }

  return (
    <>
      <button
        ref={declansator}
        type="button"
        onClick={() => setDeschis(true)}
        aria-expanded={deschis}
        aria-controls="meniu-mobil"
        aria-label="Deschide meniul"
        className="inline-flex h-10 w-10 items-center justify-center text-ink-700 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600 lg:hidden"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {deschis ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Închide meniul"
            onClick={inchide}
            className="absolute inset-0 h-full w-full bg-ink-950/50"
          />
          <div
            ref={panou}
            id="meniu-mobil"
            role="dialog"
            aria-modal="true"
            aria-label="Meniu principal"
            onKeyDown={laTasta}
            className="absolute right-0 top-0 flex h-full w-[86%] max-w-[360px] flex-col bg-suprafata shadow-[var(--shadow-pop)]"
          >
            <div className="flex items-center justify-between border-b border-chalk-200 px-5 py-4">
              <span className="font-heading text-lg font-bold uppercase tracking-[0.04em] text-ink-900">
                Meniu
              </span>
              <button
                type="button"
                onClick={inchide}
                aria-label="Închide meniul"
                className="inline-flex h-10 w-10 items-center justify-center text-ink-700 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="border-b border-chalk-200 px-5 py-4">
              <SearchForm laCautare={inchide} />
            </div>

            <nav aria-label="Navigație principală" className="flex-1 overflow-y-auto px-5 py-2">
              <ul>
                {linkuri.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={inchide}
                      className="block border-b border-chalk-200 py-4 font-heading text-lg font-semibold uppercase tracking-[0.04em] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                    >
                      {link.eticheta}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/favorite"
                    onClick={inchide}
                    className="block border-b border-chalk-200 py-4 font-heading text-lg font-semibold uppercase tracking-[0.04em] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                  >
                    Favorite
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cos"
                    onClick={inchide}
                    className="block py-4 font-heading text-lg font-semibold uppercase tracking-[0.04em] text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                  >
                    Coș
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
