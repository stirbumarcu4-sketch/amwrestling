import Link from "next/link";
import { Factory, MessageCircle, Ruler } from "lucide-react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import { site } from "@/data/site";

// Cifrele de mai jos sunt aceleași cu cele din fișele produselor (`produse.ts`).
// Dacă se schimbă acolo, trebuie schimbate și aici — sunt afirmații publice.
const valori = [
  {
    titlu: "Construcție",
    icon: Factory,
    text: "Cadre din oțel S235, sudate MIG și vopsite în câmp electrostatic. Nu punem tablă subțire pe piese care preiau sarcină și nu ascundem îmbinări nituite sub vopsea.",
    date: [
      { eticheta: "Oțel", valoare: "S235" },
      { eticheta: "Țeavă cadru", valoare: "60 × 40 × 2 mm" },
      { eticheta: "Finisaj", valoare: "Pulbere, negru mat" },
      { eticheta: "Test la sarcină", valoare: "Fiecare mâner" },
    ],
    link: { href: "/despre-noi", eticheta: "Despre atelier" },
  },
  {
    titlu: "Cote",
    icon: Ruler,
    text: "Mesele respectă dimensiunile din regulamentul internațional de armwrestling. Aceleași cote se regăsesc, verificabil, în fișa tehnică a fiecărui produs.",
    date: [
      { eticheta: "Înălțime blat", valoare: "104 cm" },
      { eticheta: "Perne de cot", valoare: "15 × 15 cm" },
      { eticheta: "Distanță pini", valoare: "41 cm" },
      { eticheta: "Garanție structură", valoare: "36 luni" },
    ],
    link: { href: "/ghid-echipament", eticheta: "Ghid de echipament" },
  },
  {
    titlu: "Suport tehnic",
    icon: MessageCircle,
    text: "Răspundem la întrebări despre montaj, ancorare și alegerea mânerelor. Scrie-ne cu spațiul pe care îl ai și cu nivelul la care ești, iar noi îți spunem ce merită cumpărat și ce nu.",
    date: [
      { eticheta: "Timp de răspuns", valoare: "2 zile lucrătoare" },
      { eticheta: "Canale", valoare: "E-mail, telefon" },
      { eticheta: "Retur", valoare: `${site.zileRetur} zile` },
      { eticheta: "Garanție legală", valoare: "2 ani" },
    ],
    link: { href: "/contact", eticheta: "Scrie-ne" },
  },
];

export default function ValueProps() {
  return (
    <Section className="border-y border-chalk-200 bg-suprafata">
      <Container>
        <div className="max-w-2xl">
          <p className="type-eticheta">Cum lucrăm</p>
          <h2 className="type-h2 mt-3 text-ink-900">
            Trei lucruri pe care le poți verifica
          </h2>
          <p className="masura mt-4 text-steel-500">
            Nu scriem „calitate premium”. Spunem din ce e făcut, la ce cote și ce
            se întâmplă după ce ai cumpărat — cu cifre pe care le poți compara cu
            fișa fiecărui produs.
          </p>
        </div>

        {/* `gap-px` peste un fundal chalk-200 dă linii de o rețea de un pixel
            între carduri, în loc de chenare duble care s-ar suprapune. */}
        <ul className="mt-12 grid gap-px border border-chalk-200 bg-chalk-200 md:grid-cols-3">
          {valori.map((valoare, index) => {
            const Pictograma = valoare.icon;
            return (
              <li key={valoare.titlu} className="flex bg-suprafata">
                <article className="flex w-full flex-col p-6 lg:p-8">
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="font-heading text-3xl font-bold leading-none text-chalk-200 tabular"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Pictograma
                      size={22}
                      aria-hidden="true"
                      className="text-rust-600"
                    />
                  </div>

                  <h3 className="type-h3 mt-6 text-ink-900">{valoare.titlu}</h3>
                  <p className="mt-3 text-sm text-steel-500">{valoare.text}</p>

                  <dl className="mt-6 border-t border-chalk-200">
                    {valoare.date.map((rand) => (
                      <div
                        key={rand.eticheta}
                        className="flex items-baseline justify-between gap-4 border-b border-chalk-200 py-2.5 text-sm last:border-b-0"
                      >
                        <dt className="text-steel-500">{rand.eticheta}</dt>
                        <dd className="text-right font-medium text-ink-900 tabular">
                          {rand.valoare}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <Link
                    href={valoare.link.href}
                    className="mt-auto pt-6 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900 underline underline-offset-4 decoration-steel-300 hover:decoration-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                  >
                    {valoare.link.eticheta}
                  </Link>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Precizarea era înghesuită la coada paragrafului „Cote". Scoasă
            separat, se citește ca o rezervă asumată, nu ca o notă de subsol. */}
        <p className="masura mt-8 border-l-2 border-rust-600 pl-4 text-sm text-steel-500">
          <strong className="font-semibold text-ink-900">Precizare:</strong>{" "}
          cotele de mai sus sunt cote de construcție, nu o omologare de
          federație. Diferența contează dacă mergi la competiție oficială, așa că
          o spunem explicit în loc să lăsăm impresia că avem o certificare pe
          care nu o avem.
        </p>
      </Container>
    </Section>
  );
}
