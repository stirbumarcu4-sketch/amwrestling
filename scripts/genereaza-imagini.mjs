// Generează ilustrațiile de produs, de categorie și de articol ca fișiere WebP
// locale, pornind de la desene vectoriale scrise mai jos.
//
//   npm run imagini
//
// Desenele sunt schematice, în stil de desen tehnic, fără text — așa nu depind
// de fonturile instalate pe mașina care rulează scriptul.
//
// Tema cromatică este roșie: corpul produselor stă în familia roșu, diferențiat
// prin ton de la o piesă la alta, iar fundalul rămâne neutru, ca produsul să dea
// culoarea. Neutrele — crom, oțel, cretă — apar doar unde materialul chiar le
// cere, altfel desenul și-ar pierde lizibilitatea.

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { MARCA, scrieText } from "./marca.mjs";

const RADACINA = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(RADACINA, "public");

// Fundal, contur și adnotare — preluate din tokenii din globals.css.
const P = {
  fundal: "#f0ede6",
  fundalAlt: "#e8e4dc",
  linie: "#14181c",
  cota: "#606a74",
  grila: "#dcd7cd",
};

// Materiale. Tema este roșie: corpul produselor stă în familia roșu, iar
// neutrele — crom, oțel, cretă — rămân doar acolo unde materialul chiar le
// cere, ca desenul să nu-și piardă lizibilitatea.
const M = {
  // familia roșu — corpul produselor
  rosuAprins: "#c0392b",
  rosu: "#b23a2c",
  rosuMediu: "#a6473a",
  rosuInchis: "#8c2b20",
  rosuBrun: "#77342a",
  caramida: "#9e5341",
  bordo: "#6f2b33",
  nisipCald: "#e3cbc0",

  // piele tăbăcită
  piele: "#a9603a",
  pieleInchis: "#7a3a22",

  // neutre, păstrate doar unde materialul chiar le cere
  crom: "#e6ecf0",
  otel: "#bdc6cd",
  otelInchis: "#8d97a1",
  negru: "#33292a",
  negruMoale: "#4d3c3a",
  griTextil: "#9c8e8b",
  creta: "#fbfaf7",
  spuma: "#eddfd8",
  alama: "#bf8639",
  lemn: "#c08a5a",
  canepa: "#c08a5a",
  neopren: "#2b2224",

  // benzi de rezistență: cinci nuanțe de roșu, de la închis la deschis
  latex: ["#8c2b20", "#a6382c", "#c0392b", "#cf6553", "#dd8b7c"],
};

// ── Primitive ───────────────────────────────────────────────────────────────

const atr = (o = {}) =>
  `fill="${o.f ?? "none"}" stroke="${o.s ?? P.linie}" stroke-width="${o.w ?? 7}" stroke-linecap="round" stroke-linejoin="round"`;

const rect = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 0}" ${atr(o)}/>`;
const circ = (cx, cy, r, o = {}) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" ${atr(o)}/>`;
const elip = (cx, cy, rx, ry, o = {}) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${atr(o)}/>`;
const lin = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${atr(o)}/>`;
const cale = (d, o = {}) => `<path d="${d}" ${atr(o)}/>`;
const grup = (continut, transform) =>
  `<g transform="${transform}">${continut}</g>`;

/** Inel de prindere cromat, comun aproape tuturor mânerelor. */
const inel = (cx, cy, r = 28) =>
  circ(cx, cy, r, { w: 11, s: P.linie }) + circ(cx, cy, r, { w: 5, s: M.crom });

/** Molatare: liniuțe scurte pe zona de priză. */
function molatare(x, y, latime, numar = 4, vertical = true) {
  const pas = latime / (numar + 1);
  return Array.from({ length: numar }, (_, i) =>
    vertical
      ? lin(x + pas * (i + 1), y, x + pas * (i + 1), y + 30, {
          w: 4,
          s: M.otelInchis,
        })
      : lin(x, y + pas * (i + 1), x + 30, y + pas * (i + 1), {
          w: 4,
          s: M.otelInchis,
        }),
  ).join("");
}

/** Carabinieră cu clapetă și manșon filetat. */
function carabiniera(cx, cy, unghi = 0) {
  return grup(
    [
      elip(0, 0, 30, 58, { w: 13, s: P.linie }),
      elip(0, 0, 30, 58, { w: 6, s: M.crom }),
      lin(27, -38, 27, 34, { w: 9, s: P.linie }),
      rect(16, -12, 23, 36, { f: M.otelInchis, r: 4, w: 5 }),
    ].join(""),
    `translate(${cx},${cy}) rotate(${unghi})`,
  );
}

/** Hașură diagonală, pentru perete. */
function hasura(x, y, w, h, pas = 26) {
  const linii = [];
  for (let i = -h; i < w; i += pas) {
    linii.push(lin(x + i, y + h, x + i + h, y, { w: 3, s: M.otelInchis }));
  }
  return `<g clip-path="url(#taie)">${linii.join("")}</g>`;
}

// ── Marca ───────────────────────────────────────────────────────────────────
// Literele vectoriale stau în `marca.mjs`, ca să fie folosite de același cod și
// la fotografiile reale din `imagini-categorii-foto.mjs`.
/**
 * Marca de pe fiecare imagine de produs: „ARMARCU" cu literă groasă, jos,
 * centrată. Se compune PESTE desen, nu în fundal, ca să rămână vizibilă și pe
 * varianta 3, unde obiectul umple tot cadrul.
 *
 * Opacitatea de 0,5 o ține lizibilă și pe hârtia deschisă, și peste trasee.
 */
function marcaProdus(latime, inaltime) {
  const inaltimeMarca = Math.round(Math.min(latime, inaltime) * 0.045);
  const y = inaltime - Math.round(inaltimeMarca * 1.05) - inaltimeMarca;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${latime}" height="${inaltime}" viewBox="0 0 ${latime} ${inaltime}"><g opacity="0.5">${scrieText(
    MARCA,
    latime / 2,
    y,
    inaltimeMarca,
    P.linie,
    Math.max(5, Math.round(inaltimeMarca * 0.22)),
  )}</g></svg>`;
}

/** Cotă tehnică fără text: linie cu capete în T. */
function cota(x1, x2, y) {
  return [
    lin(x1, y, x2, y, { w: 3, s: P.cota }),
    lin(x1, y - 14, x1, y + 14, { w: 3, s: P.cota }),
    lin(x2, y - 14, x2, y + 14, { w: 3, s: P.cota }),
  ].join("");
}

// ── Desene de produs, în spațiu 900 × 900 ───────────────────────────────────

const desene = {
  // ═══ MESE & SUPRAFEȚE ═══
  "titan-pro": () =>
    [
      // Picioarele - crom
      rect(388, 288, 26, 116, { f: M.crom, r: 13, w: 6 }),
      rect(486, 288, 26, 116, { f: M.crom, r: 13, w: 6 }),
      // Perne de cot - stânga
      rect(236, 350, 116, 34, { f: M.rosuAprins, r: 8, w: 6 }),
      rect(236, 378, 116, 22, { f: M.spuma, r: 6, w: 5 }),
      lin(252, 350, 252, 400, { w: 3, s: M.rosuInchis }),
      lin(336, 350, 336, 400, { w: 3, s: M.rosuInchis }),
      // Perne de cot - dreapta
      rect(548, 350, 116, 34, { f: M.rosuAprins, r: 8, w: 6 }),
      rect(548, 378, 116, 22, { f: M.spuma, r: 6, w: 5 }),
      lin(564, 350, 564, 400, { w: 3, s: M.rosuInchis }),
      lin(648, 350, 648, 400, { w: 3, s: M.rosuInchis }),
      // Blat - negru intens
      rect(168, 398, 564, 38, { f: M.negru, w: 8, s: M.otelInchis }),
      // Linie de separare pe blat (centru)
      lin(450, 398, 450, 436, { w: 2, s: M.crom }),
      // Cadrul vertical
      rect(200, 436, 38, 300, { f: M.negru, w: 6, s: M.otelInchis }),
      rect(662, 436, 38, 300, { f: M.negru, w: 6, s: M.otelInchis }),
      // Bară orizontală jos
      rect(238, 612, 424, 24, { f: M.negru, w: 5, s: M.otelInchis }),
      // Pini de mână - mai mari și mai evidenți
      circ(280, 467, 18, { f: M.crom, w: 7, s: M.otelInchis }),
      rect(262, 485, 36, 180, { f: M.crom, r: 18, w: 6, s: M.otelInchis }),
      // Pin dreapta
      circ(620, 467, 18, { f: M.crom, w: 7, s: M.otelInchis }),
      rect(602, 485, 36, 180, { f: M.crom, r: 18, w: 6, s: M.otelInchis }),
      // Picior stânga jos
      rect(186, 736, 66, 20, { f: M.otelInchis, r: 6, w: 5 }),
      // Picior dreapta jos
      rect(648, 736, 66, 20, { f: M.otelInchis, r: 6, w: 5 }),
      // Umbre și detalii de profunzime
      rect(169, 435, 562, 2, { f: M.otelInchis, s: M.negru, w: 2 }),
    ].join(""),

  "forge-club": () =>
    [
      rect(190, 396, 520, 22, { f: M.negru }),
      rect(190, 418, 520, 26, { f: M.lemn }),
      rect(256, 358, 108, 40, { f: M.negru, r: 8, w: 6 }),
      rect(536, 358, 108, 40, { f: M.negru, r: 8, w: 6 }),
      rect(224, 444, 30, 288, { f: M.rosuInchis }),
      rect(646, 444, 30, 288, { f: M.rosuInchis }),
      lin(254, 480, 646, 690, { w: 14, s: M.rosuInchis }),
      lin(254, 690, 646, 480, { w: 14, s: M.rosuInchis }),
      rect(206, 732, 66, 18, { f: M.otelInchis, r: 6, w: 5 }),
      rect(628, 732, 66, 18, { f: M.otelInchis, r: 6, w: 5 }),
    ].join(""),

  "wall-arm": () =>
    [
      `<defs><clipPath id="taie"><rect x="150" y="180" width="72" height="560"/></clipPath></defs>`,
      hasura(150, 180, 72, 560),
      lin(222, 180, 222, 740, { w: 10 }),
      ...[280, 400, 520, 640].map((y) =>
        rect(196, y - 9, 44, 18, { f: M.crom, r: 4, w: 4 }),
      ),
      rect(240, 360, 380, 30, { f: M.rosu }),
      rect(300, 322, 100, 38, { f: M.negru, r: 8, w: 6 }),
      lin(252, 390, 252, 470, { w: 12, s: M.rosu }),
      lin(252, 470, 470, 392, { w: 12, s: M.rosu }),
      circ(252, 470, 16, { f: M.crom, w: 6 }),
      circ(470, 392, 14, { f: M.crom, w: 5 }),
    ].join(""),

  "grip-pad": () =>
    [
      rect(196, 296, 246, 246, { f: M.rosuAprins, r: 14 }),
      rect(196, 506, 246, 36, { f: M.spuma, r: 6, w: 5 }),
      rect(252, 546, 134, 26, { f: M.griTextil, r: 4, w: 5 }),
      rect(452, 372, 246, 246, { f: M.rosuMediu, r: 14 }),
      rect(478, 398, 194, 194, { w: 4, s: M.crom, r: 8 }),
      lin(500, 440, 650, 440, { w: 4, s: M.crom }),
      lin(500, 550, 650, 550, { w: 4, s: M.crom }),
    ].join(""),

  "pini-mana": () =>
    [
      rect(328, 236, 56, 336, { f: M.crom, r: 28 }),
      lin(348, 290, 348, 520, { w: 5, s: M.otelInchis }),
      rect(310, 572, 92, 30, { f: M.negru, r: 5 }),
      ...[0, 1, 2].map((i) =>
        lin(316, 610 + i * 12, 396, 610 + i * 12, { w: 5, s: M.otelInchis }),
      ),
      rect(500, 236, 56, 336, { f: M.crom, r: 28 }),
      lin(520, 290, 520, 520, { w: 5, s: M.otelInchis }),
      rect(482, 572, 92, 30, { f: M.negru, r: 5 }),
      ...[0, 1, 2].map((i) =>
        lin(488, 610 + i * 12, 568, 610 + i * 12, { w: 5, s: M.otelInchis }),
      ),
    ].join(""),

  "husa-masa": () =>
    [
      rect(286, 620, 28, 110, { f: M.negru }),
      rect(586, 620, 28, 110, { f: M.negru }),
      cale("M 200 372 Q 450 336 700 372 L 712 620 Q 450 664 188 620 Z", {
        f: M.bordo,
      }),
      cale("M 200 372 Q 450 336 700 372", { w: 7 }),
      lin(320, 356, 306, 634, { w: 4, s: M.griTextil }),
      lin(580, 356, 594, 634, { w: 4, s: M.griTextil }),
      cale("M 188 606 Q 450 650 712 606", { w: 6, s: M.nisipCald }),
      cale("M 400 348 Q 450 316 500 348", { w: 9, s: M.nisipCald }),
    ].join(""),

  // ═══ MÂNERE & ATAȘAMENTE ═══
  "pronator-p1": () =>
    [
      inel(360, 236),
      lin(360, 264, 360, 352, { w: 9 }),
      rect(330, 352, 60, 214, { f: M.rosu, r: 12 }),
      rect(356, 512, 250, 60, { f: M.rosu, r: 30 }),
      molatare(430, 527, 150, 4),
      circ(360, 542, 12, { f: M.crom, w: 4 }),
    ].join(""),

  "cup-master": () =>
    [
      inel(486, 260),
      lin(486, 288, 486, 396, { w: 9 }),
      cale("M 486 396 L 486 452", { w: 12, s: M.rosuInchis }),
      rect(310, 424, 200, 60, { f: M.rosuInchis, r: 30 }),
      molatare(340, 439, 140, 4),
      cale("M 316 428 L 340 416 L 504 416", { w: 5, s: M.crom }),
    ].join(""),

  "hammer-h2": () =>
    [
      inel(450, 226),
      lin(450, 254, 450, 306, { w: 9 }),
      rect(316, 306, 268, 48, { f: M.caramida, r: 10 }),
      rect(418, 354, 64, 258, { f: M.caramida, r: 32 }),
      molatare(434, 400, 200, 4, false),
    ].join(""),

  "free-spin": () =>
    [
      inel(450, 214),
      cale("M 450 242 L 450 288 M 320 322 L 450 288 L 580 322", { w: 9 }),
      rect(276, 322, 348, 78, { f: M.negru, r: 39 }),
      circ(300, 361, 26, { f: M.crom, w: 7 }),
      circ(600, 361, 26, { f: M.crom, w: 7 }),
      circ(300, 361, 10, { f: M.otelInchis, w: 4 }),
      circ(600, 361, 10, { f: M.otelInchis, w: 4 }),
      cale("M 352 486 A 108 108 0 1 0 548 486", { w: 6, s: M.rosu }),
      cale("M 548 486 L 566 448 M 548 486 L 586 500", { w: 6, s: M.rosu }),
    ].join(""),

  "devon-60": () =>
    [
      rect(140, 398, 620, 52, { f: M.rosu, r: 26 }),
      molatare(170, 410, 120, 3),
      molatare(610, 410, 120, 3),
      rect(406, 356, 88, 52, { f: M.crom, r: 8 }),
      inel(450, 300),
      lin(450, 328, 450, 358, { w: 9 }),
      ...[290, 370, 450, 530, 610].map((x) =>
        circ(x, 424, 11, { f: P.fundal, w: 5 }),
      ),
    ].join(""),

  "strap-grip": () =>
    [
      inel(450, 196),
      cale("M 412 224 L 412 566 Q 450 606 488 566 L 488 224", {
        f: M.rosuBrun,
        w: 7,
      }),
      lin(424, 250, 424, 566, { w: 3, s: M.nisipCald }),
      lin(476, 250, 476, 566, { w: 3, s: M.nisipCald }),
      rect(396, 372, 108, 76, { f: M.alama, r: 6 }),
      lin(396, 410, 504, 410, { w: 7 }),
      cale("M 488 452 L 566 620 L 620 596 L 542 430", { f: M.rosuBrun, w: 6 }),
    ].join(""),

  "arsenal-kit": () =>
    [
      rect(252, 250, 48, 200, { f: M.rosu, r: 24 }),
      rect(340, 292, 48, 158, { f: M.rosuInchis, r: 24 }),
      rect(512, 292, 48, 158, { f: M.caramida, r: 24 }),
      rect(600, 250, 48, 200, { f: M.negru, r: 24 }),
      ...[276, 364, 536, 624].map((x) => circ(x, 236, 17, { w: 7 })),
      cale("M 186 434 L 714 434 L 690 700 L 210 700 Z", { f: M.bordo }),
      cale("M 336 434 Q 336 366 450 366 Q 564 366 564 434", {
        w: 9,
        s: M.nisipCald,
      }),
      lin(210, 556, 690, 556, { w: 5, s: M.griTextil }),
    ].join(""),

  "adaptor-rotativ": () =>
    [
      inel(450, 232, 32),
      rect(410, 292, 80, 208, { f: M.otel, r: 16 }),
      circ(450, 396, 36, { f: M.otelInchis, w: 6 }),
      circ(450, 396, 14, { f: M.crom, w: 5 }),
      lin(410, 330, 490, 330, { w: 4, s: M.otelInchis }),
      lin(410, 462, 490, 462, { w: 4, s: M.otelInchis }),
      inel(450, 560, 32),
      lin(450, 264, 450, 292, { w: 9 }),
      lin(450, 500, 450, 528, { w: 9 }),
    ].join(""),

  // ═══ TRACȚIUNE & FORȚĂ ═══
  "pulley-pro": () =>
    [
      rect(172, 190, 48, 470, { f: M.rosuInchis }),
      ...[240, 320, 400, 480, 560, 630].map((y) =>
        circ(196, y, 10, { f: P.fundal, w: 4 }),
      ),
      cale("M 220 254 L 268 254 M 318 306 L 318 414 L 512 414", {
        w: 7,
        s: M.otelInchis,
      }),
      cale("M 616 414 L 664 414 L 664 552", { w: 7, s: M.otelInchis }),
      circ(318, 254, 54, { f: M.crom, w: 8 }),
      circ(318, 254, 18, { f: M.negru, w: 5 }),
      circ(564, 414, 54, { f: M.crom, w: 8 }),
      circ(564, 414, 18, { f: M.negru, w: 5 }),
      ...[0, 1, 2].map((i) =>
        rect(614, 552 + i * 36, 100, 28, { f: M.negru, r: 6 }),
      ),
    ].join(""),

  "cablu-otel": () =>
    [
      elip(424, 452, 138, 122, { w: 26, s: M.rosu }),
      elip(472, 452, 138, 122, { w: 26, s: M.rosu }),
      elip(424, 452, 138, 122, { w: 8, s: M.otelInchis }),
      elip(472, 452, 138, 122, { w: 8, s: M.otelInchis }),
      cale("M 400 336 L 322 262", { w: 22, s: M.rosu }),
      cale("M 400 336 L 322 262", { w: 7, s: M.otelInchis }),
      rect(330, 250, 40, 30, { f: M.otel, r: 4, w: 5 }),
      cale("M 500 570 L 578 644", { w: 22, s: M.rosu }),
      cale("M 500 570 L 578 644", { w: 7, s: M.otelInchis }),
      rect(552, 626, 40, 30, { f: M.otel, r: 4, w: 5 }),
      carabiniera(268, 208, -38),
      carabiniera(632, 698, -38),
    ].join(""),

  turnbuckle: () =>
    [
      ...[0, 1, 2].map((i) =>
        elip(450, 208 + i * 70, 34, 40, { w: 12, s: M.otel }),
      ),
      ...[0, 1, 2].map((i) =>
        elip(450, 208 + i * 70, 34, 40, { w: 5, s: P.linie }),
      ),
      rect(402, 372, 96, 156, { f: M.negru, r: 10 }),
      rect(430, 340, 40, 40, { f: M.crom, r: 4, w: 5 }),
      rect(430, 520, 40, 40, { f: M.crom, r: 4, w: 5 }),
      ...[0, 1, 2, 3].map((i) =>
        lin(414, 404 + i * 30, 486, 404 + i * 30, { w: 4, s: M.otelInchis }),
      ),
      ...[0, 1, 2].map((i) =>
        elip(450, 596 + i * 70, 34, 40, { w: 12, s: M.otel }),
      ),
      ...[0, 1, 2].map((i) =>
        elip(450, 596 + i * 70, 34, 40, { w: 5, s: P.linie }),
      ),
    ].join(""),

  "roll-force": () =>
    [
      rect(196, 250, 508, 66, { f: M.negru, r: 33 }),
      rect(190, 238, 76, 90, { f: M.otel, r: 12 }),
      rect(634, 238, 76, 90, { f: M.otel, r: 12 }),
      circ(450, 283, 20, { f: M.crom, w: 6 }),
      cale("M 450 316 L 450 556", { w: 12, s: M.rosu }),
      lin(450, 340, 450, 540, { w: 4, s: M.nisipCald }),
      circ(450, 622, 76, { f: M.negru, w: 7 }),
      circ(450, 622, 24, { f: P.fundal, w: 6 }),
    ].join(""),

  "gripper-reglabil": () =>
    [
      cale("M 392 372 L 322 656", { w: 40, s: M.otel }),
      cale("M 508 372 L 578 656", { w: 40, s: M.otel }),
      ...[0, 1, 2, 3, 4].map((i) =>
        lin(366 - i * 12, 440 + i * 46, 404 - i * 12, 440 + i * 46, {
          w: 4,
          s: M.otelInchis,
        }),
      ),
      ...[0, 1, 2, 3, 4].map((i) =>
        lin(496 + i * 12, 440 + i * 46, 534 + i * 12, 440 + i * 46, {
          w: 4,
          s: M.otelInchis,
        }),
      ),
      circ(450, 340, 62, { w: 12, s: M.rosu }),
      circ(450, 340, 42, { w: 9, s: M.otelInchis }),
      circ(450, 340, 22, { f: M.otel, w: 5 }),
      rect(432, 206, 36, 84, { f: M.alama, r: 4 }),
      lin(412, 206, 488, 206, { w: 10, s: M.negru }),
      ...[0, 1, 2, 3].map((i) =>
        lin(436, 230 + i * 16, 464, 230 + i * 16, { w: 3, s: M.pieleInchis }),
      ),
    ].join(""),

  "grippere-set": () => {
    const unul = (culoare) =>
      [
        cale("M 396 380 L 336 620", { w: 34, s: M.otel }),
        cale("M 504 380 L 564 620", { w: 34, s: M.otel }),
        circ(450, 352, 52, { w: 11, s: culoare }),
        circ(450, 352, 30, { f: M.otel, w: 5 }),
      ].join("");
    return [
      grup(unul(M.caramida), "translate(-232,-96) scale(0.68)"),
      grup(unul(M.alama), "translate(-16,20) scale(0.84)"),
      grup(unul(M.rosu), "translate(214,152) scale(1)"),
    ].join("");
  },

  "grip-ball": () =>
    [
      circ(450, 512, 178, { f: M.otelInchis }),
      circ(450, 512, 178, { w: 7 }),
      cale("M 344 400 q 54 34 30 96", { w: 14, s: M.crom }),
      elip(450, 306, 42, 52, { w: 13, s: M.negru }),
      lin(450, 348, 450, 336, { w: 13, s: M.negru }),
      elip(450, 306, 42, 52, { w: 5, s: P.linie }),
    ].join(""),

  "benzi-rezistenta": () =>
    [300, 276, 252, 228, 204]
      .map((latime, i) =>
        rect(450 - latime / 2, 208 + i * 104, latime, 76, {
          r: 38,
          w: 10 + i * 6,
          s: M.latex[i],
        }),
      )
      .join(""),

  "pinch-plate": () =>
    [
      rect(244, 336, 412, 246, { f: M.otel, r: 8 }),
      ...[0, 1, 2, 3, 4].map((i) =>
        lin(276, 376 + i * 44, 624, 376 + i * 44, { w: 3, s: M.otelInchis }),
      ),
      elip(450, 292, 40, 50, { w: 13, s: M.negru }),
      lin(450, 332, 450, 322, { w: 13, s: M.negru }),
      elip(450, 292, 40, 50, { w: 5, s: P.linie }),
    ].join(""),

  "hang-rope": () =>
    [
      rect(196, 226, 508, 34, { f: M.negru, r: 17 }),
      ...[366, 534].map((x) =>
        [
          cale(`M ${x} 260 L ${x} 548`, { w: 30, s: M.canepa }),
          ...[0, 1, 2, 3, 4, 5].map((i) =>
            lin(x - 15, 292 + i * 42, x + 15, 314 + i * 42, {
              w: 4,
              s: M.pieleInchis,
            }),
          ),
          elip(x, 590, 46, 40, { f: M.canepa, w: 7 }),
          lin(x - 30, 578, x + 30, 596, { w: 4, s: M.pieleInchis }),
          lin(x - 30, 600, x + 30, 582, { w: 4, s: M.pieleInchis }),
        ].join(""),
      ),
    ].join(""),

  // ═══ PROTECȚIE & COMPETIȚIE ═══
  "curea-legare": () =>
    [
      rect(196, 396, 490, 96, { f: M.piele, r: 12 }),
      ...[420, 468].map((y) =>
        Array.from({ length: 22 }, (_, i) =>
          lin(216 + i * 21, y, 228 + i * 21, y, { w: 4, s: M.nisipCald }),
        ).join(""),
      ),
      ...[248, 300, 352].map((x) =>
        circ(x, 444, 11, { f: P.fundal, w: 5, s: M.pieleInchis }),
      ),
      rect(614, 366, 104, 156, { w: 13, s: M.alama }),
      lin(666, 366, 666, 522, { w: 9, s: M.alama }),
      lin(666, 444, 762, 444, { w: 9, s: M.alama }),
    ].join(""),

  "strap-trainer": () =>
    [
      // chingă din poliester țesut
      rect(196, 402, 460, 88, { f: M.rosuBrun, r: 6 }),
      ...Array.from({ length: 21 }, (_, i) =>
        lin(216 + i * 21, 410, 216 + i * 21, 482, { w: 3, s: M.caramida }),
      ),
      lin(200, 424, 652, 424, { w: 3, s: M.caramida }),
      lin(200, 468, 652, 468, { w: 3, s: M.caramida }),
      // capăt întărit, cusut în cruce
      rect(208, 414, 58, 64, { w: 5, s: M.nisipCald, r: 4 }),
      lin(208, 414, 266, 478, { w: 3, s: M.nisipCald }),
      lin(266, 414, 208, 478, { w: 3, s: M.nisipCald }),
      // găuri de reglaj
      ...[330, 382, 434].map((x) =>
        circ(x, 446, 11, { f: P.fundal, w: 5, s: M.rosuInchis }),
      ),
      // cataramă din oțel zincat
      rect(596, 372, 104, 148, { w: 13, s: M.otel }),
      lin(648, 372, 648, 520, { w: 9, s: M.otel }),
      lin(648, 446, 744, 446, { w: 9, s: M.otel }),
    ].join(""),

  "bandaje-60": () =>
    [
      circ(392, 434, 152, { f: M.nisipCald }),
      circ(392, 434, 104, { w: 7, s: M.griTextil }),
      circ(392, 434, 56, { f: P.fundal, w: 7 }),
      circ(392, 434, 128, { w: 10, s: M.rosu }),
      cale("M 540 470 L 690 522 L 676 606 L 512 566 Z", { f: M.nisipCald, w: 7 }),
      rect(596, 528, 72, 48, { w: 5, s: M.rosu, r: 4 }),
    ].join(""),

  "bandaje-90": () =>
    [
      circ(372, 420, 184, { f: M.nisipCald }),
      circ(372, 420, 132, { w: 7, s: M.griTextil }),
      circ(372, 420, 74, { f: P.fundal, w: 7 }),
      circ(372, 420, 158, { w: 12, s: M.rosuInchis }),
      cale("M 550 466 L 726 530 L 706 646 L 496 596 Z", { f: M.nisipCald, w: 7 }),
      rect(618, 542, 84, 56, { w: 5, s: M.rosuInchis, r: 4 }),
      circ(292, 636, 44, { w: 8, s: M.griTextil }),
    ].join(""),

  "cotiera-neopren": () =>
    [
      cale("M 336 250 L 564 250 L 604 450 L 564 650 L 336 650 L 296 450 Z", {
        f: M.neopren,
      }),
      lin(336, 296, 564, 296, { w: 5, s: M.rosu }),
      lin(336, 604, 564, 604, { w: 5, s: M.rosu }),
      lin(305, 380, 595, 380, { w: 4, s: M.negruMoale }),
      lin(301, 520, 599, 520, { w: 4, s: M.negruMoale }),
      cale("M 296 450 L 316 450", { w: 10, s: M.otelInchis }),
    ].join(""),

  "creta-bloc": () =>
    [
      cale("M 296 372 L 556 372 L 620 312 L 360 312 Z", { f: M.spuma }),
      rect(296, 372, 260, 204, { f: M.creta }),
      cale("M 556 372 L 620 312 L 620 516 L 556 576 Z", { f: M.nisipCald }),
      ...[
        [244, 622],
        [286, 654],
        [664, 618],
        [706, 650],
        [332, 668],
      ].map(([x, y]) => circ(x, y, 8, { f: M.otelInchis, w: 0 })),
    ].join(""),

  "creta-lichida": () =>
    [
      rect(396, 224, 108, 58, { f: M.rosuInchis, r: 8 }),
      rect(424, 190, 52, 40, { f: M.negru, r: 6 }),
      cale("M 352 282 L 548 282 L 566 646 L 334 646 Z", { f: M.creta }),
      cale("M 344 470 L 556 470 L 566 646 L 334 646 Z", { f: M.spuma }),
      cale("M 352 282 L 548 282 L 566 646 L 334 646 Z", { w: 7 }),
      rect(366, 340, 168, 96, { f: P.fundal, w: 5 }),
      lin(392, 376, 508, 376, { w: 7, s: M.rosuInchis }),
      lin(392, 408, 468, 408, { w: 4, s: M.otelInchis }),
    ].join(""),

  "banda-kinesio": () =>
    [
      circ(396, 424, 168, { f: M.rosuAprins }),
      circ(396, 424, 168, { w: 7 }),
      circ(396, 424, 116, { w: 4, s: M.creta }),
      circ(396, 424, 64, { f: M.creta, w: 7 }),
      cale("M 556 468 L 700 532 L 660 620 L 522 552 Z", { f: M.rosuAprins, w: 7 }),
      lin(556, 512, 682, 570, { w: 4, s: M.creta }),
    ].join(""),

  "table-bag": () =>
    [
      cale("M 186 396 L 714 396 L 692 664 L 208 664 Z", { f: M.bordo }),
      cale("M 336 396 q 0 -78 114 -78 q 114 0 114 78", { w: 9, s: M.nisipCald }),
      lin(186, 426, 714, 426, { w: 6, s: M.crom }),
      ...Array.from({ length: 20 }, (_, i) =>
        lin(206 + i * 26, 420, 206 + i * 26, 432, { w: 3, s: M.negru }),
      ),
      rect(246, 476, 186, 132, { f: M.negru, r: 6, w: 6 }),
      lin(262, 500, 416, 500, { w: 4, s: M.griTextil }),
      rect(520, 490, 148, 108, { w: 5, s: M.griTextil, r: 6 }),
      circ(700, 440, 14, { f: M.rosu, w: 0 }),
    ].join(""),

  // ═══ ÎMBRĂCĂMINTE ═══
  "tricou-chalk": () =>
    [
      cale(
        "M 350 250 L 300 290 L 210 360 L 270 440 L 320 405 L 320 660 L 580 660 L 580 405 L 630 440 L 690 360 L 600 290 L 550 250 Q 450 320 350 250 Z",
        { f: M.nisipCald },
      ),
      cale("M 350 250 Q 450 320 550 250", { w: 7 }),
      scrieText(MARCA, 450, 418, 40, M.bordo, 9),
      // linia de personalizare, sub marcă
      lin(372, 496, 528, 496, { w: 7, s: M.rosu }),
    ].join(""),

  "tricou-toproll": () =>
    [
      cale(
        "M 350 250 L 300 290 L 210 360 L 270 440 L 320 405 L 320 660 L 580 660 L 580 405 L 630 440 L 690 360 L 600 290 L 550 250 Q 450 320 350 250 Z",
        { f: M.rosuBrun },
      ),
      cale("M 350 250 Q 450 320 550 250", { w: 7 }),
      ...[0, 1, 2, 3].map((i) =>
        lin(302, 424 + i * 30, 352, 408 + i * 30, { w: 5, s: M.nisipCald }),
      ),
      ...[0, 1, 2, 3].map((i) =>
        lin(548, 408 + i * 30, 598, 424 + i * 30, { w: 5, s: M.nisipCald }),
      ),
      ...[0, 1, 2].map((i) =>
        lin(384, 470 + i * 42, 516, 470 + i * 42, { w: 3, s: M.nisipCald }),
      ),
      scrieText(MARCA, 450, 430, 38, M.nisipCald, 9),
      lin(378, 502, 522, 502, { w: 6, s: M.nisipCald }),
    ].join(""),

  "hanorac-hp": () =>
    [
      cale(
        "M 330 262 L 270 302 L 180 382 L 250 472 L 310 428 L 310 690 L 590 690 L 590 428 L 650 472 L 720 382 L 630 302 L 570 262 Z",
        { f: M.bordo },
      ),
      cale("M 330 262 Q 450 196 570 262 Q 450 352 330 262 Z", {
        f: M.negruMoale,
      }),
      lin(424, 302, 424, 404, { w: 6, s: M.nisipCald }),
      lin(476, 302, 476, 404, { w: 6, s: M.nisipCald }),
      cale("M 356 546 L 544 546 L 544 634 L 356 634 Z", { w: 6, s: M.nisipCald }),
      // marca pe piept
      scrieText(MARCA, 450, 438, 40, M.nisipCald, 9),
      lin(310, 668, 590, 668, { w: 5, s: M.negruMoale }),
    ].join(""),

  "maiou-personalizat": () =>
    [
      cale(
        "M 330 270 L 390 270 Q 450 350 510 270 L 570 270 Q 600 380 615 480 L 605 690 L 295 690 L 285 480 Q 300 380 330 270 Z",
        { f: M.rosuAprins },
      ),
      // tivuri la gât și la răscroiala brațului
      cale("M 390 270 Q 450 350 510 270", { w: 7, s: M.nisipCald }),
      cale("M 330 270 Q 300 380 285 480", { w: 7, s: M.nisipCald }),
      cale("M 570 270 Q 600 380 615 480", { w: 7, s: M.nisipCald }),
      lin(299, 658, 601, 658, { w: 4, s: M.nisipCald }),
      // zona de personalizare: nume deasupra, număr dedesubt
      rect(366, 424, 168, 162, { w: 6, s: M.nisipCald, r: 4 }),
      lin(392, 468, 508, 468, { w: 9, s: M.nisipCald }),
      lin(404, 528, 496, 528, { w: 18, s: M.nisipCald }),
      // marca deasupra zonei de personalizare
      scrieText(MARCA, 450, 356, 34, M.nisipCald, 8),
    ].join(""),

  "sapca-hp": () =>
    [
      cale("M 256 466 Q 268 274 450 274 Q 632 274 644 466 Z", {
        f: M.bordo,
      }),
      cale("M 644 466 Q 768 478 780 532 L 256 532 Z", { f: M.negru }),
      lin(450, 280, 450, 466, { w: 4, s: M.griTextil }),
      cale("M 348 296 Q 358 396 352 466", { w: 4, s: M.griTextil }),
      cale("M 552 296 Q 542 396 548 466", { w: 4, s: M.griTextil }),
      ...[400, 500].map((x) => circ(x, 350, 7, { f: M.griTextil, w: 0 })),
      // marca brodată pe panoul frontal
      scrieText(MARCA, 450, 376, 30, M.nisipCald, 8),
      rect(244, 470, 26, 44, { f: M.crom, r: 4, w: 5 }),
    ].join(""),

  "short-forge": () =>
    [
      cale(
        "M 286 296 L 614 296 L 626 644 L 482 644 L 450 462 L 418 644 L 274 644 Z",
        { f: M.rosuBrun },
      ),
      rect(286, 296, 328, 50, { f: M.negru }),
      cale("M 380 322 L 520 322", { w: 6, s: M.nisipCald }),
      circ(450, 322, 9, { f: M.nisipCald, w: 0 }),
      lin(322, 412, 322, 500, { w: 6, s: M.alama }),
      lin(578, 412, 578, 500, { w: 6, s: M.alama }),
      lin(288, 620, 414, 620, { w: 4, s: M.nisipCald }),
      lin(486, 620, 612, 620, { w: 4, s: M.nisipCald }),
      // marca pe picior
      scrieText(MARCA, 356, 500, 22, M.nisipCald, 6),
    ].join(""),

  // ═══ RECUPERARE ═══
  "rola-antebrat": () =>
    [
      rect(246, 372, 408, 152, { f: M.rosuMediu, r: 76 }),
      ...[300, 348, 396, 444, 492, 540, 588].map((x) =>
        lin(x, 390, x, 506, { w: 6, s: M.griTextil }),
      ),
      rect(172, 414, 84, 68, { f: M.negru, r: 34 }),
      rect(644, 414, 84, 68, { f: M.negru, r: 34 }),
    ].join(""),

  "bila-lacrosse": () =>
    [
      circ(450, 450, 194, { f: M.rosuAprins }),
      circ(450, 450, 194, { w: 7 }),
      cale("M 316 316 q 134 134 0 268", { w: 6, s: M.nisipCald }),
      cale("M 584 316 q -134 134 0 268", { w: 6, s: M.nisipCald }),
      cale("M 344 372 q 42 -34 96 -42", { w: 12, s: M.spuma }),
    ].join(""),

  "gel-racoritor": () =>
    [
      rect(392, 200, 116, 62, { f: M.caramida, r: 8 }),
      ...[0, 1, 2, 3].map((i) =>
        lin(404 + i * 28, 208, 404 + i * 28, 254, { w: 4, s: M.creta }),
      ),
      cale("M 356 262 L 544 262 L 560 664 L 340 664 Z", { f: M.creta }),
      lin(340, 646, 560, 646, { w: 10, s: M.otelInchis }),
      cale("M 356 262 L 544 262 L 560 664 L 340 664 Z", { w: 7 }),
      rect(370, 330, 160, 158, { f: P.fundal, w: 5 }),
      lin(396, 372, 504, 372, { w: 7, s: M.caramida }),
      lin(396, 410, 470, 410, { w: 4, s: M.otelInchis }),
      lin(396, 440, 490, 440, { w: 4, s: M.otelInchis }),
    ].join(""),
};

// ── Compunere ───────────────────────────────────────────────────────────────

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

function grila(latime, inaltime, pas = 60) {
  const linii = [];
  for (let x = 0; x <= latime; x += pas)
    linii.push(lin(x, 0, x, inaltime, { w: 1.5, s: P.grila }));
  for (let y = 0; y <= inaltime; y += pas)
    linii.push(lin(0, y, latime, y, { w: 1.5, s: P.grila }));
  return linii.join("");
}

/**
 * Randează desenul pe fundal transparent și taie marginile goale. Astfel
 * încadrarea nu depinde de cât de bine am nimerit centrul când am scris fiecare
 * desen: obiectul se așază identic în toate cele 40 de ilustrații.
 */
async function obiect(seed) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">${desene[seed]()}</svg>`;
  return sharp(Buffer.from(svg)).ensureAlpha().trim({ threshold: 1 }).toBuffer();
}

/** Obiectul, redimensionat să încapă într-un pătrat de `latura` pixeli. */
async function incape(brut, latura, rotatie = 0) {
  let imagine = sharp(brut).resize(latura, latura, {
    fit: "inside",
    background: TRANSPARENT,
  });
  if (rotatie) imagine = imagine.rotate(rotatie, { background: TRANSPARENT });
  return imagine.toBuffer();
}

/**
 * Cele patru variante nu schimbă obiectul, ci încadrarea: vedere completă,
 * vedere înclinată cu cotă, detaliu decupat și vedere mică pe caroiaj tehnic.
 */
async function compune(seed, varianta, latime, inaltime) {
  const mic = Math.min(latime, inaltime);
  const fundal = varianta === 2 ? P.fundalAlt : P.fundal;

  const straturi = [
    `<rect width="${latime}" height="${inaltime}" fill="${fundal}"/>`,
  ];
  if (varianta === 4) straturi.push(grila(latime, inaltime));
  if (varianta === 2) {
    straturi.push(cota(latime * 0.2, latime * 0.8, inaltime * 0.88));
  }

  const baza = sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${latime}" height="${inaltime}" viewBox="0 0 ${latime} ${inaltime}">${straturi.join("")}</svg>`,
    ),
  );

  const brut = await obiect(seed);

  // Varianta 3 este un detaliu: obiectul umple cadrul și se decupează.
  const suprapus =
    varianta === 3
      ? await sharp(brut)
          .resize(latime, inaltime, { fit: "cover", position: "centre" })
          .toBuffer()
      : await incape(
          brut,
          Math.round(mic * (varianta === 4 ? 0.54 : varianta === 2 ? 0.64 : 0.72)),
          varianta === 2 ? -8 : 0,
        );

  return baza
    .composite([
      { input: suprapus, gravity: "centre" },
      { input: Buffer.from(marcaProdus(latime, inaltime)), gravity: "centre" },
    ])
    .webp({ quality: 90 })
    .toBuffer();
}

/** Două desene alăturate, pentru formatele late (categorii și articole). */
async function compozitie(seedA, seedB, latime, inaltime) {
  const baza = sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${latime}" height="${inaltime}" viewBox="0 0 ${latime} ${inaltime}">
        <rect width="${latime}" height="${inaltime}" fill="${P.fundal}"/>
        ${grila(latime, inaltime, 72)}
      </svg>`,
    ),
  );

  const mare = await incape(await obiect(seedA), Math.round(inaltime * 0.66));
  const mic = await incape(await obiect(seedB), Math.round(inaltime * 0.38));
  const dimMare = await sharp(mare).metadata();
  const dimMic = await sharp(mic).metadata();

  return baza
    .composite([
      {
        input: mare,
        left: Math.round(latime * 0.3 - dimMare.width / 2),
        top: Math.round((inaltime - dimMare.height) / 2),
      },
      {
        input: mic,
        left: Math.round(latime * 0.68 - dimMic.width / 2),
        top: Math.round(inaltime * 0.58 - dimMic.height / 2),
      },
    ])
    .webp({ quality: 90 })
    .toBuffer();
}

async function scrie(cale, date) {
  await mkdir(dirname(cale), { recursive: true });
  await writeFile(cale, date);
  return date.length;
}

// ── Ce se generează ─────────────────────────────────────────────────────────

// Seed-ul și numărul de imagini corespund apelurilor `poze(...)` din produse.ts.
const produse = [
  ["titan-pro", 4], ["forge-club", 3], ["wall-arm", 3], ["grip-pad", 2],
  ["pini-mana", 2], ["husa-masa", 2], ["pronator-p1", 3], ["cup-master", 3],
  ["hammer-h2", 3], ["free-spin", 3], ["devon-60", 3], ["strap-grip", 2],
  ["arsenal-kit", 4], ["adaptor-rotativ", 2], ["pulley-pro", 4],
  ["cablu-otel", 2], ["turnbuckle", 2], ["roll-force", 3],
  ["gripper-reglabil", 3], ["grippere-set", 2], ["grip-ball", 2],
  ["benzi-rezistenta", 2], ["pinch-plate", 2], ["hang-rope", 2],
  ["curea-legare", 3], ["strap-trainer", 2], ["bandaje-60", 2],
  ["bandaje-90", 2],
  ["cotiera-neopren", 2], ["creta-bloc", 2], ["creta-lichida", 2],
  ["banda-kinesio", 2], ["table-bag", 3], ["tricou-chalk", 3],
  ["tricou-toproll", 3], ["hanorac-hp", 3], ["sapca-hp", 2],
  ["short-forge", 2], ["maiou-personalizat", 3],
  ["rola-antebrat", 2], ["bila-lacrosse", 2],
  ["gel-racoritor", 2],
];

const categorii = [
  ["mese", ["titan-pro", "grip-pad"]],
  ["manere", ["pronator-p1", "hammer-h2"]],
  ["antrenament", ["pulley-pro", "gripper-reglabil"]],
  ["protectie", ["curea-legare", "creta-bloc"]],
  ["imbracaminte", ["hanorac-hp", "sapca-hp"]],
  ["recuperare", ["rola-antebrat", "bila-lacrosse"]],
];

const articole = [
  ["primul-setup-de-armwrestling-acasa", ["pulley-pro", "hammer-h2"]],
  ["pronatie-cupping-top-roll-ce-antreneaza-fiecare-maner", ["pronator-p1", "cup-master"]],
  ["cum-previi-accidentarile-de-cot", ["cotiera-neopren", "benzi-rezistenta"]],
  ["ghid-de-creta-bloc-lichida-sau-deloc", ["creta-bloc", "creta-lichida"]],
];

async function main() {
  let fisiere = 0;
  let octeti = 0;

  for (const [seed, numar] of produse) {
    if (!desene[seed]) throw new Error(`Lipsește desenul pentru „${seed}”.`);
    for (let n = 1; n <= numar; n++) {
      octeti += await scrie(
        join(PUBLIC, "produse", `${seed}-${n}.webp`),
        await compune(seed, n, 900, 900),
      );
      fisiere++;
    }
  }

  for (const [slug, [a, b]] of categorii) {
    octeti += await scrie(
      join(PUBLIC, "categorii", `${slug}.webp`),
      await compozitie(a, b, 1200, 800),
    );
    fisiere++;
  }

  for (const [slug, [a, b]] of articole) {
    octeti += await scrie(
      join(PUBLIC, "blog", `${slug}.webp`),
      await compozitie(a, b, 1600, 900),
    );
    fisiere++;
  }

  octeti += await scrie(
    join(PUBLIC, "hero.webp"),
    await compune("titan-pro", 1, 1000, 1250),
  );
  fisiere++;

  // Reper vizual pentru pagina de contact: caroiaj de străzi cu un marcaj.
  const harta = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="675" viewBox="0 0 900 675">
    <rect width="900" height="675" fill="${P.fundal}"/>
    ${grila(900, 675, 45)}
    ${lin(0, 250, 900, 250, { w: 26, s: P.fundalAlt })}
    ${lin(0, 470, 900, 470, { w: 18, s: P.fundalAlt })}
    ${lin(300, 0, 300, 675, { w: 22, s: P.fundalAlt })}
    ${lin(640, 0, 640, 675, { w: 14, s: P.fundalAlt })}
    ${rect(340, 290, 260, 140, { f: M.otel, w: 5 })}
    ${lin(340, 330, 600, 330, { w: 4, s: M.otelInchis })}
    ${cale("M 470 200 a 46 46 0 1 1 0.1 0 Z", { f: M.rosu, w: 0 })}
    ${cale("M 470 292 L 436 214 L 504 214 Z", { f: M.rosu, w: 0 })}
    ${circ(470, 246, 17, { f: P.fundal, w: 0 })}
  </svg>`;
  octeti += await scrie(
    join(PUBLIC, "contact-harta.webp"),
    await sharp(Buffer.from(harta)).webp({ quality: 90 }).toBuffer(),
  );
  fisiere++;

  console.log(
    `${fisiere} imagini generate, ${(octeti / 1024).toFixed(0)} KB în total.`,
  );
}

main().catch((eroare) => {
  console.error(eroare);
  process.exitCode = 1;
});
