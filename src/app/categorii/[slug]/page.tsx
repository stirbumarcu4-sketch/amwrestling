import { Suspense } from "react";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Breadcrumbs from "@/components/catalog/Breadcrumbs";
import CatalogView from "@/components/catalog/CatalogView";
import Skeleton from "@/components/ui/Skeleton";
import { categorii } from "@/data/categorii";
import { getProduseDinCategorie } from "@/data/produse";
import { metaPagina } from "@/lib/seo";

export function generateStaticParams() {
  return categorii.map((categorie) => ({ slug: categorie.slug }));
}

export async function generateMetadata(
  props: PageProps<"/categorii/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const categorie = categorii.find((c) => c.slug === slug);
  if (!categorie) return {};

  return metaPagina({
    titlu: categorie.nume,
    descriere: categorie.descriere,
    cale: `/categorii/${categorie.slug}`,
    imagine: categorie.imagine,
  });
}

export default async function PaginaCategorie(
  props: PageProps<"/categorii/[slug]">,
) {
  const { slug } = await props.params;
  const categorie = categorii.find((c) => c.slug === slug);
  if (!categorie) notFound();

  const produseCategorie = getProduseDinCategorie(categorie.slug);

  return (
    <>
      <div className="relative isolate overflow-hidden bg-ink-900">
        <Image
          src={categorie.imagine}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-ink-900/55" />
        <Container className="relative py-16 lg:py-24">
          <p className="type-eticheta text-steel-300">
            {produseCategorie.length}{" "}
            {produseCategorie.length === 1 ? "produs" : "produse"}
          </p>
          <h1 className="type-h1 mt-3 text-chalk-50">{categorie.nume}</h1>
          <p className="masura mt-4 text-chalk-200">{categorie.descriere}</p>
        </Container>
      </div>

      <Section className="pt-8 lg:pt-12">
        <Container>
          <div className="mb-8">
            <Breadcrumbs
              elemente={[
                { nume: "Acasă", cale: "/" },
                { nume: "Categorii", cale: "/categorii" },
                { nume: categorie.nume, cale: `/categorii/${categorie.slug}` },
              ]}
            />
          </div>
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <CatalogView produse={produseCategorie} aratCategorii={false} />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
