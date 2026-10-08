// Așază artwork-ul ARMARCU pe blatul mesei din fotografia de hero.
//
//   node scripts/marcheaza-masa.mjs
//
// Sursa (`assets/masa-armwrestling-sursa.png`) este fotografia originală, cu
// wordmark-ul „ARMWRESTLING" pe blat. Scriptul îl acoperă și pune artwork-ul în
// locul lui, înclinat pe planul mesei, apoi exportă `public/masa-armwrestling.webp`.
//
// Sursele stau în `assets/`, nu în `public/`, ca să nu fie publicate odată cu
// site-ul — au câțiva MB și nu sunt folosite de nicio pagină.

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");
const SURSA = join(RADACINA, "assets", "masa-armwrestling-sursa.png");
const ARTWORK = join(RADACINA, "assets", "armarcu-artwork.png");
const DESTINATIE = join(RADACINA, "public", "masa-armwrestling.webp");

const N = 1254; // fotografia mesei este pătrată

// ── Ștergerea wordmark-ului original ────────────────────────────────────────
// „ARMWRESTLING" mergea de la (510, 453) la (803, 347) pe blat.
const CX = 656;
const CY = 403;
const UNGHI = -19.9;
const LUNGIME = 320;
const INALTIME = 104;
const PANA_SUS = 20;
const PANA_JOS = 48;
const PANA_CAP = 42;

const rad = (UNGHI * Math.PI) / 180;
const cs = Math.cos(rad);
const sn = Math.sin(rad);

/** Cât de mult înlocuim pixelul (1 = complet, 0 = rămâne originalul). */
function acoperire(x, y) {
  const dx = x - CX;
  const dy = y - CY;
  const u = Math.abs(dx * cs + dy * sn);
  const v = -dx * sn + dy * cs;

  const capat = LUNGIME / 2;
  const fu = u <= capat ? 1 : u >= capat + PANA_CAP ? 0 : 1 - (u - capat) / PANA_CAP;

  const margine = INALTIME / 2;
  const pana = v < 0 ? PANA_SUS : PANA_JOS;
  const av = Math.abs(v);
  const fv = av <= margine ? 1 : av >= margine + pana ? 0 : 1 - (av - margine) / pana;

  const m = Math.min(fu, fv);
  return m * m * (3 - 2 * m); // smoothstep, ca tranziția să nu lase muchie
}

const { data: baza } = await sharp(SURSA)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Median de 45 px — mai lat decât grosimea literelor, deci le șterge complet.
const { data: fundal } = await sharp(SURSA)
  .ensureAlpha()
  .median(45)
  .blur(3)
  .raw()
  .toBuffer({ resolveWithObject: true });

const curat = Buffer.from(baza);
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    const m = acoperire(x, y);
    if (m <= 0.002) continue;
    const i = (y * N + x) * 4;
    const grunj = (Math.random() + Math.random() + Math.random() - 1.5) * 13;
    for (let c = 0; c < 3; c++) {
      const inlocuit = Math.max(0, Math.min(255, fundal[i + c] * 0.94 + grunj));
      curat[i + c] = Math.round(baza[i + c] * (1 - m) + inlocuit * m);
    }
  }
}

const masaCurata = await sharp(curat, { raw: { width: N, height: N, channels: 4 } })
  .png()
  .toBuffer();

// ── Artwork-ul, culcat pe planul blatului ───────────────────────────────────
// Blatul e fotografiat oblic, deci artwork-ul nu se lipește drept: îl trecem
// printr-o transformare afină care duce axele lui pe cele două laturi ale mesei,
// măsurate pe fotografie:
//   latura lungă  (78,235) -> (595,82)   = versor ( 0,9588; -0,2837)
//   latura scurtă (78,235) -> (660,655)  = versor ( 0,8109;  0,5852)
const LATURA_LUNGA = [0.9588, -0.2837];
const LATURA_SCURTA = [0.8109, 0.5852];

// DECIZIE: nu aplicăm perspectiva întreagă. Blatul e privit sub un unghi mic,
// iar un pătrat proiectat corect pe el iese turtit — la mărimea din hero,
// „ARMARCU" devine ilizibil. Amestecăm versorii mesei cu axele drepte: la 0,6
// decalul păstrează senzația că stă culcat pe blat, dar rămâne citibil.
const INCLINARE = 0.6;
const mixt = (versor, axa) => [
  versor[0] * INCLINARE + axa[0] * (1 - INCLINARE),
  versor[1] * INCLINARE + axa[1] * (1 - INCLINARE),
];
const AXA_X = mixt(LATURA_LUNGA, [1, 0]);
const AXA_Y = mixt(LATURA_SCURTA, [0, 1]);

/**
 * Latura decalului, în pixeli de blat. Blatul are ~540 px pe latura lungă, deci
 * la 240 decalul stă în întregime pe suprafață, fără să atingă vreo margine.
 */
const MARIME = 240;
/**
 * Centrul decalului. Ales să acopere și banda de unde a fost șters wordmark-ul
 * „ARMWRESTLING" (x 508–804) — altfel petecul reparat ar rămâne la vedere.
 */
const CENTRU = [640, 400];
const OPACITATE = 0.95;

const LUCRU = 900; // rezoluția la care lucrăm artwork-ul, înainte de înclinare
const scara = MARIME / LUCRU;

const { data: dArt, info: iArt } = await sharp(ARTWORK)
  .resize(LUCRU, LUCRU, { fit: "fill" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Marginea artwork-ului se stinge spre transparent pe ultimii 9% din latură.
// Fără asta, pătratul are muchie dreaptă și arată ca o carte pusă pe blat, nu
// ca un imprimeu. Fundalul artwork-ului fiind aproape negru, stingerea se
// topește firesc în suprafața închisă a mesei.
const PANA_MARGINE = Math.round(LUCRU * 0.09);
for (let y = 0; y < LUCRU; y++) {
  for (let x = 0; x < LUCRU; x++) {
    const dist = Math.min(x, y, LUCRU - 1 - x, LUCRU - 1 - y);
    if (dist >= PANA_MARGINE) continue;
    const brut = dist / PANA_MARGINE;
    const t = brut * brut * (3 - 2 * brut); // smoothstep
    const i = (y * LUCRU + x) * iArt.channels + 3;
    dArt[i] = Math.round(dArt[i] * t);
  }
}

const artworkDrept = await sharp(dArt, {
  raw: { width: LUCRU, height: LUCRU, channels: iArt.channels },
})
  .png()
  .toBuffer();

const inclinat = await sharp(artworkDrept)
  .affine(
    [
      [AXA_X[0] * scara, AXA_Y[0] * scara],
      [AXA_X[1] * scara, AXA_Y[1] * scara],
    ],
    { background: { r: 0, g: 0, b: 0, alpha: 0 }, interpolator: "bicubic" },
  )
  .ensureAlpha()
  .toBuffer();

// Opacitatea se aplică pe canalul alfa: `composite` nu are opțiune de opacitate.
const { data: dInc, info: iInc } = await sharp(inclinat)
  .raw()
  .toBuffer({ resolveWithObject: true });
for (let i = 3; i < dInc.length; i += iInc.channels) {
  dInc[i] = Math.round(dInc[i] * OPACITATE);
}
const decal = await sharp(dInc, {
  raw: { width: iInc.width, height: iInc.height, channels: iInc.channels },
})
  .png()
  .toBuffer();

// Transformarea e liniară, deci centrul pătratului ajunge în centrul
// paralelogramului — putem așeza rezultatul centrat pe `CENTRU`.
const octeti = await sharp(masaCurata)
  .composite([
    {
      input: decal,
      left: Math.round(CENTRU[0] - iInc.width / 2),
      top: Math.round(CENTRU[1] - iInc.height / 2),
    },
  ])
  .webp({ quality: 82, alphaQuality: 90, effort: 6 })
  .toBuffer();

await sharp(octeti).toFile(DESTINATIE);
console.log(
  `scris ${DESTINATIE} — ${(octeti.length / 1024).toFixed(0)} KB, ` +
    `artwork ${iInc.width}×${iInc.height} px pe blat`,
);
