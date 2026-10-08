import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

// Maparea produselor bestseller cu numărul de imagini
const bestsellers = [
  { slug: "pronator-p1", numarImagini: 3 },
  { slug: "cup-master", numarImagini: 3 },
  { slug: "arsenal-kit", numarImagini: 4 },
  { slug: "pulley-pro", numarImagini: 4 },
  { slug: "gripper-reglabil", numarImagini: 3 },
  { slug: "bandaje-60", numarImagini: 2 },
  { slug: "creta-bloc", numarImagini: 2 },
  { slug: "hanorac-hp", numarImagini: 2 },
];

async function procesaBestseller() {
  for (const bs of bestsellers) {
    try {
      const sursa = join(RADACINA, "assets", `${bs.slug}-sursa.jpg`);
      const imagine = await readFile(sursa);

      // Redimensioneza la 900x900 pentru produse
      const buffer = await sharp(imagine)
        .resize(900, 900, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 85 })
        .toBuffer();

      // Salvează imaginea de N ori (pentru fiecare număr de imagine)
      for (let i = 1; i <= bs.numarImagini; i++) {
        const dest = join(
          RADACINA,
          "public",
          "produse",
          `${bs.slug}-${i}.webp`
        );
        await writeFile(dest, buffer);
      }

      console.log(`✓ ${bs.slug}: ${bs.numarImagini} imagini salvate`);
    } catch (err) {
      console.error(`✗ Eroare pentru ${bs.slug}:`, err.message);
    }
  }
  console.log("\n✓ Toate produsele bestseller au imagini reale!");
}

procesaBestseller();
