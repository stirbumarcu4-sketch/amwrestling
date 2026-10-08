import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import Accordion from "@/components/ui/Accordion";
import Button from "@/components/ui/Button";
import { categoriiFaq, faq } from "@/data/faq";
import { jsonLdFaq, metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Întrebări frecvente",
  descriere:
    "Răspunsuri despre comenzi, livrare, retur, garanție, echipament și facturare.",
  cale: "/intrebari-frecvente",
});

export default function PaginaIntrebariFrecvente() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq(faq)) }}
      />

      <PageHeader
        eticheta="Ajutor"
        titlu="Întrebări frecvente"
        descriere={`${faq.length} răspunsuri, grupate pe patru teme. Dacă nu găsești ce cauți, scrie-ne.`}
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <div className="max-w-3xl space-y-16">
            {categoriiFaq.map((categorie) => {
              const intrebari = faq.filter((i) => i.categorie === categorie);
              return (
                <section key={categorie}>
                  <h2 className="type-h2 mb-6">{categorie}</h2>
                  <Accordion
                    elemente={intrebari.map((i) => ({
                      titlu: i.intrebare,
                      continut: i.raspuns,
                    }))}
                  />
                </section>
              );
            })}
          </div>

          <div className="mt-16">
            <h2 className="type-h2">Nu ai găsit răspunsul</h2>
            <p className="masura mt-4 text-steel-500">
              Scrie-ne și îți răspundem în maximum două zile lucrătoare. Pentru
              întrebări tehnice, menționează spațiul pe care îl ai și nivelul la
              care te antrenezi.
            </p>
            <div className="mt-6">
              <Button href="/contact">Mergi la contact</Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
