import { Suspense } from "react";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import Breadcrumbs from "@/components/catalog/Breadcrumbs";
import CatalogView from "@/components/catalog/CatalogView";
import Skeleton from "@/components/ui/Skeleton";
import { produse } from "@/data/produse";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Toate produsele",
  descriere:
    "Catalogul complet: mese, mânere de tracțiune, grippere, protecții, textile și produse de recuperare pentru armwrestling.",
  cale: "/produse",
});

export default function PaginaProduse() {
  return (
    <>
      <PageHeader
        eticheta={`${produse.length} produse în catalog`}
        titlu="Toate produsele"
        descriere="Echipament pentru antrenamentul specific de braț, de la mânere de tracțiune până la mese la cote de competiție."
      />
      <Section className="pt-8 lg:pt-12">
        <Container>
          <div className="mb-8">
            <Breadcrumbs
              elemente={[
                { nume: "Acasă", cale: "/" },
                { nume: "Produse", cale: "/produse" },
              ]}
            />
          </div>
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <CatalogView produse={produse} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
