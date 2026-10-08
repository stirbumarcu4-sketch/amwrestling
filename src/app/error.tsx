"use client";

import { useEffect } from "react";
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section>
      <Container>
        <p className="type-eticheta">Eroare</p>
        <h1 className="type-h1 mt-3">Ceva a cedat</h1>
        <p className="masura mt-4 text-steel-500">
          Pagina nu a putut fi afișată. Poți încerca din nou sau te poți întoarce la
          catalog.
        </p>
        {error.digest ? (
          <p className="mt-3 text-sm text-steel-500">Cod: {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset}>Încearcă din nou</Button>
          <Button href="/produse" varianta="ghost">
            Vezi produsele
          </Button>
        </div>
      </Container>
    </Section>
  );
}
