import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import LegalNotice from "@/components/ui/LegalNotice";
import { site } from "@/data/site";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Politica de cookies",
  descriere:
    "Ce se stochează în browserul tău pe acest site: doar coșul și favoritele, în localStorage. Fără cookies de analiză sau publicitate.",
  cale: "/politica-cookies",
});

const stocare = [
  {
    cheie: "hp_cart_v1",
    tip: "localStorage",
    scop: "Păstrează produsele din coș între vizite",
    durata: "Până la golirea coșului sau ștergerea datelor din browser",
  },
  {
    cheie: "hp_wishlist_v1",
    tip: "localStorage",
    scop: "Păstrează lista de produse favorite",
    durata: "Până la eliminarea produselor sau ștergerea datelor din browser",
  },
  {
    cheie: "hp_last_order",
    tip: "sessionStorage",
    scop: "Afișează confirmarea după plasarea unei comenzi",
    durata: "Până la închiderea filei de browser",
  },
];

const claseCelula = "border-b border-chalk-200 py-3 align-top text-sm text-ink-700";
const claseAntet =
  "border-b border-steel-300 py-3 text-left font-heading text-xs font-semibold uppercase tracking-[0.08em] text-steel-500";

export default function PaginaCookies() {
  return (
    <>
      <PageHeader
        eticheta="Legal"
        titlu="Politica de cookies"
        descriere="Ce se stochează local, de ce și cum ștergi."
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <div className="max-w-3xl space-y-12 text-steel-500">
            <section>
              <h2 className="type-h2 text-ink-900">Ce sunt cookie-urile</h2>
              <p className="mt-4">
                Cookie-urile sunt fișiere text mici, salvate de site în browserul
                tău, care pot fi citite la vizitele următoare. Tehnologii înrudite —
                `localStorage` și `sessionStorage` — au același rol de a păstra
                informații local, dar nu sunt trimise automat la fiecare cerere
                către server.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">Ce folosim pe acest site</h2>
              <p className="mt-4">
                Acest magazin{" "}
                <strong className="text-ink-700">nu folosește niciun cookie</strong>{" "}
                de analiză, de publicitate sau de urmărire. Nu avem Google
                Analytics, nu avem pixeli de rețele sociale și nu integrăm servicii
                terțe care să te identifice.
              </p>
              <p className="mt-4">
                Singurele date păstrate local sunt cele strict necesare pentru
                funcționarea coșului și a listei de favorite:
              </p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse">
                  <caption className="sr-only">
                    Cheile stocate local, tipul, scopul și durata
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className={claseAntet}>
                        Cheie
                      </th>
                      <th scope="col" className={claseAntet}>
                        Tip
                      </th>
                      <th scope="col" className={claseAntet}>
                        Scop
                      </th>
                      <th scope="col" className={claseAntet}>
                        Durată
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocare.map((rand) => (
                      <tr key={rand.cheie}>
                        <th
                          scope="row"
                          className={`${claseCelula} pr-5 text-left font-medium`}
                        >
                          {rand.cheie}
                        </th>
                        <td className={`${claseCelula} pr-5`}>{rand.tip}</td>
                        <td className={`${claseCelula} pr-5`}>{rand.scop}</td>
                        <td className={claseCelula}>{rand.durata}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6">
                Pentru că nu folosim decât stocare strict necesară funcționării,
                site-ul nu afișează un banner de consimțământ. Dacă adaugi ulterior
                servicii de analiză sau de marketing, bannerul devine obligatoriu.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">Cum ștergi datele</h2>
              <p className="mt-4">
                Poți șterge tot ce a salvat site-ul din setările browserului, de
                obicei din secțiunea de confidențialitate și securitate, prin
                opțiunea de ștergere a datelor de navigare. Alege „Cookie-uri și
                alte date ale site-urilor” pentru domeniul acestui magazin.
              </p>
              <p className="mt-4">
                Ștergerea golește coșul și lista de favorite. Comenzile deja
                plasate nu sunt afectate.
              </p>
            </section>

            <section>
              <h2 className="type-h2 text-ink-900">Contact</h2>
              <p className="mt-4">
                Pentru întrebări despre stocarea locală sau despre prelucrarea
                datelor, scrie la {site.email}. Vezi și{" "}
                <Link
                  href="/politica-de-confidentialitate"
                  className="text-ink-900 underline underline-offset-4"
                >
                  politica de confidențialitate
                </Link>
                .
              </p>
            </section>

            <LegalNotice />
          </div>
        </Container>
      </Section>
    </>
  );
}
