import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import LegalNotice from "@/components/ui/LegalNotice";
import { site } from "@/data/site";
import { formatPret } from "@/lib/format";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Livrare și retur",
  descriere:
    "Termene și costuri de livrare, transport pentru produse voluminoase, procedura de retur în 14 zile și garanția legală de conformitate.",
  cale: "/livrare-si-retur",
});

const metode = [
  {
    metoda: "Curier standard",
    termen: "24 – 48 h lucrătoare",
    cost: `${formatPret(site.costLivrare)}, gratuit peste ${formatPret(site.livrareGratuitaPeste)}`,
  },
  {
    metoda: "Easybox",
    termen: "24 – 72 h lucrătoare",
    cost: "69 MDL, indisponibil pentru produse voluminoase",
  },
  {
    metoda: "Curier de marfă (produse voluminoase)",
    termen: "5 – 10 zile lucrătoare",
    cost: `${formatPret(site.costLivrareVoluminos)}, cost fix`,
  },
  {
    metoda: "Ridicare personală, Cluj-Napoca",
    termen: "După confirmarea pe e-mail",
    cost: "Gratuit",
  },
];

const claseCelula = "border-b border-chalk-200 py-3 align-top text-ink-700";
const claseAntet =
  "border-b border-steel-300 py-3 text-left font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-500";

export default function PaginaLivrareSiRetur() {
  return (
    <>
      <PageHeader
        eticheta="Informații"
        titlu="Livrare și retur"
        descriere="Termene, costuri și procedura completă de returnare a unui produs."
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <div className="max-w-3xl">
            <section>
              <h2 className="type-h2">Metode și termene</h2>
              <p className="mt-4 text-steel-500">
                Comenzile primite până la ora 14:00, în zilele lucrătoare, pentru
                produse aflate în stoc, pleacă din depozit în aceeași zi. Produsele
                marcate „la comandă” se execută în atelier, cu un termen de 10–15
                zile lucrătoare, comunicat la confirmarea comenzii.
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <caption className="sr-only">
                    Metode de livrare, termene și costuri
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className={claseAntet}>
                        Metodă
                      </th>
                      <th scope="col" className={claseAntet}>
                        Termen
                      </th>
                      <th scope="col" className={claseAntet}>
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {metode.map((rand) => (
                      <tr key={rand.metoda}>
                        <th
                          scope="row"
                          className={`${claseCelula} pr-6 text-left font-medium`}
                        >
                          {rand.metoda}
                        </th>
                        <td className={`${claseCelula} pr-6`}>{rand.termen}</td>
                        <td className={claseCelula}>{rand.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-16">
              <h2 className="type-h2">Produse voluminoase</h2>
              <p className="mt-4 text-steel-500">
                Mesele și celelalte produse marcate ca voluminoase depășesc
                dimensiunile acceptate de curierii obișnuiți. Se expediază pe palet,
                prin curier de marfă, cu un cost fix de{" "}
                {formatPret(site.costLivrareVoluminos)} pe comandă — costul nu se
                înmulțește cu numărul de produse și nu se anulează la depășirea
                pragului de livrare gratuită.
              </p>
              <p className="mt-4 text-steel-500">
                Livrarea se face la adresa stradală, nu la etaj. Verifică coletul în
                prezența curierului și consemnează orice deteriorare a ambalajului în
                documentul de transport, înainte de semnare.
              </p>
            </section>

            <section className="mt-16">
              <h2 className="type-h2">Dreptul de retragere</h2>
              <p className="mt-4 text-steel-500">
                În calitate de consumator, ai dreptul să te retragi din contract în
                termen de {site.zileRetur} zile calendaristice de la data la care
                intri în posesia produsului, fără să invoci vreun motiv și fără
                penalități.
              </p>
              <ol className="mt-6 space-y-4 text-steel-500">
                <li>
                  <strong className="text-ink-700">1. Ne anunți.</strong> Trimiți un
                  e-mail la {site.email} cu numărul comenzii și produsele pe care
                  vrei să le returnezi. O declarație neechivocă este suficientă;
                  poți folosi și formularul de retragere descris mai jos.
                </li>
                <li>
                  <strong className="text-ink-700">2. Primești instrucțiunile.</strong>{" "}
                  Îți răspundem cu adresa de retur și cu detaliile de expediere, în
                  cel mult două zile lucrătoare.
                </li>
                <li>
                  <strong className="text-ink-700">3. Trimiți produsul.</strong>{" "}
                  Returul se expediază în maximum 14 zile de la notificare. Costul
                  returului este suportat de tine, cu excepția cazului în care
                  produsul a fost livrat greșit sau prezintă un defect.
                </li>
                <li>
                  <strong className="text-ink-700">4. Primești banii.</strong>{" "}
                  Restituim suma în maximum 14 zile de la primirea produsului,
                  folosind aceeași metodă de plată, dacă nu convenim altfel.
                </li>
              </ol>
            </section>

            <section className="mt-16">
              <h2 className="type-h2">Formular de retragere</h2>
              <p className="mt-4 text-steel-500">
                Nu este obligatoriu, dar simplifică procesul. Trebuie să conțină:
              </p>
              <ul className="mt-4 space-y-2 text-steel-500">
                <li>— destinatarul: {site.nume}, {site.adresa}, {site.email}</li>
                <li>
                  — declarația: „Prin prezenta notific retragerea mea din contractul
                  de vânzare a următoarelor produse”
                </li>
                <li>— produsele și cantitățile returnate</li>
                <li>— data comenzii și data primirii</li>
                <li>— numele și adresa ta</li>
                <li>— data completării și semnătura, dacă îl trimiți pe hârtie</li>
              </ul>
            </section>

            <section className="mt-16">
              <h2 className="type-h2">Excepții de la retur</h2>
              <p className="mt-4 text-steel-500">
                Creta lichidă și gelul răcoritor pot fi returnate doar sigilate.
                Odată desigilate, dreptul de retragere nu se mai aplică, din motive
                de igienă. Produsele executate la comandă, cu specificații
                personalizate, sunt de asemenea exceptate.
              </p>
              <p className="mt-4 text-steel-500">
                Poți verifica produsul așa cum ai face-o într-un magazin fizic. Ești
                responsabil pentru diminuarea valorii care rezultă din manipulări
                dincolo de ce este necesar pentru a-i determina natura și
                funcționarea.
              </p>
            </section>

            <section className="mt-16">
              <h2 className="type-h2">Garanția legală de conformitate</h2>
              <p className="mt-4 text-steel-500">
                Toate produsele beneficiază de garanția legală de conformitate de 2
                ani de la livrare, conform legislației aplicabile. În cazul unei
                neconformități, ai dreptul la aducerea produsului în conformitate
                prin reparare sau înlocuire și, în condițiile prevăzute de lege, la
                reducerea prețului sau la rezoluțiunea contractului.
              </p>
              <p className="mt-4 text-steel-500">
                Suplimentar, mesele beneficiază de o garanție comercială de
                structură: 36 de luni pentru Titan Pro și 24 de luni pentru Forge
                Club. Garanția comercială nu afectează garanția legală. Uzura
                normală a tapițeriei, a chingilor și a vopselei nu este acoperită.
              </p>
            </section>

            <LegalNotice />
          </div>
        </Container>
      </Section>
    </>
  );
}
