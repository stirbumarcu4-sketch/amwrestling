// Marca „ARMARCU", desenată ca trasee vectoriale, nu ca <text>.
//
// Motivul: randarea nu trebuie să depindă de fonturile instalate pe mașina care
// rulează scriptul. Cu un font de sistem, altcineva ar obține alt rezultat sau
// un fallback urât. Alfabetul acoperă doar literele folosite; `scrieText` aruncă
// dacă lipsește vreuna.
//
// Modulul e folosit de `genereaza-imagini.mjs` (ilustrațiile de produs) și de
// `imagini-categorii-foto.mjs` (fotografiile reale).

export const MARCA = "ARMARCU";

const LITERE = {
  A: "M 4 100 L 30 4 L 56 100 M 15 68 L 45 68",
  R: "M 7 100 L 7 4 L 34 4 Q 56 4 56 28 Q 56 52 34 52 L 7 52 M 33 52 L 56 100",
  M: "M 7 100 L 7 4 L 30 52 L 53 4 L 53 100",
  C: "M 53 26 Q 53 4 30 4 Q 7 4 7 52 Q 7 100 30 100 Q 53 100 53 78",
  U: "M 7 4 L 7 68 Q 7 100 30 100 Q 53 100 53 68 L 53 4",
};

const LATIME_LITERA = 60;
const SPATIU_LITERA = 12;
/** Înălțimea casetei în care sunt desenate literele. */
const CADRU_LITERA = 104;

export const latimeText = (cuvant, inaltime) =>
  (cuvant.length * (LATIME_LITERA + SPATIU_LITERA) - SPATIU_LITERA) *
  (inaltime / CADRU_LITERA);

/** Scrie un cuvânt din litere vectoriale, centrat orizontal pe `cx`. */
export function scrieText(cuvant, cx, y, inaltime, culoare, grosime = 10) {
  const scara = inaltime / CADRU_LITERA;
  const start = cx - latimeText(cuvant, inaltime) / 2;
  return cuvant
    .split("")
    .map((litera, i) => {
      const traseu = LITERE[litera];
      if (!traseu) throw new Error(`Litera „${litera}” nu are traseu definit.`);
      const atribute =
        `fill="none" stroke="${culoare}" stroke-width="${grosime / scara}" ` +
        `stroke-linecap="round" stroke-linejoin="round"`;
      const deplasare = start + i * (LATIME_LITERA + SPATIU_LITERA) * scara;
      return (
        `<g transform="translate(${deplasare},${y}) scale(${scara})">` +
        `<path d="${traseu}" ${atribute}/></g>`
      );
    })
    .join("");
}

/** SVG de dimensiunea cadrului, cu marca scrisă la coordonatele date. */
export function svgMarca({ latime, inaltime, cx, y, inaltimeMarca, culoare, opacitate }) {
  const grosime = Math.max(5, Math.round(inaltimeMarca * 0.22));
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${latime}" height="${inaltime}" ` +
    `viewBox="0 0 ${latime} ${inaltime}"><g opacity="${opacitate}">` +
    `${scrieText(MARCA, cx, y, inaltimeMarca, culoare, grosime)}</g></svg>`
  );
}
