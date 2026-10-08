import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { scrieText, svgMarca } from "./marca.mjs";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

async function procesaHeroNature() {
  const sursa = join(RADACINA, "assets", "hero-nature-sursa.jpg");
  const destWebp = join(RADACINA, "public", "hero-nature-bg.webp");

  try {
    // Citeste imaginea sursa
    const imagine = await readFile(sursa);

    // Redimensioneza la 1920x800 landscape pentru hero
    let buffer = await sharp(imagine)
      .resize(1920, 800, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Adaugă branding "MARCU STIRBU" pe imagine
    const svg = svgMarca("MARCU STIRBU");

    // Suprapune branding în colțul din dreapta jos
    buffer = await sharp(buffer)
      .composite([
        {
          input: Buffer.from(svg),
          gravity: "southeast",
          offset: { left: 40, top: 40 },
          blend: "overlay",
        },
      ])
      .webp({ quality: 85 })
      .toBuffer();

    await writeFile(destWebp, buffer);
    console.log(`✓ Salvat: hero-nature-bg.webp (1920×800)`);
    console.log(`✓ Branding MARCU STIRBU adăugat`);

  } catch (err) {
    console.error("Eroare la procesare:", err.message);
    process.exit(1);
  }
}

procesaHeroNature();
