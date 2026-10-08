import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

async function procesaVPAA() {
  const sursa = join(RADACINA, "assets", "vpaa8412-sursa.png");
  const destWebp = join(RADACINA, "public", "masa-armwrestling.webp");

  try {
    const imagine = await readFile(sursa);

    // Redimensioneza la 1254x1254 pentru hero
    let buffer = await sharp(imagine)
      .resize(1254, 1254, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 90 })
      .toBuffer();

    await writeFile(destWebp, buffer);
    console.log(`✓ Salvat: masa-armwrestling.webp`);
    console.log(`✓ Imagine ARMARCU în hero section!`);

  } catch (err) {
    console.error("Eroare:", err.message);
    process.exit(1);
  }
}

procesaVPAA();
