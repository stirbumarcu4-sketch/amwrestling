import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

const categorii = [
  { slug: "manere", fisier: "manere-sursa.jpg" },
  { slug: "antrenament", fisier: "antrenament-sursa.jpg" },
  { slug: "protectie", fisier: "protectie-sursa.jpg" },
  { slug: "imbracaminte", fisier: "imbracaminte-sursa.jpg" },
  { slug: "recuperare", fisier: "recuperare-sursa.jpg" },
];

async function procesaCategorii() {
  for (const cat of categorii) {
    try {
      const sursa = join(RADACINA, "assets", cat.fisier);
      const dest = join(RADACINA, "public", "categorii", `${cat.slug}-foto.webp`);

      const imagine = await readFile(sursa);

      // Redimensioneza la 1200x800 pentru categorii
      const buffer = await sharp(imagine)
        .resize(1200, 800, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: 85 })
        .toBuffer();

      await writeFile(dest, buffer);
      console.log(`✓ ${cat.slug}-foto.webp salvat`);

    } catch (err) {
      console.error(`✗ Eroare pentru ${cat.slug}:`, err.message);
    }
  }
  console.log("\n✓ Toate categoriile procesate!");
}

procesaCategorii();
