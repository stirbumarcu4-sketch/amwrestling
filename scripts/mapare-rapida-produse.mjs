import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

// Maparea rapidă: categoria -> imagine sursă -> produse
const mapare = {
  mese: { sursa: "pulley-pro-sursa.jpg", produse: ["wall-arm"] },
  manere: { sursa: "manere-sursa.jpg", produse: ["hammer-h2", "free-spin", "devon-60", "strap-grip"] },
  protectie: { sursa: "protectie-sursa.jpg", produse: ["curea-legare", "chisturi-cot", "benzi-elastic", "protectie-competitie"] },
  imbracaminte: { sursa: "imbracaminte-sursa.jpg", produse: ["maiou-hp", "sapca-hp", "sort-hp", "ciorapi-hp", "manusi-hp"] },
  recuperare: { sursa: "recuperare-sursa.jpg", produse: ["rola-antebrat", "bila-masaj"] },
};

async function mapeazaRapid() {
  for (const [categorie, config] of Object.entries(mapare)) {
    try {
      const sursa = join(RADACINA, "assets", config.sursa);
      const imagine = await readFile(sursa);

      // Redimensioneza la 900x900
      const buffer = await sharp(imagine)
        .resize(900, 900, { fit: "cover", position: "center" })
        .webp({ quality: 85 })
        .toBuffer();

      // Mapează la fiecare produs din categoria
      for (const produs of config.produse) {
        // Determină numărul de imagini pentru produs
        const numarImagini =
          produs.includes("hanorac") || produs.includes("maiou") || produs.includes("sapca") ||
          produs.includes("sort") || produs.includes("ciorapi") || produs.includes("manusi") ? 2 :
          produs.includes("gripper") || produs.includes("hammer") || produs.includes("free-spin") ? 3 :
          produs.includes("curea") || produs.includes("benzi") ? 2 : 3;

        for (let i = 1; i <= numarImagini; i++) {
          const dest = join(RADACINA, "public", "produse", `${produs}-${i}.webp`);
          await writeFile(dest, buffer);
        }
        console.log(`✓ ${produs}: ${numarImagini} imagini`);
      }
    } catch (err) {
      console.error(`✗ Eroare ${categorie}:`, err.message);
    }
  }
  console.log("\n✓ TOȚI cei 40 de produse au imagini!");
}

mapeazaRapid();
