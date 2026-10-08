import dateSite from "./site.json";

// În Moldova firmele au un singur cod, IDNO (13 cifre), atribuit de Agenția
// Servicii Publice. El ține locul perechii CUI + număr de Registrul Comerțului
// din România, deci aici există un singur câmp, nu două.
export type SetariSite = {
  nume: string;
  numeScurt: string;
  tagline: string;
  descriere: string;
  url: string;
  email: string;
  telefon: string;
  adresa: string;
  idno: string;
  program: string;
  /** MDL */
  livrareGratuitaPeste: number;
  /** MDL */
  costLivrare: number;
  /** MDL, pentru mese (produse cu `voluminos: true`) */
  costLivrareVoluminos: number;
  zileRetur: number;
  social: { instagram: string; facebook: string; youtube: string };
};

// DECIZIE: fără `as const`, spre deosebire de versiunea veche — setările sunt
// acum editabile din panoul de administrare, deci valorile nu mai pot fi
// literali înghețați la compilare.
export const site = dateSite as SetariSite;
