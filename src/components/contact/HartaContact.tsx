// Embed Google Maps direct (fără cheie API), cu adresa exactă a USEFS —
// str. Andrei Doga 22, Chișinău — astfel încât Google să plaseze singur
// marcajul pe clădirea corectă, în loc să depindem de coordonate aproximate.
const ADRESA_USEFS =
  "Universitatea de Stat de Educație Fizică și Sport, Strada Andrei Doga 22, Chișinău, Moldova";

export default function HartaContact() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-chalk-200 bg-chalk-100">
      <iframe
        title="Harta USEFS — Universitatea de Stat de Educație Fizică și Sport, Chișinău"
        src={`https://www.google.com/maps?q=${encodeURIComponent(ADRESA_USEFS)}&z=17&output=embed`}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
