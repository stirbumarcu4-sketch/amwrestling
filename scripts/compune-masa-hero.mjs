import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

async function compuneMasaHero() {
  const imagineSource = join(RADACINA, "public", "produse", "titan-pro-1.webp");
  const destWebp = join(RADACINA, "public", "masa-armwrestling.webp");

  try {
    const imagine = await readFile(imagineSource);

    let buffer = await sharp(imagine)
      .resize(1254, 1254, {
        fit: "cover",
        position: "center",
      })
      .toBuffer();

    const svgDesen = `
      <svg width="1254" height="1254" viewBox="0 0 1254 1254" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="umbra" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#umbra)">
          <rect x="120" y="180" width="1014" height="650" rx="15" fill="none" stroke="#1a1a1a" stroke-width="4"/>
          <rect x="90" y="380" width="100" height="120" rx="8" fill="none" stroke="#555" stroke-width="3" opacity="0.7"/>
          <rect x="1064" y="380" width="100" height="120" rx="8" fill="none" stroke="#555" stroke-width="3" opacity="0.7"/>
          <circle cx="270" cy="515" r="28" fill="none" stroke="#666" stroke-width="2" opacity="0.6"/>
          <circle cx="984" cy="515" r="28" fill="none" stroke="#666" stroke-width="2" opacity="0.6"/>
          <line x1="627" y1="200" x2="627" y2="800" stroke="#999" stroke-width="1" opacity="0.3"/>
        </g>

        <rect x="120" y="180" width="20" height="20" rx="3" fill="none" stroke="#c0392b" stroke-width="2" opacity="0.5"/>
      </svg>
    `;

    buffer = await sharp(buffer)
      .composite([
        {
          input: Buffer.from(svgDesen),
          blend: "multiply",
        },
      ])
      .webp({ quality: 90 })
      .toBuffer();

    await writeFile(destWebp, buffer);
    console.log(`✓ Salvat: masa-armwrestling.webp`);
    console.log(`✓ Imagine compusă: textură reală + contur masă desenat`);

  } catch (err) {
    console.error("Eroare:", err.message);
    process.exit(1);
  }
}

compuneMasaHero();
