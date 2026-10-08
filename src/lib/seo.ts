import type { Metadata } from "next";
import { site } from "@/data/site";
import type { Produs, StareStoc } from "@/types";

/** Metadate pentru o pagină statică: titlu, descriere, canonical și OpenGraph. */
export function metaPagina({
  titlu,
  descriere,
  cale,
  imagine,
}: {
  titlu: string;
  descriere: string;
  cale: string;
  imagine?: string;
}): Metadata {
  return {
    title: titlu,
    description: descriere,
    alternates: { canonical: cale },
    openGraph: {
      title: `${titlu} · ${site.nume}`,
      description: descriere,
      url: cale,
      siteName: site.nume,
      locale: "ro_MD",
      type: "website",
      ...(imagine ? { images: [{ url: imagine }] } : {}),
    },
  };
}

const disponibilitate: Record<StareStoc, string> = {
  "in-stoc": "https://schema.org/InStock",
  "stoc-limitat": "https://schema.org/LimitedAvailability",
  "la-comanda": "https://schema.org/BackOrder",
  epuizat: "https://schema.org/OutOfStock",
};

export function jsonLdOrganizatie() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.nume,
    url: site.url,
    email: site.email,
    telephone: site.telefon,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.adresa,
      addressCountry: "MD",
    },
    sameAs: [site.social.instagram, site.social.facebook, site.social.youtube],
  };
}

export function jsonLdProdus(produs: Produs) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produs.nume,
    sku: produs.sku,
    description: produs.descriere,
    image: produs.imagini,
    brand: { "@type": "Brand", name: site.nume },
    offers: {
      "@type": "Offer",
      price: produs.pret,
      priceCurrency: "MDL",
      availability: disponibilitate[produs.stoc],
      url: `${site.url}/produse/${produs.slug}`,
    },
  };
}

export function jsonLdBreadcrumb(elemente: { nume: string; cale: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: elemente.map((element, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: element.nume,
      item: `${site.url}${element.cale}`,
    })),
  };
}

export function jsonLdFaq(intrebari: { intrebare: string; raspuns: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: intrebari.map((i) => ({
      "@type": "Question",
      name: i.intrebare,
      acceptedAnswer: { "@type": "Answer", text: i.raspuns },
    })),
  };
}
