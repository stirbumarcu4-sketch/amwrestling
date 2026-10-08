import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

async function procesaTitanPro() {
  const sursa = join(RADACINA, "assets", "titan-pro-sursa.png");
  const pubProduse = join(RADACINA, "public", "produse");

  try {
    // Citeste imaginea sursa
    const imagine = await readFile(sursa);

    // Redimensioneza la 900x900 (patrat pentru produs)
    const buffer = await sharp(imagine)
      .resize(900, 900, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 80 })
      .toBuffer();

    // Salveaza de 4 ori cu nume diferite
    for (let i = 1; i <= 4; i++) {
      const dest = join(pubProduse, `titan-pro-${i}.webp`);
      await writeFile(dest, buffer);
      console.log(`✓ Salvat: titan-pro-${i}.webp`);
    }

    console.log("\n✓ Imagini Titan Pro procesate cu succes!");
  } catch (err) {
    console.error("Eroare la procesare:", err.message);
    process.exit(1);
  }
}

procesaTitanPro();
