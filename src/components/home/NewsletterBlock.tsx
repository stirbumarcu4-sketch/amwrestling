"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function NewsletterBlock() {
  const id = useId();
  const idMesaj = `${id}-mesaj`;
  const [email, setEmail] = useState("");
  const [eroare, setEroare] = useState<string | undefined>(undefined);
  const [confirmat, setConfirmat] = useState(false);

  function trimite(eveniment: FormEvent<HTMLFormElement>) {
    eveniment.preventDefault();
    const curatat = email.trim();

    if (!REGEX_EMAIL.test(curatat)) {
      setEroare("Introdu o adresă de e-mail validă.");
      setConfirmat(false);
      return;
    }

    // Abonarea nu este trimisă nicăieri: confirmarea este doar locală.
    setEroare(undefined);
    setConfirmat(true);
    setEmail("");
  }

  return (
    <Section className="bg-carbon">
      <Container>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="type-h2 text-ink-900">Noutăți și stocuri</h2>
            <p className="masura mt-4 text-steel-500">
              Un e-mail scurt când intră produse noi în stoc sau când revin cele
              epuizate. Fără promoții zilnice.
            </p>
          </div>

          <div>
            <form onSubmit={trimite} noValidate className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <label htmlFor={id} className="type-eticheta text-steel-500">
                  Adresa ta de e-mail
                </label>
                <input
                  id={id}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nume@exemplu.ro"
                  aria-invalid={eroare ? true : undefined}
                  aria-describedby={eroare || confirmat ? idMesaj : undefined}
                  className="mt-2 h-11 w-full rounded-[var(--radius-sm)] border border-chalk-200 bg-suprafata px-3 text-base text-ink-900 placeholder:text-steel-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
                />
              </div>
              <Button type="submit" varianta="accent" className="sm:mt-8">
                Abonează-te
              </Button>
            </form>

            <p id={idMesaj} role="status" className="mt-3 text-sm">
              {eroare ? (
                <span className="text-rust-100">{eroare}</span>
              ) : confirmat ? (
                <span className="text-ink-900">
                  Adresa a fost înregistrată local. Magazinul fiind demonstrativ,
                  nu se trimite niciun e-mail.
                </span>
              ) : null}
            </p>

            <p className="mt-3 text-sm text-steel-500">
              Adresa este folosită exclusiv pentru aceste anunțuri. Detalii în{" "}
              <Link
                href="/politica-de-confidentialitate"
                className="text-steel-500 underline underline-offset-4 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-600"
              >
                politica de confidențialitate
              </Link>
              .
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
