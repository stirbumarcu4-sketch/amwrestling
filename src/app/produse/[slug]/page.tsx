import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Package, RotateCcw, Truck, Wallet } from "lucide-react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Breadcrumbs from "@/components/catalog/Breadcrumbs";
import ProductGallery from "@/components/produs/ProductGallery";
import ProductTabs from "@/components/produs/ProductTabs";
import RelatedProducts from "@/components/produs/RelatedProducts";
import PriceTag from "@/components/produs/PriceTag";
import StockBadge from "@/components/produs/StockBadge";
import WishlistButton from "@/components/produs/WishlistButton";
import AddToCartButton from "@/components/cos/AddToCartButton";
import Rating from "@/components/ui/Rating";
import { categorii } from "@/data/categorii";
import { produse, getProdus } from "@/data/produse";
import { site } from "@/data/site";
import { jsonLdBreadcrumb, jsonLdProdus, metaPagina } from "@/lib/seo";

export function generateStaticParams() {
  return produse.map((produs) => ({ slug: produs.slug }));
}

export async function generateMetadata(
  props: PageProps<"/produse/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const produs = getProdus(slug);
  if (!produs) return {};

  return metaPagina({
    titlu: produs.nume,
    descriere: produs.descriereScurta,
    cale: `/produse/${produs.slug}`,
    imagine: produs.imagini[0],
  });
}

export default async function PaginaProdus(props: PageProps<"/produse/[slug]">) {
  const { slug } = await props.params;
  const produs = getProdus(slug);
  if (!produs) notFound();

  const categorie = categorii.find((c) => c.slug === produs.categorie);

  const firimituri = [
    { nume: "Acasă", cale: "/" },
    { nume: "Produse", cale: "/produse" },
    ...(categorie
      ? [{ nume: categorie.nume, cale: `/categorii/${categorie.slug}` }]
      : []),
    { nume: produs.nume, cale: `/produse/${produs.slug}` },
  ];

  const detalii = [
    {
      icon: Truck,
      text: produs.voluminos
        ? `Livrare prin curier de marfă, ${site.costLivrareVoluminos} MDL`
        : `Livrare în 24–48 h, ${site.costLivrare} MDL`,
    },
    { icon: RotateCcw, text: `Retur în ${site.zileRetur} zile` },
    { icon: Wallet, text: "Plata ramburs la curier" },
    { icon: Package, text: `Cod produs: ${produs.sku}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProdus(produs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdBreadcrumb(firimituri)),
        }}
      />

      <Section className="pt-8 lg:pt-12">
        <Container>
          <Breadcrumbs elemente={firimituri} />

          <div className="mt-8 grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
            <ProductGallery imagini={produs.imagini} nume={produs.nume} />

            <div>
              <p className="type-eticheta">{categorie?.nume}</p>
              <h1 className="type-h1 mt-3">{produs.nume}</h1>

              {typeof produs.rating === "number" ? (
                <div className="mt-4">
                  <Rating valoare={produs.rating} nrRecenzii={produs.nrRecenzii} />
                  <p className="mt-2 text-sm text-steel-500">
                    Evaluările afișate sunt conținut demonstrativ și vor fi
                    înlocuite cu recenzii reale ale clienților.
                  </p>
                </div>
              ) : null}

              <div className="mt-6">
                <PriceTag
                  pret={produs.pret}
                  pretVechi={produs.pretVechi}
                  dimensiune="lg"
                />
                <p className="mt-1 text-sm text-steel-500">TVA inclus</p>
              </div>

              <p className="masura mt-6 text-steel-500">{produs.descriereScurta}</p>

              <div className="mt-6">
                <StockBadge stoc={produs.stoc} />
              </div>

              <div className="mt-8">
                <AddToCartButton produs={produs} />
              </div>

              <div className="mt-4">
                <WishlistButton slug={produs.slug} className="w-full" />
              </div>

              {produs.voluminos ? (
                <div className="mt-8 border border-chalk-200 bg-chalk-100 p-4">
                  <p className="type-eticheta text-ink-700">Produs voluminos</p>
                  <p className="mt-2 text-sm text-steel-500">
                    Livrare prin curier de marfă, cost {site.costLivrareVoluminos}{" "}
                    MDL, termen 5–10 zile lucrătoare.
                  </p>
                </div>
              ) : null}

              {produs.personalizat ? (
                <div className="mt-8 border border-chalk-200 bg-chalk-100 p-4">
                  <p className="type-eticheta text-ink-700">Produs personalizat</p>
                  <p className="mt-2 text-sm text-steel-500">
                    Se execută după specificațiile tale, pe care ni le trimiți pe{" "}
                    {site.email} sau le scrii în câmpul de observații de la
                    finalizarea comenzii. Fiind personalizat, este exceptat de la
                    dreptul de retragere în {site.zileRetur} zile.
                  </p>
                </div>
              ) : null}

              <ul className="mt-8 divide-y divide-chalk-200 border-y border-chalk-200">
                {detalii.map((detaliu) => (
                  <li
                    key={detaliu.text}
                    className="flex items-center gap-3 py-3 text-sm text-steel-500"
                  >
                    <detaliu.icon
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-steel-400"
                    />
                    {detaliu.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-16">
            <ProductTabs produs={produs} />
          </div>

          <div className="mt-16">
            <RelatedProducts slug={produs.slug} />
          </div>
        </Container>
      </Section>
    </>
  );
}
