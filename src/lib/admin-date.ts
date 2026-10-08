import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import { join } from "node:path";
import type {
  Categorie,
  ComandaSalvata,
  Produs,
} from "@/types";
import type { SetariSite } from "@/data/site";

// Citirea și scrierea fișierelor JSON care țin catalogul. Rulează DOAR pe
// server (Node runtime), din route handlers — nu importa modulul acesta în
// componente client.
//
// `process.cwd()` e rădăcina proiectului atât în `next dev`, cât și în `next start`.
const DIRECTOR_DATE = join(process.cwd(), "src", "data");

export const CALE_PRODUSE = join(DIRECTOR_DATE, "produse.json");
export const CALE_CATEGORII = join(DIRECTOR_DATE, "categorii.json");
export const CALE_SETARI = join(DIRECTOR_DATE, "site.json");
export const CALE_COMENZI = join(DIRECTOR_DATE, "comenzi.json");

async function citeste<T>(cale: string, implicit: T): Promise<T> {
  try {
    return JSON.parse(await readFile(cale, "utf8")) as T;
  } catch (err) {
    // Fișier lipsă: pornim de la valoarea implicită. JSON invalid: oprim, ca o
    // scriere ulterioară să nu suprascrie date pe care nu le-am putut citi.
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return implicit;
    throw err;
  }
}

/**
 * Scriere atomică: întâi într-un fișier temporar, apoi `rename` peste cel real.
 * Rename-ul e atomic pe același volum, deci o întrerupere la mijloc nu poate
 * lăsa catalogul trunchiat.
 */
async function scrie(cale: string, date: unknown): Promise<void> {
  await mkdir(DIRECTOR_DATE, { recursive: true });
  const temporar = `${cale}.${process.pid}.tmp`;
  await writeFile(temporar, JSON.stringify(date, null, 2) + "\n", "utf8");
  await rename(temporar, cale);
}

export const citesteProduse = () => citeste<Produs[]>(CALE_PRODUSE, []);
export const scrieProduse = (p: Produs[]) => scrie(CALE_PRODUSE, p);

export const citesteCategorii = () => citeste<Categorie[]>(CALE_CATEGORII, []);
export const scrieCategorii = (c: Categorie[]) => scrie(CALE_CATEGORII, c);

export const citesteComenzi = () =>
  citeste<ComandaSalvata[]>(CALE_COMENZI, []);
export const scrieComenzi = (c: ComandaSalvata[]) => scrie(CALE_COMENZI, c);

export const citesteSetari = () =>
  citeste<SetariSite>(CALE_SETARI, {} as SetariSite);
export const scrieSetari = (s: SetariSite) => scrie(CALE_SETARI, s);

/**
 * Spune dacă datele chiar pot fi salvate pe discul serverului.
 *
 * Pe găzduirile serverless (Vercel, Netlify și altele) codul rulează dintr-un
 * pachet doar-citire, deci panoul poate arăta datele, dar nu le poate schimba.
 * Verificăm scriind efectiv un fișier, nu ghicind după numele platformei.
 */
export async function sePoateScrie(): Promise<boolean> {
  const martor = join(DIRECTOR_DATE, ".scriere-test");
  try {
    await writeFile(martor, "x", "utf8");
    const { unlink } = await import("node:fs/promises");
    await unlink(martor).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

/** `Masă de competiție Titan Pro` → `masa-de-competitie-titan-pro`. */
export function slugifica(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // diacritice
    .replace(/[șş]/gi, "s")
    .replace(/[țţ]/gi, "t")
    .replace(/ă|â/gi, "a")
    .replace(/î/gi, "i")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
