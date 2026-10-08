import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import PageHeader from "@/components/ui/PageHeader";
import { articole } from "@/data/articole";
import { formatData } from "@/lib/format";
import { metaPagina } from "@/lib/seo";

export const metadata: Metadata = metaPagina({
  titlu: "Blog",
  descriere:
    "Articole despre setup, tehnică, prevenirea accidentărilor și consumabile în armwrestling.",
  cale: "/blog",
});

export default function PaginaBlog() {
  return (
    <>
      <PageHeader
        eticheta="Blog"
        titlu="Ce scriem"
        descriere="Texte despre echipament și antrenament, scrise din practică, nu din broșuri."
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <ul className="grid gap-8 md:grid-cols-2">
            {articole.map((articol) => (
              <li key={articol.slug} className="flex">
                <article className="flex h-full flex-col border border-chalk-200 bg-suprafata">
                  <Link
                    href={`/blog/${articol.slug}`}
                    className="group flex h-full flex-col focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-chalk-100">
                      <Image
                        src={articol.imagine}
                        alt={articol.titlu}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="type-eticheta">
                        {formatData(articol.dataPublicare)} · {articol.timpCitire}{" "}
                        min
                      </p>
                      <h2 className="type-h3 mt-3 text-ink-900">{articol.titlu}</h2>
                      <p className="mt-3 text-steel-500">{articol.rezumat}</p>
                      <span className="mt-auto pt-5 font-heading text-sm font-semibold uppercase tracking-[0.06em] text-ink-900 underline underline-offset-4">
                        Citește articolul
                      </span>
                    </div>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
