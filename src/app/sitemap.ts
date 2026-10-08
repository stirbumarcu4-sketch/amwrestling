import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { produse } from "@/data/produse";
import { categorii } from "@/data/categorii";
import { articole } from "@/data/articole";

// Rutele statice indexabile. /checkout și /comanda-finalizata lipsesc
// intenționat — sunt excluse și din robots.ts.
const ruteStatice = [
  "",
  "/produse",
  "/categorii",
  "/cos",
  "/favorite",
  "/despre-noi",
  "/contact",
  "/ghid-marimi",
  "/ghid-echipament",
  "/intrebari-frecvente",
  "/livrare-si-retur",
  "/termeni-si-conditii",
  "/politica-de-confidentialitate",
  "/politica-cookies",
  "/blog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const acum = new Date();

  return [
    ...ruteStatice.map((cale) => ({
      url: `${site.url}${cale}`,
      lastModified: acum,
      changeFrequency: "weekly" as const,
      priority: cale === "" ? 1 : 0.7,
    })),
    ...categorii.map((categorie) => ({
      url: `${site.url}/categorii/${categorie.slug}`,
      lastModified: acum,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...produse.map((produs) => ({
      url: `${site.url}/produse/${produs.slug}`,
      lastModified: acum,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...articole.map((articol) => ({
      url: `${site.url}/blog/${articol.slug}`,
      lastModified: new Date(articol.dataPublicare),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
