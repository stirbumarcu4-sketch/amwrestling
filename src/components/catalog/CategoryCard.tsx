import Image from "next/image";
import Link from "next/link";
import type { Categorie } from "@/types";

export default function CategoryCard({
  categorie,
  nrProduse,
  descriere = false,
}: {
  categorie: Categorie;
  nrProduse: number;
  descriere?: boolean;
}) {
  return (
    <Link
      href={`/categorii/${categorie.slug}`}
      // `w-full` este obligatoriu: linkul este element flex în `<li class="flex">`,
      // deci fără el s-ar lăți după conținut, nu după coloana din grilă. Numele
      // lungi dădeau carduri late, cele scurte carduri înguste, iar imaginea
      // fiind `aspect-[3/2]` primea altă înălțime în fiecare card.
      className="group flex h-full w-full flex-col border border-chalk-200 bg-suprafata transition-colors duration-200 hover:border-steel-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-chalk-100">
        <Image
          src={categorie.imagine}
          alt={`Categoria ${categorie.nume}`}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="type-h3 text-lg text-ink-900">{categorie.nume}</h3>
        {descriere ? (
          <p className="text-sm text-steel-500">{categorie.descriere}</p>
        ) : null}
        <p className="mt-auto pt-2 text-sm text-steel-500 tabular">
          {nrProduse} {nrProduse === 1 ? "produs" : "produse"}
        </p>
      </div>
    </Link>
  );
}
