import Container from "@/components/layout/Container";
import { site } from "@/data/site";
import { formatPret } from "@/lib/format";

export default function AnnouncementBar() {
  return (
    <div className="bg-carbon text-ink-900">
      <Container>
        <p className="py-2 text-center text-[13px] leading-tight">
          Livrare gratuită la comenzi peste{" "}
          {formatPret(site.livrareGratuitaPeste)}
          <span className="mx-2 text-steel-500">·</span>
          Retur în {site.zileRetur} zile
        </p>
      </Container>
    </div>
  );
}
