import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { getProdus } from "@/data/produse";
import { formatPret } from "@/lib/format";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Ghid de echipament",
  descriere:
    "Trei pachete de echipament pentru armwrestling: începător, intermediar și club, cu produsele exacte și costul total.",
  cale: "/ghid-echipament",
});

const pachete = [
  {
    nume: "Începător",
    pentru: "Primul an de antrenament, acasă sau în sală",
    descriere:
      "Acoperă traseul de ridicare, priza și protecția încheieturii. Nu cumpăra scripeți până nu ai un punct de ancorare sigur — până atunci, aceste piese sunt suficiente.",
    sluguri: [
      "maner-ciocan-hammer-h2",
      "bandaje-incheietura-60",
      "creta-magneziu-bloc-56g",
      "gripper-reglabil-20-100",
      "rola-masaj-antebrat",
    ],
  },
  {
    nume: "Intermediar",
    pentru: "Setup complet de garaj sau de sală privată",
    descriere:
      "Adaugă sistemul de tracțiune și mânerele care acoperă pronația și cupping-ul. Din acest punct poți lucra toate direcțiile specifice, fără partener.",
    sluguri: [
      "sistem-scripeti-pulley-pro",
      "maner-pronatie-p1",
      "maner-cupping-cup-master",
      "cablu-otel-4mm-3m",
      "wrist-roller-roll-force",
      "bandaje-incheietura-90",
      "cotiera-neopren-5mm",
      "creta-lichida-250ml",
    ],
  },
  {
    nume: "Club",
    pentru: "Sală cu mai mulți sportivi și antrenamente zilnice",
    descriere:
      "Masă, gama completă de mânere și consumabilele care se uzează primele. Include piese de schimb, pentru că într-un club pernele și pinii se schimbă cel mai des.",
    sluguri: [
      "masa-antrenament-forge-club",
      "set-manere-arsenal-kit",
      "sistem-scripeti-pulley-pro",
      "set-perne-cot-grip-pad",
      "set-pini-mana-cromati",
      "husa-protectie-masa",
      "set-3-grippere-fixe",
      "geanta-sport-table-bag-45l",
      "turnbuckle-lant-15m",
      "coarda-agatare-hang-rope",
      "set-benzi-rezistenta-5",
      "placa-ridicare-pinch-plate",
      "bila-forta-grip-ball-7cm",
      "creta-magneziu-bloc-56g",
    ],
  },
];

export default function PaginaGhidEchipament() {
  const pacheteCuProduse = pachete.map((pachet) => {
    const produse = pachet.sluguri
      .map((slug) => getProdus(slug))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);
    return {
      ...pachet,
      produse,
      total: produse.reduce((suma, produs) => suma + produs.pret, 0),
    };
  });

  return (
    <>
      <PageHeader
        eticheta="Ghid"
        titlu="Ce cumperi, în ce ordine"
        descriere="Trei pachete construite din produse reale din catalog. Totalurile sunt calculate la prețul curent, cu TVA inclus."
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <p className="masura text-steel-500">
            Ordinea contează mai mult decât bugetul. Un punct de ancorare solid și
            două mânere bine alese bat un raft plin de accesorii pe care nu ai unde
            să le folosești. Pachetele de mai jos se construiesc unul peste
            celălalt: intermediarul îl presupune pe cel de începător.
          </p>

          <div className="mt-12 space-y-12">
            {pacheteCuProduse.map((pachet) => (
              <article
                key={pachet.nume}
                className="border border-chalk-200 bg-suprafata p-6 lg:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="type-h2">{pachet.nume}</h2>
                    <p className="type-eticheta mt-2">{pachet.pentru}</p>
                  </div>
                  <div className="text-right">
                    <p className="type-eticheta">Total pachet</p>
                    <p className="mt-1 text-2xl font-semibold text-ink-900 tabular">
                      {formatPret(pachet.total)}
                    </p>
                  </div>
                </div>

                <p className="masura mt-5 text-steel-500">{pachet.descriere}</p>

                <ul className="mt-8 divide-y divide-chalk-200 border-y border-chalk-200">
                  {pachet.produse.map((produs) => (
                    <li
                      key={produs.slug}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3"
                    >
                      <Link
                        href={`/produse/${produs.slug}`}
                        className="text-ink-700 underline underline-offset-4 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                      >
                        {produs.nume}
                      </Link>
                      <span className="text-sm text-steel-500 tabular">
                        {formatPret(produs.pret)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Button href="/produse" varianta="ghost">
                    Vezi tot catalogul
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <section className="mt-16">
            <h2 className="type-h2">Ce nu îți trebuie la început</h2>
            <ul className="masura mt-6 space-y-3 text-steel-500">
              <li>
                <strong className="text-ink-700">Masa de competiție.</strong> Costă
                cât restul setupului și nu construiește forță. Are sens abia când
                te antrenezi constant cu un partener.
              </li>
              <li>
                <strong className="text-ink-700">Mânerul rotativ.</strong>{" "}
                Instrument excelent, dar cere o priză deja formată. Într-un an de
                lucru de bază îl vei aprecia mult mai mult.
              </li>
              <li>
                <strong className="text-ink-700">Grippere fixe multiple.</strong> Un
                gripper reglabil acoperă tot progresul dintr-un singur obiect.
              </li>
            </ul>
          </section>
        </Container>
      </Section>
    </>
  );
}
