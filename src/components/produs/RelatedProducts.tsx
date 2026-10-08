import ProductGrid from "@/components/produs/ProductGrid";
import { getProduseRecomandate } from "@/data/produse";

export default function RelatedProducts({ slug }: { slug: string }) {
  const recomandate = getProduseRecomandate(slug, 4);
  if (recomandate.length === 0) return null;

  return (
    <section aria-labelledby="produse-similare">
      <h2 id="produse-similare" className="type-h2 mb-6">
        Produse similare
      </h2>
      <ProductGrid produse={recomandate} />
    </section>
  );
}
