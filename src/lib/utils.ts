/**
 * Concatenează clase CSS, ignorând valorile false / null / undefined.
 * DECIZIE: implementare proprie, în loc de `clsx` — singura dependență UI
 * permisă de specificație este `lucide-react`.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Elimină diacriticele, pentru căutare insensibilă la ă/â/î/ș/ț.
 * Descompunerea NFD separă litera de semnul diacritic, iar `\p{M}` (Mark)
 * elimină semnele rămase, inclusiv virgula de sub ș/ț.
 */
export function faraDiacritice(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "");
}

/** Normalizează un text pentru comparații de căutare. */
export function normalizeaza(text: string): string {
  return faraDiacritice(text.toLowerCase().trim());
}

export type SegmentText = { text: string; marcat: boolean };

/**
 * Împarte un text în segmente, marcându-l pe cel care corespunde termenului
 * căutat. Comparația se face pe varianta fără diacritice, dar segmentele
 * returnate păstrează textul original — de aceea se construiește o hartă între
 * pozițiile normalizate și cele reale.
 */
export function segmenteazaPentruEvidentiere(
  text: string,
  termen: string,
): SegmentText[] {
  const cautat = normalizeaza(termen);
  if (!cautat) return [{ text, marcat: false }];

  const harta: number[] = [];
  let normalizat = "";
  for (let i = 0; i < text.length; i++) {
    for (const caracter of normalizeaza(text[i])) {
      normalizat += caracter;
      harta.push(i);
    }
  }

  const pozitie = normalizat.indexOf(cautat);
  if (pozitie === -1) return [{ text, marcat: false }];

  const start = harta[pozitie];
  const sfarsit = harta[pozitie + cautat.length - 1] + 1;

  return [
    { text: text.slice(0, start), marcat: false },
    { text: text.slice(start, sfarsit), marcat: true },
    { text: text.slice(sfarsit), marcat: false },
  ].filter((segment) => segment.text.length > 0);
}
