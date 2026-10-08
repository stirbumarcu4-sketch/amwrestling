import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import WishlistView from "@/components/produs/WishlistView";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Favorite",
  descriere: "Produsele salvate pentru mai târziu, păstrate local în browser.",
  cale: "/favorite",
});

export default function PaginaFavorite() {
  return (
    <>
      <PageHeader
        eticheta="Lista ta"
        titlu="Favorite"
        descriere="Lista este păstrată în browserul tău și nu se sincronizează între dispozitive."
      />
      <Section className="pt-8 lg:pt-12">
        <Container>
          <WishlistView />
        </Container>
      </Section>
    </>
  );
}
