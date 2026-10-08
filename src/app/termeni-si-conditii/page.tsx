import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import LegalNotice from "@/components/ui/LegalNotice";
import { site } from "@/data/site";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Termeni și condiții",
  descriere:
    "Condițiile de utilizare a magazinului, procedura de comandă, prețuri, livrare, drept de retragere, garanții și soluționarea litigiilor.",
  cale: "/termeni-si-conditii",
});

export default function PaginaTermeni() {
  return (
    <>
      <PageHeader
        eticheta="Legal"
        titlu="Termeni și condiții"
        descriere="Se aplică tuturor comenzilor plasate prin acest magazin."
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <div className="max-w-3xl space-y-12 text-steel-500">
            <section>
              <h2 className="type-h2 text-ink-900">1. Identificarea vânzătorului</h2>
              <p className="mt-4">
                Magazinul este operat de {site.nume}, cu sediul social în{" "}
                {site.adresa}, înregistrată la Agenția Servicii Publice a
                Republicii Moldova sub numărul de identificare de stat IDNO{" "}
                {site.idno}. Contact: {site.email}, {site.telefon}. Program:{" "}
                {site.program}.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">2. Obiectul contractului</h2>
              <p className="mt-4">
                Prezentele condiții reglementează vânzarea de echipament sportiv
                prin intermediul acestui site către persoane fizice și juridice.
                Plasarea unei comenzi presupune acceptarea integrală a acestor
                condiții, în versiunea publicată la momentul comenzii.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">3. Comanda</h2>
              <p className="mt-4">
                Comanda se plasează prin completarea formularului de finalizare.
                Contractul se consideră încheiat la momentul confirmării comenzii de
                către vânzător, prin e-mail. Vânzătorul își rezervă dreptul de a
                anula o comandă dacă produsul nu mai este disponibil sau dacă
                prețul afișat a fost eronat, cu informarea și restituirea integrală
                a oricărei sume încasate.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">4. Prețuri</h2>
              <p className="mt-4">
                Toate prețurile sunt exprimate în lei moldovenești (MDL) și includ TVA. Costul de
                livrare este afișat separat, înainte de confirmarea comenzii.
                Prețurile pot fi modificate oricând, fără notificare prealabilă,
                modificarea neafectând comenzile deja confirmate.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">5. Plata</h2>
              <p className="mt-4">
                Metodele de plată disponibile sunt plata ramburs la curier și
                transferul bancar. Pentru transferul bancar, produsele se expediază
                după confirmarea încasării. Factura se emite pentru fiecare comandă
                și se transmite pe e-mail.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">6. Livrarea</h2>
              <p className="mt-4">
                Livrarea se face pe teritoriul Republicii Moldova, prin curier. Termenele și
                costurile sunt detaliate în pagina{" "}
                <Link
                  href="/livrare-si-retur"
                  className="text-ink-900 underline underline-offset-4"
                >
                  Livrare și retur
                </Link>
                . Riscul pierderii sau deteriorării produselor se transferă
                cumpărătorului la momentul intrării în posesia fizică a acestora.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">7. Dreptul de retragere</h2>
              <p className="mt-4">
                Consumatorul are dreptul de a se retrage din contract în termen de{" "}
                {site.zileRetur} zile calendaristice de la primirea produsului, fără
                a motiva decizia. Procedura completă, excepțiile aplicabile și
                formularul de retragere sunt descrise în pagina Livrare și retur.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">8. Garanții</h2>
              <p className="mt-4">
                Produsele beneficiază de garanția legală de conformitate de 2 ani.
                Anumite produse beneficiază suplimentar de o garanție comercială,
                menționată în pagina fiecărui produs. Garanția comercială nu
                limitează și nu înlocuiește garanția legală.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">9. Răspundere</h2>
              <p className="mt-4">
                Echipamentul se folosește pe propria răspundere, respectând
                instrucțiunile de montaj și limitele de sarcină indicate. Vânzătorul
                nu răspunde pentru accidentări rezultate din montaj incorect,
                depășirea sarcinii declarate, modificarea produsului sau utilizarea
                într-un alt scop decât cel pentru care a fost proiectat.
              </p>
              <p className="mt-4">
                Informațiile despre antrenament publicate pe site au caracter
                general și nu constituie sfat medical. Consultă un medic înainte de
                a începe un program de antrenament.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">10. Proprietate intelectuală</h2>
              <p className="mt-4">
                Conținutul site-ului — texte, imagini, elemente grafice — aparține
                vânzătorului sau este folosit cu acordul titularilor de drepturi.
                Reproducerea fără acord scris este interzisă.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">
                11. Soluționarea litigiilor
              </h2>
              <p className="mt-4">
                Orice reclamație se transmite mai întâi pe {site.email}. Încercăm să
                rezolvăm situația direct, în cel mai scurt timp posibil.
              </p>
              <p className="mt-4">
                Dacă nu ajungem la o soluție, te poți adresa Agenției pentru
                Protecția Consumatorilor și Supravegherea Pieței sau poți recurge
                la mediere, conform Legii nr. 137/2015 cu privire la mediere:
              </p>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="https://consumator.gov.md/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-900 underline underline-offset-4"
                  >
                    Agenția pentru Protecția Consumatorilor și Supravegherea
                    Pieței — consumator.gov.md
                  </a>
                </li>
              </ul>
              <p className="mt-4">
                Republica Moldova nu este stat membru al Uniunii Europene, deci
                platforma europeană de soluționare online a litigiilor (SOL/ODR)
                și rețeaua Centrelor Europene ale Consumatorilor nu se aplică
                acestor comenzi.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">12. Legea aplicabilă</h2>
              <p className="mt-4">
                Contractul este guvernat de legislația Republicii Moldova, în
                special Legea nr. 105/2003 privind protecția consumatorilor și
                Legea nr. 284/2004 privind comerțul electronic. Litigiile
                nesoluționate pe
                cale amiabilă sunt de competența instanțelor judecătorești din Republica Moldova.
              </p>
            </section>

            <LegalNotice />
          </div>
        </Container>
      </Section>
    </>
  );
}
