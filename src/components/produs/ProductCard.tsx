import Image from "next/image";
import Link from "next/link";
import { categorii } from "@/data/categorii";
import { segmenteazaPentruEvidentiere } from "@/lib/utils";
import PriceTag from "@/components/produs/PriceTag";
import StockBadge from "@/components/produs/StockBadge";
import type { Produs } from "@/types";

// Reducerea nu mai apare aici: procentul se afișează lângă preț, în `PriceTag`.
// Colțul rămâne pentru etichetele care nu au alt loc în card.
function etichetaAfisata(produs: Produs): string | null {
  const etichete = produs.etichete ?? [];
  if (etichete.includes("nou")) return "Nou";
  if (etichete.includes("bestseller")) return "Bestseller";
  if (etichete.includes("produs-moldovenesc")) return "Produs moldovenesc";
  return null;
}

export default function ProductCard({
  produs,
  termen,
}: {
  produs: Produs;
  /** Termenul căutat, evidențiat în denumire pe pagina de rezultate. */
  termen?: string;
}) {
  const categorie = categorii.find((c) => c.slug === produs.categorie);
  const eticheta = etichetaAfisata(produs);
  const segmente = termen
    ? segmenteazaPentruEvidentiere(produs.nume, termen)
    : null;

  return (
    <Link
      href={`/produse/${produs.slug}`}
      // `w-full`: linkul este element flex în `<li class="flex">`, deci fără el
      // s-ar lăți după conținut, nu după coloana din grilă — cardurile ieșeau de
      // lățimi diferite, iar imaginea `aspect-square` primea altă înălțime.
      className="group flex h-full w-full flex-col border-2 border-transparent bg-chalk-50 transition-colors duration-200 hover:border-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
    >
      <div className="relative aspect-square overflow-hidden bg-chalk-100">
        <Image
          src={produs.imagini[0]}
          alt={`${produs.nume} — imagine 1`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
        {eticheta ? (
          <span className="absolute left-0 top-0 bg-ink-900 px-2 py-1 font-heading text-[11px] font-semibold uppercase leading-none tracking-[0.08em] text-chalk-50">
            {eticheta}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="type-eticheta">{categorie?.nume}</p>
        <h3 className="type-h3 line-clamp-2 text-base leading-snug text-ink-900">
          {segmente
            ? segmente.map((segment, index) =>
                segment.marcat ? (
                  <mark key={index} className="bg-rust-100 text-ink-900">
                    {segment.text}
                  </mark>
                ) : (
                  <span key={index}>{segment.text}</span>
                ),
              )
            : produs.nume}
        </h3>
        {/* Ierarhie: prețul e cel mai mare (20px), denumirea a doua (16px),
            iar categoria și starea stocului stau amândouă pe 12px. */}
        <div className="mt-auto pt-2">
          <PriceTag pret={produs.pret} pretVechi={produs.pretVechi} dimensiune="md" />
          <StockBadge stoc={produs.stoc} dimensiune="xs" className="mt-2" />
        </div>
      </div>
    </Link>
  );
}
