import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

// MAPARE PRECISĂ: Fiecare produs -> Imagine corespunzătoare
const mapareCompleta = {
  // MESE (3) - DEJA AU IMAGINI
  "titan-pro": null, // ✓ Deja are titan-pro-1,2,3,4
  "forge-club": null, // ✓ Deja are forge-club-1,2,3
  "wall-arm": "manere-leverage", // Leverage bar/dumbbell

  // MANERE (7) - LEVERAGE/DUMBBELL BAR
  "pronator-p1": null, // ✓ Deja are pronator-p1-foto
  "cup-master": null, // ✓ Deja are cup-master-1,2,3
  "hammer-h2": "manere-leverage",
  "free-spin": "manere-leverage",
  "devon-60": "manere-leverage",
  "strap-grip": "manere-leverage",
  "arsenal-kit": null, // ✓ Deja are arsenal-kit-1,2,3,4

  // ANTRENAMENT (3)
  "pulley-pro": null, // ✓ Deja are pulley-pro-1,2,3,4
  "gripper-reglabil": null, // ✓ Deja are gripper-reglabil-1,2,3
  "cablu-otel": "manere-leverage", // Cable/dumbbell equipment

  // PROTECȚIE (7)
  "curea-legare": "protectie-gear",
  "chisturi-cot": "protectie-gear",
  "benzi-elastic": "benzi-elastic",
  "bandaje-60": null, // ✓ Deja are bandaje-60-1,2
  "protectie-competitie": "protectie-gear",
  "creta-bloc": null, // ✓ Deja are creta-bloc-1,2
  "gel-racoritor": "protectie-gear",

  // ÎMBRĂCĂMINTE (6)
  "hanorac-hp": null, // ✓ Deja are hanorac-hp-1,2
  "maiou-hp": "maiou-sportswear",
  "sapca-hp": "maiou-sportswear",
  "sort-hp": "maiou-sportswear",
  "ciorapi-hp": "maiou-sportswear",
  "manusi-hp": "maiou-sportswear",

  // RECUPERARE (4)
  "rola-antebrat": "rola-antebrat",
  "bila-lacrosse": "rola-antebrat",
  "bila-masaj": "rola-antebrat",
  "gel-racoritor-2": "rola-antebrat",
};

const configuratie = {
  "manere-leverage": 3,
  "benzi-elastic": 2,
  "protectie-gear": 3,
  "maiou-sportswear": 2,
  "rola-antebrat": 3,
};

async function mapareFinala() {
  for (const [produs, imagine] of Object.entries(mapareCompleta)) {
    if (!imagine) continue; // Skip care deja au imagini

    try {
      const sursa = join(RADACINA, "assets", `${imagine}-sursa.jpg`);
      const sourceBuffer = await readFile(sursa);

      // Redimensioneza la 900x900
      const buffer = await sharp(sourceBuffer)
        .resize(900, 900, { fit: "cover", position: "center" })
        .webp({ quality: 85 })
        .toBuffer();

      // Salvează N imagini pentru produs
      const numImagini = configuratie[imagine] || 2;
      for (let i = 1; i <= numImagini; i++) {
        const dest = join(RADACINA, "public", "produse", `${produs}-${i}.webp`);
        await writeFile(dest, buffer);
      }

      console.log(`✓ ${produs} ← ${imagine} (${numImagini} imagini)`);
    } catch (err) {
      console.error(`✗ Eroare ${produs}:`, err.message);
    }
  }

  console.log("\n✅ GATA! 40 PRODUSE CORESPUNZĂTOR MAPATE!");
}

mapareFinala();
