import type { Categorie } from "@/types";
import dateCategorii from "./categorii.json";

// Vezi nota din `produse.ts`: sursa reală e JSON-ul, ca administrarea să-l
// poată rescrie. Imaginile cu sufixul `-foto` sunt fotografii compuse de
// `scripts/imagini-categorii-foto.mjs`; sufixul există fiindcă `npm run imagini`
// regenerează `{slug}.webp` și ar suprascrie fotografia.
export const categorii = dateCategorii as Categorie[];

export const getCategorie = (slug: string) =>
  categorii.find((c) => c.slug === slug);
