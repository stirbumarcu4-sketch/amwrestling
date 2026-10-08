"use client";

// DECIZIE: formularul de contact are nevoie de stare și validare, deci este
// componentă client proprie. Nu trimite nimic — magazinul nu are backend.

import { useRef, useState, type FormEvent } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const subiecte = [
  "Întrebare despre un produs",
  "Stare comandă",
  "Retur sau garanție",
  "Ofertă pentru club sau sală",
  "Altceva",
];

type Camp = "nume" | "email" | "subiect" | "mesaj";
type Formular = Record<Camp, string>;
type Erori = Partial<Record<Camp, string>>;

const initial: Formular = { nume: "", email: "", subiect: "", mesaj: "" };

function valideaza(camp: Camp, valoare: string): string | undefined {
  const curatat = valoare.trim();
  if (!curatat) return "Câmpul este obligatoriu.";
  if (camp === "email" && !REGEX_EMAIL.test(curatat)) {
    return "Introdu o adresă de e-mail validă.";
  }
  if (camp === "mesaj" && curatat.length < 20) {
    return "Scrie cel puțin 20 de caractere, ca să putem răspunde util.";
  }
  return undefined;
}

export default function ContactForm() {
  const [formular, setFormular] = useState<Formular>(initial);
  const [erori, setErori] = useState<Erori>({});
  const [trimis, setTrimis] = useState(false);
  const referinta = useRef<HTMLFormElement>(null);

  function seteaza(camp: Camp, valoare: string) {
    setFormular((precedent) => ({ ...precedent, [camp]: valoare }));
  }

  function laIesire(camp: Camp) {
    setErori((precedente) => ({
      ...precedente,
      [camp]: valideaza(camp, formular[camp]),
    }));
  }

  function trimite(eveniment: FormEvent<HTMLFormElement>) {
    eveniment.preventDefault();

    const campuri: Camp[] = ["nume", "email", "subiect", "mesaj"];
    const noi: Erori = {};
    for (const camp of campuri) {
      const eroare = valideaza(camp, formular[camp]);
      if (eroare) noi[camp] = eroare;
    }
    setErori(noi);

    const primulInvalid = campuri.find((camp) => noi[camp]);
    if (primulInvalid) {
      referinta.current
        ?.querySelector<HTMLElement>(`[name="${primulInvalid}"]`)
        ?.focus();
      setTrimis(false);
      return;
    }

    setTrimis(true);
    setFormular(initial);
  }

  return (
    <form ref={referinta} onSubmit={trimite} noValidate className="space-y-5">
      <Input
        eticheta="Nume"
        name="nume"
        autoComplete="name"
        required
        value={formular.nume}
        onChange={(e) => seteaza("nume", e.target.value)}
        onBlur={() => laIesire("nume")}
        eroare={erori.nume}
      />
      <Input
        eticheta="E-mail"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={formular.email}
        onChange={(e) => seteaza("email", e.target.value)}
        onBlur={() => laIesire("email")}
        eroare={erori.email}
      />
      <Select
        eticheta="Subiect"
        name="subiect"
        required
        value={formular.subiect}
        onChange={(e) => seteaza("subiect", e.target.value)}
        onBlur={() => laIesire("subiect")}
        eroare={erori.subiect}
      >
        <option value="">Alege un subiect</option>
        {subiecte.map((subiect) => (
          <option key={subiect} value={subiect}>
            {subiect}
          </option>
        ))}
      </Select>
      <Textarea
        eticheta="Mesaj"
        name="mesaj"
        rows={6}
        required
        value={formular.mesaj}
        onChange={(e) => seteaza("mesaj", e.target.value)}
        onBlur={() => laIesire("mesaj")}
        eroare={erori.mesaj}
      />

      <Button type="submit">Trimite mesajul</Button>

      <p role="status" className="text-sm">
        {trimis ? (
          <span className="text-moss-600">
            Mesajul a fost validat local. Magazinul fiind demonstrativ, nu se
            trimite nicăieri — scrie-ne direct pe e-mail pentru un răspuns real.
          </span>
        ) : null}
      </p>
    </form>
  );
}
