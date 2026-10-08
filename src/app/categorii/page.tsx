import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/catalog/Breadcrumbs";
import CategoryCard from "@/components/catalog/CategoryCard";
import { categorii } from "@/data/categorii";
import { produse } from "@/data/produse";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Categorii",
  descriere:
    "Cele șase categorii de echipament: mese, mânere, tracțiune și forță, protecție, îmbrăcăminte și recuperare.",
  cale: "/categorii",
});

export default function PaginaCategorii() {
  return (
    <>
      <PageHeader
        eticheta="Catalog"
        titlu="Categorii"
        descriere="Alege direcția de lucru și vezi doar echipamentul care o servește."
      />
      <Section className="pt-8 lg:pt-12">
        <Container>
          <div className="mb-8">
            <Breadcrumbs
              elemente={[
                { nume: "Acasă", cale: "/" },
                { nume: "Categorii", cale: "/categorii" },
              ]}
            />
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categorii.map((categorie) => (
              <li key={categorie.slug} className="flex">
                <CategoryCard
                  categorie={categorie}
                  descriere
                  nrProduse={
                    produse.filter((p) => p.categorie === categorie.slug).length
                  }
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
