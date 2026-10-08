import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = {
  ...metaPagina({
    titlu: "Finalizare comandă",
    descriere: "Completează datele de livrare și alege metoda de plată.",
    cale: "/checkout",
  }),
  robots: { index: false, follow: false },
};

export default function PaginaCheckout() {
  return (
    <>
      <PageHeader eticheta="Pasul final" titlu="Finalizare comandă" />
      <Section className="pt-8 lg:pt-12">
        <Container>
          <CheckoutForm />
        </Container>
      </Section>
    </>
  );
}
