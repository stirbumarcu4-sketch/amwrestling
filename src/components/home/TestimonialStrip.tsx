import Link from "next/link";
import { Quote } from "lucide-react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Rating from "@/components/ui/Rating";
import { produse } from "@/data/produse";

// Atribuiri generice, fără nume de persoane: sunt exemple de conținut, nu
// testimoniale reale. Fiecare citat trimite la produsul despre care vorbește,
// ca vizitatorul să poată trece direct de la impresie la fișa tehnică.
const citate = [
  {
    text: "Mânerul de pronație a schimbat complet felul în care lucrez presiunea laterală. Este singura piesă pe care o iau cu mine la fiecare antrenament.",
    sursa: "Sportiv legitimat",
    detaliu: "Categoria 90 kg",
    initiale: "SL",
    nota: 5,
    slug: "maner-pronatie-p1",
  },
  {
    text: "Am montat masa în sala clubului acum un an. Se lucrează pe ea zilnic, de la juniori până la seniori, și nu are joc în cadru.",
    sursa: "Antrenor",
    detaliu: "Club de armwrestling",
    initiale: "AC",
    nota: 5,
    slug: "masa-antrenament-forge-club",
  },
  {
    text: "Sistemul de scripeți a fost prima achiziție serioasă pentru garaj. Reglajul pe verticală acoperă toate unghiurile de care aveam nevoie.",
    sursa: "Sportiv amator",
    detaliu: "Al doilea an de antrenament",
    initiale: "SA",
    nota: 4,
    slug: "sistem-scripeti-pulley-pro",
  },
];

/** Media notelor din catalog, ponderată cu numărul de evaluări al fiecărui produs. */
function mediaCatalog() {
  const cuNota = produse.filter((p) => p.rating && p.nrRecenzii);
  const recenzii = cuNota.reduce((s, p) => s + (p.nrRecenzii ?? 0), 0);
  const suma = cuNota.reduce((s, p) => s + (p.rating ?? 0) * (p.nrRecenzii ?? 0), 0);
  return { medie: Math.round((suma / recenzii) * 10) / 10, recenzii };
}

export default function TestimonialStrip() {
  const { medie, recenzii } = mediaCatalog();

  return (
    <Section className="border-y border-chalk-200 bg-suprafata">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="type-eticheta">Feedback</p>
            <h2 className="type-h2 mt-3 text-ink-900">Ce spun sportivii</h2>
          </div>
          {/* Media reală din catalog, nu o cifră decorativă. */}
          <div className="shrink-0 md:text-right">
            <Rating valoare={medie} className="md:justify-end" />
            <p className="mt-1 text-sm text-steel-500">
              media pe{" "}
              <span className="tabular">{recenzii.toLocaleString("ro-MD")}</span>{" "}
              evaluări de produs
            </p>
          </div>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {citate.map((citat) => {
            const produs = produse.find((p) => p.slug === citat.slug);
            return (
              <li key={citat.sursa} className="flex">
                <figure className="flex w-full flex-col border border-chalk-200 bg-chalk-50 p-6">
                  <div className="flex items-center justify-between">
                    <Quote
                      size={26}
                      aria-hidden="true"
                      className="fill-chalk-200 text-chalk-200"
                    />
                    <Rating valoare={citat.nota} />
                  </div>

                  <blockquote className="mt-5 grow">
                    <p className="text-ink-700">{citat.text}</p>
                  </blockquote>

                  <figcaption className="mt-6 border-t border-chalk-200 pt-4">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900 font-heading text-xs font-bold tracking-[0.06em] text-chalk-50"
                      >
                        {citat.initiale}
                      </span>
                      <span>
                        <span className="block font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900">
                          {citat.sursa}
                        </span>
                        <span className="block text-sm text-steel-500">
                          {citat.detaliu}
                        </span>
                      </span>
                    </div>

                    {produs ? (
                      <Link
                        href={`/produse/${produs.slug}`}
                        className="mt-4 block text-sm text-steel-500 underline underline-offset-4 decoration-steel-300 hover:text-ink-900 hover:decoration-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                      >
                        Despre {produs.nume}
                      </Link>
                    ) : null}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-sm text-steel-500">
          Exemple de conținut, urmează să fie înlocuite cu testimoniale reale.
        </p>
      </Container>
    </Section>
  );
}
