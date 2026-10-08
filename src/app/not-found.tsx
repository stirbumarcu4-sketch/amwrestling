import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";
import ProductGrid from "@/components/produs/ProductGrid";
import { getBestsellers } from "@/data/produse";

export const metadata: Metadata = {
  title: "Pagina nu a fost găsită",
  description: "Adresa accesată nu corespunde niciunei pagini din magazin.",
};

export default function NotFound() {
  const bestsellers = getBestsellers(4);

  return (
    <Section>
      <Container>
        <p className="type-eticheta">Eroare 404</p>
        <h1 className="type-h1 mt-3">Priza a alunecat</h1>
        <p className="masura mt-4 text-steel-500">
          Adresa pe care ai accesat-o nu duce nicăieri. Fie pagina a fost mutată, fie
          linkul conține o greșeală. Poți relua de la catalog sau de la produsele de
          mai jos.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/produse">Vezi produsele</Button>
          <Button href="/" varianta="ghost">
            Mergi la pagina principală
          </Button>
        </div>

        <h2 className="type-h2 mt-16">Cele mai vândute</h2>
        <div className="mt-6">
          <ProductGrid produse={bestsellers} />
        </div>
      </Container>
    </Section>
  );
}
