import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import VideoCuSunet from "@/components/home/VideoCuSunet";

// Clip scurt cu antrenamentul, filmat în sală. Rolul lui e să arate că în
// spatele magazinului stă cineva care practică sportul, nu un depozit.
export default function VideoAntrenament() {
  return (
    <section className="bg-carbon py-12 lg:py-16">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr] lg:gap-14">
          <div className="mx-auto w-full max-w-[260px] lg:mx-0 lg:max-w-[300px]">
            <VideoCuSunet
              src="/video/antrenament-incheietura.mp4"
              poster="/video/antrenament-incheietura.jpg"
              raport="464/848"
              descriere="Antrenament de încheietură la masa de armwrestling, cu mâner prins în cablu"
            />
          </div>

          <div>
            <p className="type-eticheta text-steel-500">Din sală</p>
            <h2 className="type-h2 mt-3 text-ink-900">
              Echipament testat
              <br />
              la masă, nu în catalog
            </h2>
            <p className="masura mt-4 text-steel-500">
              Antrenament de încheietură cu mânerul prins în cablu — exact
              mișcarea care decide un meci. Vindem ce folosim noi la antrenament
              și în competiție, nu ce arată bine într-o poză de produs.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/categorii/manere" varianta="accent" dimensiune="md">
                Vezi mânerele
              </Button>
              <Button
                href="/ghid-echipament"
                varianta="ghost"
                dimensiune="md"
                className="border-chalk-200 text-ink-900 hover:bg-suprafata"
              >
                Cum alegi
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
