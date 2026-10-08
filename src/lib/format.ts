// DECIZIE: `currencyDisplay: "code"` dă „1.234 MDL". Varianta implicită pentru
// `ro-MD` este simbolul „L" („1.234 L"), prea discret lângă cifre tabulare și
// ușor de confundat cu o unitate de măsură.
const formatterPret = new Intl.NumberFormat("ro-MD", {
  style: "currency",
  currency: "MDL",
  currencyDisplay: "code",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatterData = new Intl.DateTimeFormat("ro-MD", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const formatPret = (v: number) => formatterPret.format(v);

export const formatData = (iso: string) => formatterData.format(new Date(iso));

/** Sumele se calculează în bani întregi, ca să nu se acumuleze erori de virgulă mobilă. */
export const inBani = (lei: number) => Math.round(lei * 100);

export const inLei = (bani: number) => bani / 100;

/** Procentul de reducere, rotunjit. Ex. (5990, 5490) → 8. */
export function procentReducere(pretVechi: number, pretNou: number): number {
  if (pretVechi <= 0 || pretNou >= pretVechi) return 0;
  return Math.round(((pretVechi - pretNou) / pretVechi) * 100);
}

/** Formatează o greutate, ex. 1.4 → „1,4 kg”. */
export const formatGreutate = (kg: number) =>
  `${kg.toString().replace(".", ",")} kg`;
