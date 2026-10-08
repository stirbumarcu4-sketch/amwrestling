import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import CategoryStrip from "@/components/home/CategoryStrip";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ValueProps from "@/components/home/ValueProps";
import VideoAntrenament from "@/components/home/VideoAntrenament";
import TestimonialStrip from "@/components/home/TestimonialStrip";
import NewsletterBlock from "@/components/home/NewsletterBlock";
import { getBestsellers, getNoutati } from "@/data/produse";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <CategoryStrip />
      {/* 8 produse: două rânduri complete de 4 pe ecrane mari, două de 3 plus
          două pe tabletă. Numărul trebuie să rămână multiplu de 4, altfel
          ultimul rând iese incomplet pe desktop. */}
      <FeaturedProducts
        titlu="Cele mai vândute"
        produse={getBestsellers(8)}
        href="/produse?eticheta=bestseller"
        fundal
      />
      <ValueProps />
      {/* Secțiune închisă la mijlocul paginii, unde atenția scade: imaginea în
          mișcare o recaptează, iar fundalul rupe șirul de secțiuni deschise. */}
      <VideoAntrenament />
      <FeaturedProducts
        titlu="Noutăți"
        produse={getNoutati(4)}
        href="/produse?eticheta=nou"
      />
      <TestimonialStrip />
      <NewsletterBlock />
    </>
  );
}
