import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import ShellSite from "@/components/layout/ShellSite";
import CartProvider from "@/lib/cart-context";
import ToastProvider from "@/components/ui/Toast";
import { site } from "@/data/site";
import { jsonLdOrganizatie } from "@/lib/seo";

// DECIZIE: variabilele CSS ale fonturilor se numesc `--font-*-src`, nu
// `--font-heading` / `--font-body`, pentru că tokenii Tailwind din `@theme`
// poartă deja aceste nume și s-ar auto-referenția.
const heading = Barlow_Condensed({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  variable: "--font-heading-src",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-body-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nume} · ${site.tagline}`,
    template: `%s · ${site.nume}`,
  },
  description: site.descriere,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: site.nume,
    title: `${site.nume} · ${site.tagline}`,
    description: site.descriere,
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${heading.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#continut"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-chalk-50"
        >
          Sari la conținut
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganizatie()) }}
        />

        <ToastProvider>
          <CartProvider>
            <ShellSite
              bara={<AnnouncementBar />}
              header={<Header />}
              footer={<Footer />}
            >
              {children}
            </ShellSite>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
