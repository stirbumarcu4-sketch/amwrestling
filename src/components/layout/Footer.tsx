import Container from "@/components/layout/Container";
import FooterColumn, { type LinkFooter } from "@/components/layout/FooterColumn";
import { site } from "@/data/site";

const magazin: LinkFooter[] = [
  { href: "/produse", eticheta: "Toate produsele" },
  { href: "/categorii", eticheta: "Categorii" },
  { href: "/ghid-echipament", eticheta: "Ghid echipament" },
  { href: "/favorite", eticheta: "Favorite" },
];

const informatii: LinkFooter[] = [
  { href: "/despre-noi", eticheta: "Despre noi" },
  { href: "/blog", eticheta: "Blog" },
  { href: "/termeni-si-conditii", eticheta: "Termeni și condiții" },
  { href: "/politica-de-confidentialitate", eticheta: "Politica de confidențialitate" },
  { href: "/politica-cookies", eticheta: "Politica cookies" },
];

const ajutor: LinkFooter[] = [
  { href: "/intrebari-frecvente", eticheta: "Întrebări frecvente" },
  { href: "/livrare-si-retur", eticheta: "Livrare și retur" },
  { href: "/ghid-marimi", eticheta: "Ghid de mărimi" },
  { href: "/contact", eticheta: "Contact" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-carbon text-ink-900">
      <Container>
        <div className="grid gap-2 py-12 md:grid-cols-4 md:gap-10 md:py-16">
          <FooterColumn titlu="Magazin" linkuri={magazin} />
          <FooterColumn titlu="Informații" linkuri={informatii} />
          <FooterColumn titlu="Ajutor" linkuri={ajutor} />

          <div className="py-4 md:py-0">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-[0.08em] text-ink-900">
              Contact
            </h2>
            <address className="mt-4 space-y-3 text-sm not-italic text-steel-500 md:mt-5">
              <p>{site.adresa}</p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                >
                  {site.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${site.telefon.replace(/\s/g, "")}`}
                  className="hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                >
                  {site.telefon}
                </a>
              </p>
              <p>{site.program}</p>
            </address>

            {/* DECIZIE: linkuri text în loc de iconuri de brand — lucide-react 1.x
                a eliminat iconurile de marcă, iar textul se potrivește oricum cu
                registrul sobru al paginii. */}
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              {(
                [
                  ["Instagram", site.social.instagram],
                  ["Facebook", site.social.facebook],
                  ["YouTube", site.social.youtube],
                ] as const
              ).map(([eticheta, url]) => (
                <li key={eticheta}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-steel-500 underline underline-offset-4 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                  >
                    {eticheta}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-chalk-200 py-8 text-sm text-steel-500">
          <p className="font-semibold text-ink-900">{site.nume}</p>
          <p className="mt-2">
            IDNO {site.idno} · Sediu social: {site.adresa}
          </p>
          <p className="mt-2">Toate prețurile afișate includ TVA.</p>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <a
                href="https://consumator.gov.md/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
              >
                Protecția consumatorilor (APCSP)
              </a>
            </li>
            <li>
              <a
                href="https://datepersonale.md/"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
              >
                Protecția datelor (CNPDCP)
              </a>
            </li>
          </ul>

          <p className="mt-6 text-steel-500">
            © {new Date().getFullYear()} {site.nume}. Magazin demonstrativ, construit
            fără procesare de plăți și fără gestiune reală de stoc.
          </p>
        </div>
      </Container>
    </footer>
  );
}
