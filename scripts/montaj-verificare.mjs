// Unealtă de lucru: pune mai multe imagini într-un singur fișier, ca să le pot
// verifica dintr-o privire înainte de a le folosi pe site.
//
//   node scripts/montaj-verificare.mjs <director>

import { readdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const director = process.argv[2];
if (!director) throw new Error("Lipsește directorul.");

const fisiere = (await readdir(director))
  .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith("montaj"))
  .sort();

const L = 320;
const bucati = await Promise.all(
  fisiere.map((f) =>
    sharp(join(director, f))
      .resize(L, L, { fit: "contain", background: "#ffffff" })
      .toBuffer(),
  ),
);

const coloane = 2;
await sharp({
  create: {
    width: L * coloane,
    height: L * Math.ceil(bucati.length / coloane),
    channels: 3,
    background: "#ffffff",
  },
})
  .composite(
    bucati.map((input, i) => ({
      input,
      left: (i % coloane) * L,
      top: Math.floor(i / coloane) * L,
    })),
  )
  .jpeg({ quality: 88 })
  .toFile(join(director, "montaj.jpg"));

console.log("Ordine (stânga→dreapta, sus→jos):");
fisiere.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
