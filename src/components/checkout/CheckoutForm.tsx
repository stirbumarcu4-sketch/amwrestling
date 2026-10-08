"use client";

// DEMO: nu se procesează plăți reale și nu se trimite nicio comandă.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import OrderReview from "@/components/checkout/OrderReview";
import { raioane } from "@/data/raioane";
import { produse } from "@/data/produse";
import { site } from "@/data/site";
import { useCos } from "@/lib/cart-context";
import { formatPret } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Comanda } from "@/types";

const CHEIE_COMANDA = "hp_last_order";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Republica Moldova: numărul naţional are 8 cifre, scris fie cu prefixul de ţară
// (+373 69 123 456), fie cu 0 în faţă la apel intern (069 123 456). Mobilele
// încep cu 6 sau 7, fixele cu 2.
const REGEX_TELEFON = /^(\+373|0)[267]\d{7}$/;
// Codurile poștale moldovenești au 4 cifre și se scriu de obicei „MD-2001".
const REGEX_COD_POSTAL = /^(MD-?)?\d{4}$/i;

type CampuriText =
  | "nume"
  | "prenume"
  | "email"
  | "telefon"
  | "raion"
  | "localitate"
  | "strada"
  | "codPostal";

type Formular = Record<CampuriText, string> & {
  detalii: string;
  observatii: string;
  metodaLivrare: "curier" | "easybox" | "ridicare";
  metodaPlata: "ramburs" | "transfer";
  acceptTermeni: boolean;
  newsletter: boolean;
};

const initial: Formular = {
  nume: "",
  prenume: "",
  email: "",
  telefon: "",
  raion: "",
  localitate: "",
  strada: "",
  codPostal: "",
  detalii: "",
  observatii: "",
  metodaLivrare: "curier",
  metodaPlata: "ramburs",
  acceptTermeni: false,
  newsletter: false,
};

type Erori = Partial<Record<CampuriText | "acceptTermeni", string>>;

function valideazaCamp(camp: CampuriText, valoare: string): string | undefined {
  const curatat = valoare.trim();
  if (!curatat) return "Câmpul este obligatoriu.";

  if (camp === "email" && !REGEX_EMAIL.test(curatat)) {
    return "Introdu o adresă de e-mail validă.";
  }
  if (camp === "telefon" && !REGEX_TELEFON.test(curatat.replace(/[\s.-]/g, ""))) {
    return "Introdu un număr de telefon moldovenesc, ex. 069123456.";
  }
  if (camp === "codPostal" && !REGEX_COD_POSTAL.test(curatat)) {
    return "Codul poștal are 4 cifre, ex. MD-2001.";
  }
  return undefined;
}

function genereazaNumarComanda(): string {
  const acum = new Date();
  const an = acum.getFullYear();
  const luna = String(acum.getMonth() + 1).padStart(2, "0");
  const zi = String(acum.getDate()).padStart(2, "0");
  const aleator = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return `HP-${an}${luna}${zi}-${aleator}`;
}

export default function CheckoutForm() {
  const router = useRouter();
  const { linii, subtotal, costLivrare, gata, goleste } = useCos();
  const [formular, setFormular] = useState<Formular>(initial);
  const [erori, setErori] = useState<Erori>({});
  const referintaFormular = useRef<HTMLFormElement>(null);

  const rezumat = useMemo(
    () =>
      linii
        .map((linie) => {
          const produs = produse.find((p) => p.slug === linie.slug);
          if (!produs) return null;
          return {
            slug: produs.slug,
            nume: produs.nume,
            cantitate: linie.cantitate,
            marime: linie.marime,
            pretUnitar: produs.pret,
          };
        })
        .filter((l): l is NonNullable<typeof l> => l !== null),
    [linii],
  );

  const areVoluminos = useMemo(
    () =>
      linii.some(
        (linie) => produse.find((p) => p.slug === linie.slug)?.voluminos === true,
      ),
    [linii],
  );

  const pesteprag = subtotal >= site.livrareGratuitaPeste;

  const metodeLivrare = [
    {
      valoare: "curier" as const,
      eticheta: "Curier 24–48 h",
      cost: costLivrare,
      indisponibila: false,
      nota: areVoluminos ? "Curier de marfă, pentru produse voluminoase" : undefined,
    },
    {
      valoare: "easybox" as const,
      eticheta: "Easybox",
      cost: pesteprag ? 0 : 17.99,
      indisponibila: areVoluminos,
      nota: areVoluminos
        ? "Indisponibil pentru produse voluminoase"
        : undefined,
    },
    {
      valoare: "ridicare" as const,
      eticheta: "Ridicare personală, Cluj-Napoca",
      cost: 0,
      indisponibila: false,
      nota: site.program,
    },
  ];

  const costAles =
    metodeLivrare.find((m) => m.valoare === formular.metodaLivrare)?.cost ?? 0;
  const totalAles = subtotal + costAles;

  function seteaza<C extends keyof Formular>(camp: C, valoare: Formular[C]) {
    setFormular((precedent) => ({ ...precedent, [camp]: valoare }));
  }

  function laIesireDinCamp(camp: CampuriText) {
    setErori((precedente) => ({
      ...precedente,
      [camp]: valideazaCamp(camp, formular[camp]),
    }));
  }

  async function trimite(eveniment: FormEvent<HTMLFormElement>) {
    eveniment.preventDefault();

    const campuri: CampuriText[] = [
      "nume",
      "prenume",
      "email",
      "telefon",
      "raion",
      "localitate",
      "strada",
      "codPostal",
    ];

    const noi: Erori = {};
    for (const camp of campuri) {
      const eroare = valideazaCamp(camp, formular[camp]);
      if (eroare) noi[camp] = eroare;
    }
    if (!formular.acceptTermeni) {
      noi.acceptTermeni = "Trebuie să accepți termenii și condițiile.";
    }

    setErori(noi);

    const primulInvalid = [...campuri, "acceptTermeni"].find((c) => c in noi);
    if (primulInvalid) {
      const element = referintaFormular.current?.querySelector<HTMLElement>(
        `[name="${primulInvalid}"]`,
      );
      element?.focus();
      return;
    }

    const comanda: Comanda = {
      numar: genereazaNumarComanda(),
      data: new Date().toISOString(),
      linii: rezumat,
      subtotal,
      costLivrare: costAles,
      total: totalAles,
      client: {
        nume: formular.nume.trim(),
        prenume: formular.prenume.trim(),
        email: formular.email.trim(),
        telefon: formular.telefon.trim(),
        raion: formular.raion,
        localitate: formular.localitate.trim(),
        strada: formular.strada.trim(),
        codPostal: formular.codPostal.trim(),
        detalii: formular.detalii.trim() || undefined,
      },
      metodaLivrare:
        metodeLivrare.find((m) => m.valoare === formular.metodaLivrare)?.eticheta ??
        "Curier",
      metodaPlata:
        formular.metodaPlata === "ramburs"
          ? "Ramburs la curier"
          : "Transfer bancar",
      observatii: formular.observatii.trim() || undefined,
    };

    try {
      window.sessionStorage.setItem(CHEIE_COMANDA, JSON.stringify(comanda));
    } catch {
      // Dacă sessionStorage este blocat, pagina de confirmare va redirecționa.
    }

    // Depune comanda și pe server, ca să apară în panoul de administrare.
    // Serverul recalculează prețurile din catalog, deci corpul trimis aici e
    // doar o propunere. O eroare de rețea nu blochează confirmarea: clientul a
    // completat formularul, iar comanda rămâne în sessionStorage.
    try {
      await fetch("/api/comenzi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comanda),
      });
    } catch {
      // Comanda rămâne vizibilă clientului; administrarea nu o va vedea.
    }

    goleste();
    router.push("/comanda-finalizata");
  }

  if (!gata) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (linii.length === 0) {
    return (
      <EmptyState
        titlu="Coșul este gol"
        descriere="Nu poți finaliza o comandă fără produse în coș."
        actiune={<Button href="/produse">Vezi produsele</Button>}
      />
    );
  }

  return (
    <form
      ref={referintaFormular}
      onSubmit={trimite}
      noValidate
      className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12"
    >
      <div className="space-y-12">
        <fieldset>
          <legend className="type-h3 mb-6 text-lg">1. Date de contact</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              eticheta="Nume"
              name="nume"
              autoComplete="family-name"
              required
              value={formular.nume}
              onChange={(e) => seteaza("nume", e.target.value)}
              onBlur={() => laIesireDinCamp("nume")}
              eroare={erori.nume}
            />
            <Input
              eticheta="Prenume"
              name="prenume"
              autoComplete="given-name"
              required
              value={formular.prenume}
              onChange={(e) => seteaza("prenume", e.target.value)}
              onBlur={() => laIesireDinCamp("prenume")}
              eroare={erori.prenume}
            />
            <Input
              eticheta="E-mail"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formular.email}
              onChange={(e) => seteaza("email", e.target.value)}
              onBlur={() => laIesireDinCamp("email")}
              eroare={erori.email}
            />
            <Input
              eticheta="Telefon"
              name="telefon"
              type="tel"
              autoComplete="tel"
              required
              ajutor="Format: 07XXXXXXXX"
              value={formular.telefon}
              onChange={(e) => seteaza("telefon", e.target.value)}
              onBlur={() => laIesireDinCamp("telefon")}
              eroare={erori.telefon}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="type-h3 mb-6 text-lg">2. Adresă de livrare</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              eticheta="Raion"
              name="raion"
              required
              value={formular.raion}
              onChange={(e) => seteaza("raion", e.target.value)}
              onBlur={() => laIesireDinCamp("raion")}
              eroare={erori.raion}
            >
              <option value="">Alege raionul</option>
              {raioane.map((raion) => (
                <option key={raion.cod} value={raion.nume}>
                  {raion.nume}
                </option>
              ))}
            </Select>
            <Input
              eticheta="Localitate"
              name="localitate"
              autoComplete="address-level2"
              required
              value={formular.localitate}
              onChange={(e) => seteaza("localitate", e.target.value)}
              onBlur={() => laIesireDinCamp("localitate")}
              eroare={erori.localitate}
            />
            <Input
              eticheta="Stradă și număr"
              name="strada"
              autoComplete="street-address"
              required
              className="sm:col-span-2"
              value={formular.strada}
              onChange={(e) => seteaza("strada", e.target.value)}
              onBlur={() => laIesireDinCamp("strada")}
              eroare={erori.strada}
            />
            <Input
              eticheta="Cod poștal"
              name="codPostal"
              inputMode="numeric"
              autoComplete="postal-code"
              required
              value={formular.codPostal}
              onChange={(e) => seteaza("codPostal", e.target.value)}
              onBlur={() => laIesireDinCamp("codPostal")}
              eroare={erori.codPostal}
            />
            <Input
              eticheta="Alte detalii (bloc, scară, etaj)"
              name="detalii"
              value={formular.detalii}
              onChange={(e) => seteaza("detalii", e.target.value)}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="type-h3 mb-6 text-lg">3. Metodă de livrare</legend>
          <ul className="space-y-3">
            {metodeLivrare.map((metoda) => (
              <li key={metoda.valoare}>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 border p-4 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-rust-600",
                    metoda.indisponibila && "cursor-not-allowed opacity-45",
                    formular.metodaLivrare === metoda.valoare && !metoda.indisponibila
                      ? "border-ink-900"
                      : "border-steel-300",
                  )}
                >
                  <input
                    type="radio"
                    name="metodaLivrare"
                    value={metoda.valoare}
                    disabled={metoda.indisponibila}
                    checked={formular.metodaLivrare === metoda.valoare}
                    onChange={() => seteaza("metodaLivrare", metoda.valoare)}
                    className="mt-1 h-4 w-4 accent-rust-600"
                  />
                  <span className="flex-1">
                    <span className="block text-ink-700">{metoda.eticheta}</span>
                    {metoda.nota ? (
                      <span className="mt-0.5 block text-sm text-steel-500">
                        {metoda.nota}
                      </span>
                    ) : null}
                  </span>
                  <span className="font-medium text-ink-700 tabular">
                    {metoda.cost === 0 ? "Gratuit" : formatPret(metoda.cost)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset>
          <legend className="type-h3 mb-6 text-lg">4. Metodă de plată</legend>
          <ul className="space-y-3">
            <li>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 border p-4 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-rust-600",
                  formular.metodaPlata === "ramburs"
                    ? "border-ink-900"
                    : "border-steel-300",
                )}
              >
                <input
                  type="radio"
                  name="metodaPlata"
                  value="ramburs"
                  checked={formular.metodaPlata === "ramburs"}
                  onChange={() => seteaza("metodaPlata", "ramburs")}
                  className="mt-1 h-4 w-4 accent-rust-600"
                />
                <span className="flex-1">
                  <span className="block text-ink-700">Ramburs la curier</span>
                  <span className="mt-0.5 block text-sm text-steel-500">
                    Plătești în numerar sau cu cardul, la livrare.
                  </span>
                </span>
              </label>
            </li>
            <li>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 border p-4 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-rust-600",
                  formular.metodaPlata === "transfer"
                    ? "border-ink-900"
                    : "border-steel-300",
                )}
              >
                <input
                  type="radio"
                  name="metodaPlata"
                  value="transfer"
                  checked={formular.metodaPlata === "transfer"}
                  onChange={() => seteaza("metodaPlata", "transfer")}
                  className="mt-1 h-4 w-4 accent-rust-600"
                />
                <span className="flex-1">
                  <span className="block text-ink-700">Transfer bancar</span>
                  <span className="mt-0.5 block text-sm text-steel-500">
                    Primești IBAN-ul și detaliile după plasarea comenzii.
                  </span>
                </span>
              </label>
            </li>
            <li>
              <span className="flex cursor-not-allowed items-start gap-3 border border-steel-300 p-4 opacity-45">
                <input
                  type="radio"
                  name="metodaPlataIndisponibila"
                  disabled
                  className="mt-1 h-4 w-4"
                />
                <span className="flex-1">
                  <span className="block text-ink-700">Card online</span>
                  <span className="mt-0.5 block text-sm text-steel-500">
                    Momentan indisponibil.
                  </span>
                </span>
              </span>
            </li>
          </ul>
        </fieldset>

        <fieldset>
          <legend className="type-h3 mb-6 text-lg">5. Confirmare</legend>

          <Textarea
            eticheta="Observații (opțional)"
            name="observatii"
            rows={4}
            value={formular.observatii}
            onChange={(e) => seteaza("observatii", e.target.value)}
          />

          <div className="mt-5 space-y-4">
            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-700">
                <input
                  type="checkbox"
                  name="acceptTermeni"
                  checked={formular.acceptTermeni}
                  onChange={(e) => seteaza("acceptTermeni", e.target.checked)}
                  aria-invalid={erori.acceptTermeni ? true : undefined}
                  aria-describedby={
                    erori.acceptTermeni ? "eroare-termeni" : undefined
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-rust-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                />
                <span>
                  Am citit și accept{" "}
                  <Link
                    href="/termeni-si-conditii"
                    className="underline underline-offset-4"
                  >
                    Termenii și condițiile
                  </Link>
                  <span className="text-rust-600"> *</span>
                </span>
              </label>
              {erori.acceptTermeni ? (
                <p id="eroare-termeni" className="mt-2 text-sm text-rust-600">
                  {erori.acceptTermeni}
                </p>
              ) : null}
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-700">
              <input
                type="checkbox"
                name="newsletter"
                checked={formular.newsletter}
                onChange={(e) => seteaza("newsletter", e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-rust-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
              />
              <span>Vreau să primesc noutăți despre produse și stocuri.</span>
            </label>
          </div>

          <Button
            type="submit"
            varianta="accent"
            dimensiune="lg"
            className="mt-8 w-full sm:w-auto"
          >
            Plasează comanda
          </Button>

          <p className="mt-4 max-w-[60ch] text-sm text-steel-500">
            Magazin demonstrativ: comanda nu este trimisă nicăieri și nu se
            procesează nicio plată. Datele completate rămân în browserul tău.
          </p>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderReview
          linii={rezumat}
          subtotal={subtotal}
          costLivrare={costAles}
          total={totalAles}
        />
      </div>
    </form>
  );
}
