import { site } from "@/data/site";
import { formatPret } from "@/lib/format";

export default function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const prag = site.livrareGratuitaPeste;
  const atins = subtotal >= prag;
  const procent = Math.min(100, Math.round((subtotal / prag) * 100));

  return (
    <div className="border border-chalk-200 bg-suprafata p-4">
      <p className="text-sm text-ink-700">
        {atins
          ? "Livrare gratuită aplicată."
          : `Mai ai ${formatPret(prag - subtotal)} până la livrarea gratuită.`}
      </p>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={procent}
        aria-label="Progres către livrarea gratuită"
        className="mt-3 h-1.5 w-full bg-chalk-200"
      >
        <div
          className={atins ? "h-full bg-moss-600" : "h-full bg-ink-900"}
          style={{ width: `${procent}%` }}
        />
      </div>
    </div>
  );
}
