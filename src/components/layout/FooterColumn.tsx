"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type LinkFooter = { href: string; eticheta: string; extern?: boolean };

export default function FooterColumn({
  titlu,
  linkuri,
}: {
  titlu: string;
  linkuri: LinkFooter[];
}) {
  const id = useId();
  const [deschis, setDeschis] = useState(false);

  return (
    <div className="border-b border-ink-800 py-4 md:border-0 md:py-0">
      <button
        type="button"
        onClick={() => setDeschis((v) => !v)}
        aria-expanded={deschis}
        aria-controls={id}
        className="flex w-full items-center justify-between font-heading text-sm font-semibold uppercase tracking-[0.08em] text-chalk-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600 md:hidden"
      >
        {titlu}
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={cn("transition-transform", deschis && "rotate-180")}
        />
      </button>

      <h2 className="hidden font-heading text-sm font-semibold uppercase tracking-[0.08em] text-chalk-50 md:block">
        {titlu}
      </h2>

      <ul
        id={id}
        className={cn("mt-4 space-y-3 md:mt-5 md:block", deschis ? "block" : "hidden")}
      >
        {linkuri.map((link) => (
          <li key={link.href}>
            {link.extern ? (
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-steel-400 hover:text-chalk-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
              >
                {link.eticheta}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-sm text-steel-400 hover:text-chalk-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
              >
                {link.eticheta}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
