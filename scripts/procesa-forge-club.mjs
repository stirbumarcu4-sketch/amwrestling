import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

async function procesaForgeClub() {
  const sursa = join(RADACINA, "assets", "forge-club-sursa.png");
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

    // Salveaza de 3 ori cu nume diferite (pentru masa de antrenament)
    for (let i = 1; i <= 3; i++) {
      const dest = join(pubProduse, `forge-club-${i}.webp`);
      await writeFile(dest, buffer);
      console.log(`✓ Salvat: forge-club-${i}.webp`);
    }

    console.log("\n✓ Imagini Forge Club procesate cu succes!");
  } catch (err) {
    console.error("Eroare la procesare:", err.message);
    process.exit(1);
  }
}

procesaForgeClub();
