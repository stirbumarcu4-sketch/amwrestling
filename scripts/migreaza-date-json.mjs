// Mută datele din modulele TypeScript în fișiere JSON, ca panoul de
// administrare să le poată rescrie la runtime. Modulele `.ts` rămân pe loc ca
// învelișuri care importă JSON-ul, deci niciunul dintre cele ~18 importuri din
// aplicație nu se schimbă.
//
//   node scripts/migreaza-date-json.mjs
//
// Rulează o singură dată. Dacă JSON-ul există deja, nu îl suprascrie.

import { readFile, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATE = join(RADACINA, "src", "data");

const exista = async (cale) =>
  access(cale).then(
    () => true,
    () => false,
  );

/**
 * Importă un modul TypeScript fără build: îi scoate tipurile cu transpilerul
 * oficial, scrie rezultatul într-un `.mjs` temporar lângă sursă (ca importurile
 * relative să rămână valide) și îl încarcă.
 */
async function importaModulTs(numeFisier) {
  const sursa = await readFile(join(DATE, numeFisier), "utf8");
  const js = ts.transpileModule(sursa, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      verbatimModuleSyntax: false,
    },
  }).outputText;

  const caleTemp = join(DATE, `__temp-${numeFisier.replace(/\.ts$/, "")}.mjs`);
  await writeFile(caleTemp, js, "utf8");
  try {
    // Cache-bust, ca rulările repetate să nu primească versiunea veche.
    return await import(`${pathToFileURL(caleTemp).href}?t=${Date.now()}`);
  } finally {
    const { unlink } = await import("node:fs/promises");
    await unlink(caleTemp).catch(() => {});
  }
}

async function scrieJson(nume, date) {
  const cale = join(DATE, nume);
  if (await exista(cale)) {
    console.log(`• ${nume} există deja — sărit`);
    return false;
  }
  await writeFile(cale, JSON.stringify(date, null, 2) + "\n", "utf8");
  console.log(`✓ ${nume} scris`);
  return true;
}

const modulProduse = await importaModulTs("produse.ts");
await scrieJson("produse.json", modulProduse.produse);

const modulCategorii = await importaModulTs("categorii.ts");
await scrieJson("categorii.json", modulCategorii.categorii);

const modulSite = await importaModulTs("site.ts");
await scrieJson("site.json", modulSite.site);

// Comenzile încă nu există nicăieri pe server — checkout-ul le ținea doar în
// sessionStorage. Pornim de la o listă goală.
await scrieJson("comenzi.json", []);

console.log(
  `\n${modulProduse.produse.length} produse, ${modulCategorii.categorii.length} categorii migrate.`,
);
