import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { site } from "@/data/site";
import { produse } from "@/data/produse";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Despre noi",
  descriere:
    "Atelier de echipament pentru armwrestling din Cluj-Napoca: cine suntem, cum producem și ce nu promitem.",
  cale: "/despre-noi",
});

const indicatori = [
  { valoare: "2019", eticheta: "Anul înființării" },
  { valoare: String(produse.length), eticheta: "Produse în catalog" },
  { valoare: "4.200", eticheta: "Comenzi livrate" },
  { valoare: "18", eticheta: "Cluburi partenere" },
];

const valori = [
  {
    titlu: "Spunem ce este",
    text: "Descriem produsele prin dimensiuni, materiale și sarcini testate. Nu folosim superlative și nu inventăm omologări pe care nu le avem.",
  },
  {
    titlu: "Construim ca să reziste",
    text: "Preferăm o piesă mai grea și mai scumpă, dar care nu cedează la a treia lună de sală. Sudurile se văd, pentru că nu avem ce ascunde.",
  },
  {
    titlu: "Răspundem după vânzare",
    text: "Piesele de schimb rămân disponibile și după ce un model iese din producție. Perne, pini și cabluri se pot comanda separat, oricând.",
  },
];

const etape = [
  {
    titlu: "Debitare și îndoire",
    text: "Țeava de oțel S235 se debitează la lungime și se îndoaie pe dispozitive proprii, ca geometria să fie identică de la bucată la bucată.",
  },
  {
    titlu: "Sudare",
    text: "Îmbinările se sudează MIG pe șabloane, nu la ochi. Fiecare cadru se verifică pe masa de control înainte să meargă mai departe.",
  },
  {
    titlu: "Sablare și vopsire",
    text: "Piesele se sablează, apoi se vopsesc în câmp electrostatic și se coc în cuptor. Stratul rezistă la cretă și la ștergerea repetată.",
  },
  {
    titlu: "Asamblare și test",
    text: "Mânerele se încarcă la sarcina declarată, mesele se asamblează complet și se dezasamblează pentru ambalare.",
  },
];

export default function PaginaDespreNoi() {
  return (
    <>
      <PageHeader
        eticheta="Despre"
        titlu="Un atelier, nu un depozit"
        descriere="Producem și vindem echipament pentru armwrestling din 2019, dintr-o hală din Cluj-Napoca."
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <div className="masura space-y-5 text-steel-500">
            <p>
              {site.nume} a început dintr-o problemă concretă: în Moldova nu se
              găseau mânere de tracțiune la un preț rezonabil, iar cele importate
              veneau cu transport cât produsul. Primele piese au fost făcute
              pentru o singură sală, în serii de câte zece bucăți.
            </p>
            <p>
              Am rămas la aceeași logică și după ce am ajuns la un catalog de
              câteva zeci de produse. Fiecare piesă pleacă dintr-o nevoie reală de
              antrenament, nu dintr-un studiu de piață. Dacă un produs nu ne
              convinge la testare, nu intră în catalog — și de asta gama noastră
              este mai mică decât a magazinelor care revând.
            </p>
            <p>
              Lucrăm cu cluburi, cu săli private și cu sportivi care își fac
              setupul acasă, în garaj. Aceleași produse, aceleași prețuri, fără
              liste separate. Diferența o fac doar termenele: mesele se execută la
              comandă, restul pleacă din stoc.
            </p>
            <p>
              Ce nu facem: nu avem omologare de federație, nu vindem suplimente și
              nu promitem că un mâner îți crește forța cu un procent anume.
              Echipamentul bun elimină scuze, nu înlocuiește antrenamentul.
            </p>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-chalk-200 py-10 lg:grid-cols-4">
            {indicatori.map((indicator) => (
              <div key={indicator.eticheta}>
                <dt className="type-eticheta">{indicator.eticheta}</dt>
                <dd className="mt-2 font-heading text-3xl font-bold text-ink-900 tabular">
                  {indicator.valoare}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-16">
            <h2 className="type-h2">Ce ne interesează</h2>
            <div className="mt-8 grid gap-10 md:grid-cols-3 md:gap-12">
              {valori.map((valoare) => (
                <div key={valoare.titlu}>
                  <h3 className="type-h3 text-ink-900">{valoare.titlu}</h3>
                  <p className="mt-3 text-steel-500">{valoare.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="type-h2">Cum producem</h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-2">
              {etape.map((etapa, index) => (
                <li
                  key={etapa.titlu}
                  className="border border-chalk-200 bg-suprafata p-6"
                >
                  <p className="type-eticheta">Etapa {index + 1}</p>
                  <h3 className="type-h3 mt-2 text-ink-900">{etapa.titlu}</h3>
                  <p className="mt-3 text-steel-500">{etapa.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-16 flex flex-wrap gap-3">
            <Button href="/produse">Vezi produsele</Button>
            <Button href="/contact" varianta="ghost">
              Scrie-ne
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
