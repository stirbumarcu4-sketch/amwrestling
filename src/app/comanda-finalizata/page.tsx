import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import OrderConfirmation from "@/components/checkout/OrderConfirmation";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = {
  ...metaPagina({
    titlu: "Comandă finalizată",
    descriere: "Confirmarea comenzii și pașii următori.",
    cale: "/comanda-finalizata",
  }),
  robots: { index: false, follow: false },
};

export default function PaginaComandaFinalizata() {
  return (
    <>
      <PageHeader eticheta="Confirmare" titlu="Comanda a fost înregistrată" />
      <Section className="pt-8 lg:pt-12">
        <Container>
          <OrderConfirmation />
        </Container>
      </Section>
    </>
  );
}
