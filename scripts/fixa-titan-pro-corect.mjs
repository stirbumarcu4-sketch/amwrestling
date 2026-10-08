import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

async function fixaTitanProCorect() {
  try {
    // Citeste imaginea corespunzătoare a mesei (mese-foto.webp)
    const sursa = join(RADACINA, "assets", "masa-armwrestling-sursa.png");
    const imagine = await readFile(sursa);

    // Redimensioneza la 900x900 pentru produs
    const buffer = await sharp(imagine)
      .resize(900, 900, { fit: "cover", position: "center" })
      .webp({ quality: 90 })
      .toBuffer();

    // Salvează pentru Titan Pro (4 imagini)
    for (let i = 1; i <= 4; i++) {
      const dest = join(RADACINA, "public", "produse", `titan-pro-${i}.webp`);
      await writeFile(dest, buffer);
    }

    console.log(`✓ Titan Pro: Imaginea MESEI (corespunzătoare) salvată!`);

  } catch (err) {
    console.error("Eroare:", err.message);
    process.exit(1);
  }
}

fixaTitanProCorect();
