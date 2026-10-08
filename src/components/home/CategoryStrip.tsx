import Link from "next/link";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import CategoryCard from "@/components/catalog/CategoryCard";
import { categorii } from "@/data/categorii";
import { produse } from "@/data/produse";

export default function CategoryStrip() {
  return (
    <Section>
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="type-h2">Categorii</h2>
          <Link
            href="/categorii"
            className="font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
          >
            Vezi toate
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-6">
          {categorii.map((categorie) => (
            <li key={categorie.slug} className="flex">
              <CategoryCard
                categorie={categorie}
                nrProduse={
                  produse.filter((p) => p.categorie === categorie.slug).length
                }
              />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
