import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import LegalNotice from "@/components/ui/LegalNotice";
import { site } from "@/data/site";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Politica de confidențialitate",
  descriere:
    "Cine este operatorul, ce date prelucrăm, în ce scop, pe ce temei legal și ce drepturi ai conform Legii nr. 133/2011.",
  cale: "/politica-de-confidentialitate",
});

const categorii = [
  {
    tip: "Date de identificare și contact",
    exemple: "nume, prenume, e-mail, telefon",
    scop: "Procesarea și livrarea comenzii, comunicarea despre comandă",
    temei: "Executarea contractului",
    durata: "10 ani, conform obligațiilor fiscale",
  },
  {
    tip: "Date de livrare",
    exemple: "raion, localitate, stradă, cod poștal, detalii de acces",
    scop: "Predarea coletului către curier",
    temei: "Executarea contractului",
    durata: "10 ani, conform obligațiilor fiscale",
  },
  {
    tip: "Date de facturare",
    exemple: "date de identificare, date societate dacă se solicită factură",
    scop: "Emiterea facturii și evidența contabilă",
    temei: "Obligație legală",
    durata: "10 ani",
  },
  {
    tip: "Adresă de e-mail pentru newsletter",
    exemple: "adresa de e-mail",
    scop: "Trimiterea anunțurilor despre produse și stocuri",
    temei: "Consimțământ",
    durata: "Până la retragerea consimțământului",
  },
];

const drepturi = [
  "dreptul de acces la datele prelucrate",
  "dreptul la rectificarea datelor inexacte",
  "dreptul la ștergerea datelor, în condițiile prevăzute de lege",
  "dreptul la restricționarea prelucrării",
  "dreptul la portabilitatea datelor",
  "dreptul de a te opune prelucrării",
  "dreptul de a retrage consimțământul, oricând, fără a afecta legalitatea prelucrării anterioare",
  "dreptul de a depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal",
];

const claseCelula = "border-b border-chalk-200 py-3 align-top text-sm text-ink-700";
const claseAntet =
  "border-b border-steel-300 py-3 text-left font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-500";

export default function PaginaConfidentialitate() {
  return (
    <>
      <PageHeader
        eticheta="Legal"
        titlu="Politica de confidențialitate"
        descriere="Cum prelucrăm datele cu caracter personal și ce drepturi ai."
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <div className="max-w-3xl space-y-12 text-steel-500">
            <section>
              <h2 className="type-h2 text-ink-900">Operatorul de date</h2>
              <p className="mt-4">
                {site.nume}, cu sediul în {site.adresa}, IDNO {site.idno}, este
                operatorul datelor cu caracter personal
                colectate prin acest site. Pentru orice solicitare privind datele
                tale, scrie la {site.email}.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">
                Ce date prelucrăm și de ce
              </h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse">
                  <caption className="sr-only">
                    Categoriile de date prelucrate, scopurile, temeiurile legale și
                    duratele de păstrare
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className={claseAntet}>
                        Categorie
                      </th>
                      <th scope="col" className={claseAntet}>
                        Exemple
                      </th>
                      <th scope="col" className={claseAntet}>
                        Scop
                      </th>
                      <th scope="col" className={claseAntet}>
                        Temei legal
                      </th>
                      <th scope="col" className={claseAntet}>
                        Durată
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorii.map((rand) => (
                      <tr key={rand.tip}>
                        <th
                          scope="row"
                          className={`${claseCelula} pr-5 text-left font-medium`}
                        >
                          {rand.tip}
                        </th>
                        <td className={`${claseCelula} pr-5`}>{rand.exemple}</td>
                        <td className={`${claseCelula} pr-5`}>{rand.scop}</td>
                        <td className={`${claseCelula} pr-5`}>{rand.temei}</td>
                        <td className={claseCelula}>{rand.durata}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">Cui transmitem datele</h2>
              <p className="mt-4">
                Transmitem datele strict necesare firmelor de curierat, pentru
                livrare, și furnizorului de servicii contabile, pentru facturare.
                Nu vindem și nu închiriem date către terți. Nu efectuăm transferuri
                de date în afara Spațiului Economic European.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">Stocare în browser</h2>
              <p className="mt-4">
                Coșul de cumpărături și lista de favorite sunt păstrate exclusiv în
                browserul tău, prin `localStorage`. Aceste informații nu ajung pe
                serverele noastre și pot fi șterse oricând din setările browserului.
                Detalii în{" "}
                <Link
                  href="/politica-cookies"
                  className="text-ink-900 underline underline-offset-4"
                >
                  politica de cookies
                </Link>
                .
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">Drepturile tale</h2>
              <p className="mt-4">
                Conform Legii nr. 133/2011 privind protecția datelor cu caracter
                personal, ai următoarele drepturi:
              </p>
              <ul className="mt-4 space-y-2">
                {drepturi.map((drept) => (
                  <li key={drept}>— {drept}</li>
                ))}
              </ul>
              <p className="mt-4">
                Pentru exercitarea oricărui drept, scrie la {site.email}. Răspundem
                în termen de o lună de la primirea cererii.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">Securitate</h2>
              <p className="mt-4">
                Aplicăm măsuri tehnice și organizatorice rezonabile pentru
                protejarea datelor împotriva accesului neautorizat, pierderii sau
                divulgării. Accesul la date este limitat la persoanele care au
                nevoie de ele pentru îndeplinirea atribuțiilor.
              </p>
            </section>

            <LegalNotice />
          </div>
        </Container>
      </Section>
    </>
  );
}
