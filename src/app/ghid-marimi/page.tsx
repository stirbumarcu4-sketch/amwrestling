import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Ghid de mărimi",
  descriere:
    "Tabele de mărimi pentru tricouri, hanorace și cotiere, plus instrucțiuni de măsurare.",
  cale: "/ghid-marimi",
});

const textile = [
  { marime: "S", piept: "48", lungime: "70", umeri: "44" },
  { marime: "M", piept: "51", lungime: "72", umeri: "46" },
  { marime: "L", piept: "54", lungime: "74", umeri: "48" },
  { marime: "XL", piept: "57", lungime: "76", umeri: "51" },
  { marime: "XXL", piept: "61", lungime: "78", umeri: "54" },
  { marime: "3XL", piept: "65", lungime: "80", umeri: "57" },
];

const cotiere = [
  { marime: "S", circumferinta: "26 – 29" },
  { marime: "M", circumferinta: "29 – 32" },
  { marime: "L", circumferinta: "32 – 36" },
  { marime: "XL", circumferinta: "36 – 40" },
  { marime: "XXL", circumferinta: "40 – 45" },
];

const claseCelula = "border-b border-chalk-200 py-3 text-ink-700 tabular";
const claseAntet =
  "border-b border-steel-300 py-3 text-left font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-500";

export default function PaginaGhidMarimi() {
  return (
    <>
      <PageHeader
        eticheta="Ghid"
        titlu="Ghid de mărimi"
        descriere="Măsurile sunt exprimate în centimetri și se referă la produs, nu la corp. Toleranța de croială este de ±2 cm."
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <section>
            <h2 className="type-h2">Tricouri și hanorace</h2>
            <p className="masura mt-3 text-steel-500">
              Croiala este dreaptă. Dacă ești între două mărimi și ai umerii lați,
              alege mărimea mai mare.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <caption className="sr-only">
                  Dimensiuni pentru tricouri și hanorace, în centimetri
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className={claseAntet}>
                      Mărime
                    </th>
                    <th scope="col" className={claseAntet}>
                      Lățime piept
                    </th>
                    <th scope="col" className={claseAntet}>
                      Lungime
                    </th>
                    <th scope="col" className={claseAntet}>
                      Lățime umeri
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {textile.map((rand) => (
                    <tr key={rand.marime}>
                      <th
                        scope="row"
                        className={`${claseCelula} text-left font-semibold`}
                      >
                        {rand.marime}
                      </th>
                      <td className={claseCelula}>{rand.piept}</td>
                      <td className={claseCelula}>{rand.lungime}</td>
                      <td className={claseCelula}>{rand.umeri}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="type-h2">Cotiere</h2>
            <p className="masura mt-3 text-steel-500">
              Mărimea se alege după circumferința brațului, măsurată la mijlocul
              bicepsului, cu brațul relaxat.
            </p>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[320px] max-w-lg border-collapse text-sm">
                <caption className="sr-only">
                  Circumferința brațului pentru fiecare mărime de cotieră
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className={claseAntet}>
                      Mărime
                    </th>
                    <th scope="col" className={claseAntet}>
                      Circumferință braț (cm)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cotiere.map((rand) => (
                    <tr key={rand.marime}>
                      <th
                        scope="row"
                        className={`${claseCelula} text-left font-semibold`}
                      >
                        {rand.marime}
                      </th>
                      <td className={claseCelula}>{rand.circumferinta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-16">
            <h2 className="type-h2">Cum măsori corect</h2>
            <ol className="masura mt-6 space-y-4 text-steel-500">
              <li>
                <strong className="text-ink-700">Lățimea pieptului.</strong> Întinde
                pe masă un tricou care îți vine bine, cu fața în sus, și măsoară de
                la o cusătură laterală la cealaltă, la 2 cm sub subraț.
              </li>
              <li>
                <strong className="text-ink-700">Lungimea.</strong> Măsoară pe
                verticală, de la punctul cel mai de sus al umărului până la tiv.
              </li>
              <li>
                <strong className="text-ink-700">Lățimea umerilor.</strong> Măsoară
                pe spate, de la o cusătură de mânecă la cealaltă.
              </li>
              <li>
                <strong className="text-ink-700">Circumferința brațului.</strong>{" "}
                Înfășoară banda în jurul bicepsului, la mijlocul distanței dintre
                umăr și cot, fără să strângi.
              </li>
            </ol>
            <p className="masura mt-6 text-steel-500">
              Dacă rezultatul cade exact între două rânduri din tabel, alege
              mărimea mai mare pentru hanorac și mărimea mai mică pentru cotieră —
              cotiera trebuie să comprime, hanoracul nu.
            </p>
          </section>
        </Container>
      </Section>
    </>
  );
}
