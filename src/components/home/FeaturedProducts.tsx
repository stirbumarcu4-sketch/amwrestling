import Link from "next/link";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import ProductGrid from "@/components/produs/ProductGrid";
import type { Produs } from "@/types";

export default function FeaturedProducts({
  titlu,
  produse,
  href,
  etichetaLink = "Vezi toate",
  fundal = false,
}: {
  titlu: string;
  produse: Produs[];
  href: string;
  etichetaLink?: string;
  fundal?: boolean;
}) {
  return (
    <Section className={fundal ? "bg-chalk-100" : undefined}>
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="type-h2">{titlu}</h2>
          <Link
            href={href}
            className="font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
          >
            {etichetaLink}
          </Link>
        </div>
        <ProductGrid produse={produse} />
      </Container>
    </Section>
  );
}
