// Compune imaginile de categorie care folosesc fotografii reale, nu ilustrațiile
// generate de `genereaza-imagini.mjs`.
//
//   node scripts/imagini-categorii-foto.mjs
//
// Formatul este cel al celorlalte categorii — 1200 × 800 px (3:2), fundal
// #f0ede6 — ca `CategoryCard` să le încadreze la fel, fără decupare.
//
// Fișierele de ieșire au sufixul `-foto`: pe cele fără sufix le regenerează
// `npm run imagini`, deci fotografiile ar fi fost șterse la următoarea rulare.

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { MARCA, latimeText, svgMarca } from "./marca.mjs";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");

// Cadrul implicit este cel al imaginilor de categorie. Fiecare sursă îl poate
// schimba prin `cadru`, pentru că imaginile de produs sunt pătrate, 900 × 900.
// Variabilele se rescriu la fiecare pas al buclei de la finalul fișierului.
let LATIME = 1200;
let INALTIME = 800;
/** --color-chalk-100, fundalul folosit de toate imaginile de categorie. */
const FUNDAL = [240, 237, 230];
const FUNDAL_CSS = "#f0ede6";

const surse = [
  {
    slug: "mese",
    fisiere: ["masa-armwrestling-sursa.png"],
    // Fotografia e pătrată, cadrul e 3:2, deci se încadrează după înălțime și
    // nu poate umple lățimea fără să fie tăiată. 92% lasă o margine de aer.
    proportie: 0.92,
    fundalSursa: null, // deja transparentă
  },
  {
    slug: "manere",
    fisiere: ["manere-sursa.png"],
    proportie: 0.92,
    // Fotografia vine pe un gri rece uniform. Nu îl decupăm, ci îl deplasăm
    // spre culoarea cadrului: o mască dură ar lăsa halouri pe umbrele difuze
    // și pe marginile cromate.
    fundalSursa: [243, 244, 246],
  },
  {
    slug: "antrenament",
    fisiere: ["antrenament-sursa.jpg"],
    proportie: 0.92,
    fundalSursa: [255, 255, 255],
  },
  {
    slug: "protectie",
    fisiere: ["protectie-a-sursa.jpg", "protectie-b-sursa.jpg"],
    fundalSursa: [255, 255, 255],
    // DECIZIE: cele două subiecte sunt scalate la aceeași ARIE, nu la aceeași
    // înălțime. Cureaua e portret (0,70), chingile sunt pătrate (1,00) — pe
    // înălțime egală cureaua ar fi părut mult mai mică decât vecina ei.
    arieSubiect: 250000,
  },
  {
    slug: "imbracaminte",
    fisiere: ["maiou-sursa.jpg"],
    proportie: 0.92,
    fundalSursa: [255, 255, 255],
    // Suprapunerile se aplică DUPĂ recolorarea fundalului. Invers, zonele albe
    // din interiorul lor ar fi intrat sub pragul măștii și ar fi virat spre crem.
    // Coordonatele sunt în sistemul sursei (640 × 640), citite de pe o grilă.
    suprapuneri: [
      {
        // Emblema federației, pe câmpul roșu curat de sub banda „WRESTLING".
        fisier: "fnsarm-logo.jpg",
        centru: [327, 330],
        marime: 90,
        forma: "cerc",
        // La 0,92 inelul albastru se amesteca cu roșul de dedesubt și ieșea
        // închis, aproape negru. La 0,97 culorile rămân corecte, iar senzația de
        // imprimeu vine din marginea tăiată, nu din transparență.
        opacitate: 0.97,
      },
      {
        // Artwork-ul ARMARCU, sub emblemă. Rămâne pătrat: tăiat pe cerc, i s-ar
        // reteza wordmark-ul, care iese lateral din emblema circulară.
        fisier: "armarcu-artwork.png",
        centru: [327, 447],
        marime: 100,
        forma: "patrat",
        opacitate: 0.97,
      },
    ],
  },
  {
    slug: "recuperare",
    fisiere: ["recuperare-sursa.png"],
    proportie: 0.86,
    fundalSursa: [255, 255, 255],
    // Borcanul e alb pe fundal alb. Testul global de culoare i-ar dizolva
    // capacul și corpul odată cu fundalul, deci aici mergem pe umplere din
    // margini, care se oprește la conturul obiectului.
    prinUmplere: true,
    // Sursa are margini albe late, care ar fi lăsat borcanul mic în cadru.
    taieMargini: true,
  },
  {
    // Fotografie reală pentru „Mâner pronație Pronator P1", în locul ilustrației
    // generate. Cadru pătrat, ca toate imaginile de produs.
    slug: "pronator-p1",
    cadru: [900, 900],
    iesire: "produse/pronator-p1-foto.webp",
    fisiere: ["pronator-sursa.jpg"],
    proportie: 0.84,
    fundalSursa: [255, 255, 255],
    taieMargini: true,
  },
];

/** Cât de departe e pixelul de culoarea de fundal, pe cel mai divergent canal. */
function distanta(px, i, fundal) {
  return Math.max(
    Math.abs(px[i] - fundal[0]),
    Math.abs(px[i + 1] - fundal[1]),
    Math.abs(px[i + 2] - fundal[2]),
  );
}

/**
 * Recolorare pentru fotografiile în care produsul are aceeași culoare ca
 * fundalul — aici, un borcan alb pe alb. Testul global de culoare ar dizolva
 * obiectul odată cu fundalul, așa că pornim o umplere din marginile cadrului:
 * se recolorează doar pixelii deschiși LEGAȚI de margine, iar conturul
 * borcanului oprește înaintarea. Albul dinăuntrul borcanului rămâne alb.
 */
async function recoloreazaPrinUmplere(cale, fundalSursa) {
  const { data, info } = await sharp(cale)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;

  const PRAG = 12;
  const esteFundal = (i) => distanta(data, i, fundalSursa) <= PRAG;

  const masca = new Uint8Array(w * h);
  const coada = [];
  const adauga = (x, y) => {
    const p = y * w + x;
    if (masca[p] || !esteFundal(p * c)) return;
    masca[p] = 1;
    coada.push(p);
  };

  for (let x = 0; x < w; x++) {
    adauga(x, 0);
    adauga(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    adauga(0, y);
    adauga(w - 1, y);
  }

  for (let k = 0; k < coada.length; k++) {
    const p = coada[k];
    const x = p % w;
    const y = (p - x) / w;
    if (x > 0) adauga(x - 1, y);
    if (x < w - 1) adauga(x + 1, y);
    if (y > 0) adauga(x, y - 1);
    if (y < h - 1) adauga(x, y + 1);
  }

  // Margine înmuiată pe 2 px, ca tranziția să nu iasă tăiată cu cuțitul.
  const RAZA = 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = y * w + x;
      if (!masca[p]) continue;
      let vecini = 0;
      let total = 0;
      for (let dy = -RAZA; dy <= RAZA; dy++) {
        for (let dx = -RAZA; dx <= RAZA; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          total++;
          if (masca[ny * w + nx]) vecini++;
        }
      }
      const t = vecini / total;
      const i = p * c;
      for (let ch = 0; ch < 3; ch++) {
        data[i + ch] = Math.round(data[i + ch] * (1 - t) + FUNDAL[ch] * t);
      }
    }
  }

  return sharp(data, { raw: { width: w, height: h, channels: c } })
    .png()
    .toBuffer();
}

/** Recolorează fundalul sursei către culoarea cadrului, cu tranziție lină. */
async function recoloreazaFundalul(cale, fundalSursa) {
  const { data, info } = await sharp(cale)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const PRAG = 26;
  for (let i = 0; i < data.length; i += info.channels) {
    const d = distanta(data, i, fundalSursa);
    if (d >= PRAG) continue;
    const brut = 1 - d / PRAG;
    const t = brut * brut * (3 - 2 * brut); // smoothstep
    for (let c = 0; c < 3; c++) {
      data[i + c] = Math.round(data[i + c] * (1 - t) + FUNDAL[c] * t);
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png()
    .toBuffer();
}

/**
 * Aplică imprimeurile pe articol. Marginile sunt înmuiate în ambele forme, ca la
 * mărimea mică la care sunt puse să nu iasă contur zimțat:
 *   `cerc`   — mască circulară, pentru embleme rotunde;
 *   `patrat` — marginile se sting spre transparent pe ultimii 10% din latură,
 *              pentru grafică dreptunghiulară care ar fi retezată de un cerc.
 */
async function aplicaSuprapuneri(intrare, suprapuneri) {
  const straturi = [];

  for (const supra of suprapuneri) {
    const { marime: D, centru, opacitate, forma } = supra;
    const cale = join(RADACINA, "assets", supra.fisier);

    const { data, info } = await sharp(cale)
      .resize(D, D, { fit: "fill" })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const raza = D / 2;
    const pana = Math.max(2, Math.round(D * 0.1));
    for (let y = 0; y < D; y++) {
      for (let x = 0; x < D; x++) {
        let acoperire;
        if (forma === "cerc") {
          const d = Math.hypot(x + 0.5 - raza, y + 0.5 - raza);
          acoperire = Math.min(1, Math.max(0, raza - d));
        } else {
          const dist = Math.min(x, y, D - 1 - x, D - 1 - y);
          const brut = Math.min(1, dist / pana);
          acoperire = brut * brut * (3 - 2 * brut); // smoothstep
        }
        const i = (y * D + x) * info.channels + 3;
        data[i] = Math.round(data[i] * acoperire * opacitate);
      }
    }

    const imprimeu = await sharp(data, {
      raw: { width: D, height: D, channels: info.channels },
    })
      .png()
      .toBuffer();

    straturi.push({
      input: imprimeu,
      left: Math.round(centru[0] - raza),
      top: Math.round(centru[1] - raza),
    });
  }

  return sharp(intrare).composite(straturi).png().toBuffer();
}

async function pregatesteSursa(sursa, fisier) {
  const cale = join(RADACINA, "assets", fisier);
  let rezultat = cale;
  if (sursa.fundalSursa) {
    rezultat = sursa.prinUmplere
      ? await recoloreazaPrinUmplere(cale, sursa.fundalSursa)
      : await recoloreazaFundalul(cale, sursa.fundalSursa);
  }
  // Marginile albe rămase în jurul subiectului nu aduc nimic și micșorează
  // obiectul în cadru, așa că le tăiem la culoarea fundalului.
  if (sursa.taieMargini) {
    rezultat = await sharp(rezultat)
      .trim({ background: FUNDAL_CSS, threshold: 8 })
      .png()
      .toBuffer();
  }
  return sursa.suprapuneri
    ? aplicaSuprapuneri(rezultat, sursa.suprapuneri)
    : rezultat;
}

/** Un singur subiect, centrat, ocupând `proportie` din înălțimea cadrului. */
async function unSubiect(sursa) {
  const intrare = await pregatesteSursa(sursa, sursa.fisiere[0]);
  const inaltimeSubiect = Math.round(INALTIME * sursa.proportie);
  const subiect = await sharp(intrare)
    .resize(LATIME, inaltimeSubiect, { fit: "inside" })
    .toBuffer();
  return [{ input: subiect, gravity: "centre" }];
}

/** Două subiecte alăturate, scalate la arii egale și centrate pe verticală. */
async function doiSubiecti(sursa) {
  const jumatate = LATIME / 2;
  const straturi = [];

  for (const [index, fisier] of sursa.fisiere.entries()) {
    const intrare = await pregatesteSursa(sursa, fisier);
    const { width, height } = await sharp(intrare).metadata();
    const raport = width / height;

    // arie = l x h, cu l = raport x h  =>  h = sqrt(arie / raport)
    let h = Math.round(Math.sqrt(sursa.arieSubiect / raport));
    let l = Math.round(raport * h);

    // Nu depăși jumătatea de cadru, cu o margine de aer de 10%.
    const maxL = Math.round(jumatate * 0.9);
    const maxH = Math.round(INALTIME * 0.9);
    const scara = Math.min(1, maxL / l, maxH / h);
    l = Math.round(l * scara);
    h = Math.round(h * scara);

    const subiect = await sharp(intrare).resize(l, h, { fit: "inside" }).toBuffer();
    straturi.push({
      input: subiect,
      left: Math.round(jumatate * index + (jumatate - l) / 2),
      top: Math.round((INALTIME - h) / 2),
    });
  }

  return straturi;
}

// ── Marca, pusă doar unde chiar încape ──────────────────────────────────────
// Fotografiile reale au subiecte de forme diferite: la unele rămâne bandă
// liberă jos, la altele obiectul coboară până la marginea cadrului. În loc să
// forțăm marca peste desen, căutăm o zonă de fundal curat și, dacă nu există,
// lăsăm imaginea nemarcată.

const INALTIME_MARCA = 34;
const PADDING = 26;
const LATIME_MARCA = Math.ceil(latimeText(MARCA, INALTIME_MARCA));
/** Cât de mult poate devia un pixel de la fundal ca zona să treacă drept liberă. */
const TOLERANTA = 6;

/** Colțurile și centrele de sus/jos, în ordinea în care le preferăm. */
function candidati() {
  const l = LATIME_MARCA;
  const h = INALTIME_MARCA;
  const centruX = (LATIME - l) / 2;
  const jos = INALTIME - PADDING - h;
  const sus = PADDING;
  return [
    { nume: "jos-centru", left: centruX, top: jos },
    { nume: "jos-stânga", left: PADDING, top: jos },
    { nume: "jos-dreapta", left: LATIME - PADDING - l, top: jos },
    { nume: "sus-centru", left: centruX, top: sus },
    { nume: "sus-stânga", left: PADDING, top: sus },
    { nume: "sus-dreapta", left: LATIME - PADDING - l, top: sus },
  ].map((c) => ({ ...c, left: Math.round(c.left), top: Math.round(c.top) }));
}

/** True dacă tot dreptunghiul este fundal curat, cu o margine de siguranță. */
function zonaLibera(pixeli, canale, zona) {
  const margine = 10;
  const x0 = Math.max(0, zona.left - margine);
  const y0 = Math.max(0, zona.top - margine);
  const x1 = Math.min(LATIME, zona.left + LATIME_MARCA + margine);
  const y1 = Math.min(INALTIME, zona.top + INALTIME_MARCA + margine);

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * LATIME + x) * canale;
      if (distanta(pixeli, i, FUNDAL) > TOLERANTA) return false;
    }
  }
  return true;
}

async function puneMarca(compus) {
  const { data, info } = await sharp(compus)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const loc = candidati().find((c) => zonaLibera(data, info.channels, c));
  if (!loc) return { imagine: compus, loc: null };

  const svg = svgMarca({
    latime: LATIME,
    inaltime: INALTIME,
    cx: loc.left + LATIME_MARCA / 2,
    y: loc.top,
    inaltimeMarca: INALTIME_MARCA,
    culoare: "#14181c",
    opacitate: 0.5,
  });

  const imagine = await sharp(compus)
    .composite([{ input: Buffer.from(svg) }])
    .png()
    .toBuffer();
  return { imagine, loc: loc.nume };
}

let total = 0;
for (const sursa of surse) {
  [LATIME, INALTIME] = sursa.cadru ?? [1200, 800];

  const straturi =
    sursa.fisiere.length > 1 ? await doiSubiecti(sursa) : await unSubiect(sursa);

  // PNG intermediar, ca detecția zonei libere să lucreze pe pixeli exacți, nu
  // pe cei ușor deplasați de compresia WebP.
  const compus = await sharp({
    create: {
      width: LATIME,
      height: INALTIME,
      channels: 4,
      background: FUNDAL_CSS,
    },
  })
    .composite(straturi)
    .flatten({ background: FUNDAL_CSS })
    .png()
    .toBuffer();

  const { imagine, loc } = await puneMarca(compus);
  const octeti = await sharp(imagine).webp({ quality: 90 }).toBuffer();

  const destinatie = join(
    RADACINA,
    "public",
    ...(sursa.iesire ?? `categorii/${sursa.slug}-foto.webp`).split("/"),
  );
  await sharp(octeti).toFile(destinatie);
  total += octeti.length;
  console.log(
    `${sursa.slug}: ${(octeti.length / 1024).toFixed(0)} KB` +
      (sursa.fisiere.length > 1 ? `, ${sursa.fisiere.length} subiecte` : "") +
      (loc ? `, marcă ${loc}` : `, FĂRĂ marcă (nu încape)`),
  );
}
console.log(`\n${surse.length} imagini, ${(total / 1024).toFixed(0)} KB în total.`);
