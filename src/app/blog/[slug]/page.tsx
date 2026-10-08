import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Breadcrumbs from "@/components/catalog/Breadcrumbs";
import Button from "@/components/ui/Button";
import { articole, getArticol } from "@/data/articole";
import { formatData } from "@/lib/format";
import { metaPagina } from "@/lib/seo";

export function generateStaticParams() {
  return articole.map((articol) => ({ slug: articol.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const articol = getArticol(slug);
  if (!articol) return {};

  return metaPagina({
    titlu: articol.titlu,
    descriere: articol.rezumat,
    cale: `/blog/${articol.slug}`,
    imagine: articol.imagine,
  });
}

export default async function PaginaArticol(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const articol = getArticol(slug);
  if (!articol) notFound();

  const altele = articole.filter((a) => a.slug !== articol.slug).slice(0, 2);

  return (
    <Section className="pt-8 lg:pt-12">
      <Container>
        <Breadcrumbs
          elemente={[
            { nume: "Acasă", cale: "/" },
            { nume: "Blog", cale: "/blog" },
            { nume: articol.titlu, cale: `/blog/${articol.slug}` },
          ]}
        />

        <article className="mt-8">
          <header className="max-w-3xl">
            <p className="type-eticheta">
              {formatData(articol.dataPublicare)} · {articol.timpCitire} minute de
              citit
            </p>
            <h1 className="type-h1 mt-3">{articol.titlu}</h1>
            <p className="masura mt-5 text-lg text-steel-500">{articol.rezumat}</p>
          </header>

          <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden border border-chalk-200 bg-chalk-100">
            <Image
              src={articol.imagine}
              alt={articol.titlu}
              fill
              priority
              sizes="(max-width: 1240px) 100vw, 1240px"
              className="object-cover"
            />
          </div>

          <div className="mt-12 max-w-3xl">
            {articol.continut.map((bloc, index) => {
              if (bloc.tip === "h2") {
                return (
                  <h2 key={index} className="type-h2 mt-12 first:mt-0">
                    {bloc.text}
                  </h2>
                );
              }
              if (bloc.tip === "lista") {
                return (
                  <ul key={index} className="mt-5 space-y-2 text-steel-500">
                    {bloc.itemi.map((item) => (
                      <li key={item} className="masura">
                        — {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={index} className="masura mt-5 text-steel-500">
                  {bloc.text}
                </p>
              );
            })}
          </div>
        </article>

        {altele.length > 0 ? (
          <section className="mt-16 border-t border-chalk-200 pt-10">
            <h2 className="type-h2">Citește mai departe</h2>
            <ul className="mt-6 space-y-4">
              {altele.map((alt) => (
                <li key={alt.slug}>
                  <Button href={`/blog/${alt.slug}`} varianta="link">
                    {alt.titlu}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </Container>
    </Section>
  );
}
