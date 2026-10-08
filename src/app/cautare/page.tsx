import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import ProductGrid from "@/components/produs/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { produse } from "@/data/produse";
import { cauta } from "@/lib/filters";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Căutare",
  descriere: "Caută în catalogul de echipament pentru armwrestling.",
  cale: "/cautare",
});

export default async function PaginaCautare(props: PageProps<"/cautare">) {
  const parametri = await props.searchParams;
  const brut = parametri.q;
  const termen = (Array.isArray(brut) ? brut[0] : brut ?? "").trim();
  const rezultate = termen ? cauta(produse, termen) : [];

  return (
    <>
      <PageHeader
        eticheta="Căutare"
        titlu={termen ? `Rezultate pentru „${termen}”` : "Căutare"}
        descriere={
          termen
            ? `${rezultate.length} ${rezultate.length === 1 ? "produs găsit" : "produse găsite"}.`
            : "Scrie un termen în câmpul de căutare din antet."
        }
      />
      <Section className="pt-8 lg:pt-12">
        <Container>
          {!termen ? (
            <EmptyState
              titlu="Niciun termen căutat"
              descriere="Folosește câmpul de căutare din antet pentru a găsi un produs după denumire sau după cod."
              actiune={<Button href="/produse">Vezi tot catalogul</Button>}
            />
          ) : rezultate.length === 0 ? (
            <EmptyState
              titlu="Niciun rezultat"
              descriere={`Nu am găsit produse pentru „${termen}”. Încearcă un termen mai scurt sau caută după categorie.`}
              actiune={<Button href="/categorii">Vezi categoriile</Button>}
            />
          ) : (
            <ProductGrid produse={rezultate} termen={termen} />
          )}
        </Container>
      </Section>
    </>
  );
}
