"use client";

// DECIZIE: mărimea, cantitatea și butonul împart aceeași stare, așa că
// AddToCartButton le randează pe toate trei, în ordinea cerută de specificație.

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import SizePicker from "@/components/produs/SizePicker";
import QuantityStepper from "@/components/cos/QuantityStepper";
import { useCos } from "@/lib/cart-context";
import type { Produs } from "@/types";

export default function AddToCartButton({ produs }: { produs: Produs }) {
  const { adauga } = useCos();
  const [marime, setMarime] = useState<string | undefined>(undefined);
  const [cantitate, setCantitate] = useState(1);
  const [eroare, setEroare] = useState<string | undefined>(undefined);
  const zonaMarimi = useRef<HTMLDivElement>(null);

  const epuizat = produs.stoc === "epuizat";
  const cereMarime = Boolean(produs.marimi?.length);

  function adaugaInCos() {
    if (cereMarime && !marime) {
      setEroare("Alege o mărime înainte de a adăuga produsul în coș.");
      zonaMarimi.current?.querySelector("input")?.focus();
      return;
    }
    setEroare(undefined);
    adauga(produs.slug, cantitate, marime);
  }

  return (
    <div className="flex flex-col gap-6">
      {produs.marimi?.length ? (
        <div ref={zonaMarimi}>
          <SizePicker
            marimi={produs.marimi}
            valoare={marime}
            laSchimbare={(noua) => {
              setMarime(noua);
              setEroare(undefined);
            }}
            eroare={eroare}
          />
        </div>
      ) : null}

      <QuantityStepper valoare={cantitate} laSchimbare={setCantitate} />

      <Button
        varianta="accent"
        dimensiune="lg"
        className="w-full"
        onClick={adaugaInCos}
        disabled={epuizat}
      >
        {epuizat ? "Stoc epuizat" : "Adaugă în coș"}
      </Button>
    </div>
  );
}
