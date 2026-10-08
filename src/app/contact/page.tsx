import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/contact/ContactForm";
import HartaContact from "@/components/contact/HartaContact";
import { site } from "@/data/site";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Contact",
  descriere:
    "Date de contact, program și formular pentru întrebări despre produse, comenzi sau oferte pentru cluburi.",
  cale: "/contact",
});

export default function PaginaContact() {
  return (
    <>
      <PageHeader
        eticheta="Contact"
        titlu="Scrie-ne"
        descriere="Răspundem în maximum două zile lucrătoare. Pentru întrebări tehnice, spune-ne ce spațiu ai și la ce nivel te antrenezi."
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            <div>
              <h2 className="type-h2 mb-8">Formular</h2>
              <ContactForm />
            </div>

            <div>
              <h2 className="type-h2 mb-8">Date de contact</h2>

              <dl className="space-y-6 text-sm">
                <div>
                  <dt className="type-eticheta">E-mail</dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${site.email}`}
                      className="text-ink-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="type-eticheta">Telefon</dt>
                  <dd className="mt-2">
                    <a
                      href={`tel:${site.telefon.replace(/\s/g, "")}`}
                      className="text-ink-700 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                    >
                      {site.telefon}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="type-eticheta">Adresă</dt>
                  <dd className="mt-2 text-steel-500">{site.adresa}</dd>
                </div>
                <div>
                  <dt className="type-eticheta">Program</dt>
                  <dd className="mt-2 text-steel-500">{site.program}</dd>
                </div>
                <div>
                  <dt className="type-eticheta">Date firmă</dt>
                  <dd className="mt-2 text-steel-500">
                    {site.nume}
                    <br />
                    IDNO {site.idno}
                  </dd>
                </div>
              </dl>

              <figure className="mt-10">
                <HartaContact />
                <figcaption className="mt-3 text-sm text-steel-500">
                  Locația USEFS - Universitatea de Educație Fizică și Sport din
                  Chișinău. Ridicarea comenzilor se confirmă pe e-mail.
                </figcaption>
              </figure>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
