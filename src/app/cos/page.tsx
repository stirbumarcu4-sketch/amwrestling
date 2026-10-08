import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import CartView from "@/components/cos/CartView";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Coș",
  descriere: "Produsele adăugate în coș și costul estimat de livrare.",
  cale: "/cos",
});

export default function PaginaCos() {
  return (
    <>
      <PageHeader eticheta="Comandă" titlu="Coșul tău" />
      <Section className="pt-8 lg:pt-12">
        <Container>
          <CartView />
        </Container>
      </Section>
    </>
  );
}
