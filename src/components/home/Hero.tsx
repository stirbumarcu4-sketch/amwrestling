import Image from "next/image";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="bg-azur-100">
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-scale {
          animation: fadeInScale 0.8s ease-out forwards;
        }
        .animate-fade-scale-1 {
          animation: fadeInScale 0.8s ease-out 0.1s forwards;
          opacity: 0;
        }
        .animate-fade-scale-2 {
          animation: fadeInScale 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
      <Container>
        <div className="grid items-center gap-8 py-10 lg:min-h-[min(100svh_-_6rem,820px)] lg:grid-cols-2 lg:gap-14 lg:py-12 xl:grid-cols-[1fr_1.35fr]">
          <div className="animate-fade-scale-1">
            <p className="type-eticheta">Echipament de armwrestling</p>
            <h1 className="type-display mt-3 font-black text-ink-900 lg:text-7xl">
              ARMARCU
              <br />
              SHOP
            </h1>
            <p className="masura mt-4 text-steel-500 lg:mt-6">
              Mese la cote de competiție, mânere de tracțiune și protecții,
              construite pentru sportivi care încarcă serios. Livrare în toată
              Moldova.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-8">
              <Button
                href="/produse"
                varianta="accent"
                dimensiune="md"
                className="lg:h-13 lg:px-8 lg:text-base"
              >
                Vezi produsele
              </Button>
              <Button
                href="/ghid-echipament"
                varianta="ghost"
                dimensiune="md"
                className="lg:h-13 lg:px-8 lg:text-base"
              >
                Ghid pentru începători
              </Button>
            </div>
          </div>

          <div className="animate-fade-scale-2 relative aspect-square max-h-[40svh] w-full overflow-hidden border border-azur-200 bg-azur-100 sm:max-h-[48svh] lg:-my-12 lg:aspect-auto lg:max-h-none lg:self-stretch">
            <Image
              src="/masa-armwrestling.webp"
              alt="Masă de armwrestling cu blat roșu și negru, acoperită de cretă, cu perne de cot, pini de mână și chingă. Pe blat este imprimat emblema ARMARCU."
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
