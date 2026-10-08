"use client";

// DEMO: nu se procesează plăți reale și nu se trimite nicio comandă.

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import Button from "@/components/ui/Button";
import OrderReview from "@/components/checkout/OrderReview";
import Skeleton from "@/components/ui/Skeleton";
import { site } from "@/data/site";
import { formatPret } from "@/lib/format";
import type { Comanda } from "@/types";

const CHEIE_COMANDA = "hp_last_order";

function esteComanda(valoare: unknown): valoare is Comanda {
  return (
    typeof valoare === "object" &&
    valoare !== null &&
    typeof (valoare as Comanda).numar === "string" &&
    Array.isArray((valoare as Comanda).linii)
  );
}

// Comanda stă în `sessionStorage`, deci este o sursă externă de date. Ca și la
// coș, o citim prin `useSyncExternalStore`: instantaneul de server este gol, iar
// cel real apare după hidratare.
type Instantaneu = { comanda: Comanda | null; gata: boolean };

const INSTANTANEU_SERVER: Instantaneu = { comanda: null, gata: false };

let instantaneu: Instantaneu = INSTANTANEU_SERVER;
const abonati = new Set<() => void>();

function citesteComanda(): Comanda | null {
  try {
    const brut = window.sessionStorage.getItem(CHEIE_COMANDA);
    if (!brut) return null;
    const parsata: unknown = JSON.parse(brut);
    return esteComanda(parsata) ? parsata : null;
  } catch {
    return null;
  }
}

function aboneaza(callback: () => void) {
  instantaneu = { comanda: citesteComanda(), gata: true };
  abonati.add(callback);
  return () => {
    abonati.delete(callback);
  };
}

const iaInstantaneu = () => instantaneu;
const iaInstantaneuServer = () => INSTANTANEU_SERVER;

export default function OrderConfirmation() {
  const router = useRouter();
  const { comanda, gata } = useSyncExternalStore(
    aboneaza,
    iaInstantaneu,
    iaInstantaneuServer,
  );

  useEffect(() => {
    if (gata && !comanda) router.replace("/");
  }, [gata, comanda, router]);

  if (!gata || !comanda) {
    return <Skeleton className="h-96 w-full" />;
  }

  const corpEmail = [
    `Comandă ${comanda.numar}`,
    "",
    ...comanda.linii.map(
      (linie) =>
        `${linie.cantitate} × ${linie.nume}${linie.marime ? ` (${linie.marime})` : ""} — ${formatPret(linie.pretUnitar * linie.cantitate)}`,
    ),
    "",
    `Subtotal: ${formatPret(comanda.subtotal)}`,
    `Livrare: ${comanda.costLivrare === 0 ? "gratuită" : formatPret(comanda.costLivrare)}`,
    `Total: ${formatPret(comanda.total)}`,
    "",
    `Livrare: ${comanda.metodaLivrare}`,
    `Plată: ${comanda.metodaPlata}`,
  ].join("\n");

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `Comandă ${comanda.numar}`,
  )}&body=${encodeURIComponent(corpEmail)}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
      <div>
        <div className="border border-chalk-200 bg-suprafata p-6">
          <p className="type-eticheta">Număr comandă</p>
          <p className="mt-2 font-heading text-3xl font-bold uppercase tracking-[0.02em] text-ink-900 tabular">
            {comanda.numar}
          </p>
          <p className="masura mt-4 text-steel-500">
            Am înregistrat comanda. Notează numărul de mai sus — îl folosești în
            orice discuție despre această comandă.
          </p>
        </div>

        <section className="mt-10">
          <h2 className="type-h2">Ce urmează</h2>
          <ol className="masura mt-4 space-y-3 text-steel-500">
            <li>
              1. Primești un e-mail de confirmare cu detaliile comenzii și cu
              factura proformă.
            </li>
            <li>
              2. Pregătim coletul. Produsele din stoc pleacă în aceeași zi
              lucrătoare dacă am primit comanda până la ora 14:00.
            </li>
            <li>
              3. Curierul te contactează telefonic înainte de livrare, la numărul
              lăsat în formular.
            </li>
            {comanda.metodaPlata === "Transfer bancar" ? (
              <li>
                4. Pentru transferul bancar, îți trimitem IBAN-ul pe e-mail.
                Coletul pleacă după confirmarea plății.
              </li>
            ) : null}
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="type-h2">Datele comenzii</h2>
          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="type-eticheta">Adresă de livrare</dt>
              <dd className="mt-2 text-steel-500">
                {comanda.client.prenume} {comanda.client.nume}
                <br />
                {comanda.client.strada}
                {comanda.client.detalii ? `, ${comanda.client.detalii}` : ""}
                <br />
                {comanda.client.localitate}, r-nul {comanda.client.raion}
                <br />
                {comanda.client.codPostal}
              </dd>
            </div>
            <div>
              <dt className="type-eticheta">Contact</dt>
              <dd className="mt-2 text-steel-500">
                {comanda.client.email}
                <br />
                {comanda.client.telefon}
              </dd>
            </div>
            <div>
              <dt className="type-eticheta">Metodă de livrare</dt>
              <dd className="mt-2 text-steel-500">{comanda.metodaLivrare}</dd>
            </div>
            <div>
              <dt className="type-eticheta">Metodă de plată</dt>
              <dd className="mt-2 text-steel-500">{comanda.metodaPlata}</dd>
            </div>
            {comanda.observatii ? (
              <div className="sm:col-span-2">
                <dt className="type-eticheta">Observații</dt>
                <dd className="mt-2 text-steel-500">{comanda.observatii}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/produse">Înapoi la magazin</Button>
          <Button href={mailto} varianta="ghost">
            Trimite rezumatul pe e-mail
          </Button>
        </div>

        <p className="mt-6 max-w-[60ch] text-sm text-steel-500">
          Magazin demonstrativ: comanda nu a fost trimisă nicăieri și nu s-a
          procesat nicio plată. Rezumatul este păstrat doar în sesiunea curentă a
          browserului.
        </p>
      </div>

      <div>
        <OrderReview
          titlu="Produse comandate"
          linii={comanda.linii}
          subtotal={comanda.subtotal}
          costLivrare={comanda.costLivrare}
          total={comanda.total}
        />
      </div>
    </div>
  );
}
