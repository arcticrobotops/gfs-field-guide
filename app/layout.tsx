import type { Metadata } from "next";
import { Playfair_Display, IBM_Plex_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://ghostforestsurfclub.com";

export const metadata: Metadata = {
  title: {
    default: "Ghost Forest Surf Club | A Field Guide to Coastal Goods",
    template: "%s | Ghost Forest Surf Club",
  },
  description:
    "Specimen catalog of coldwater surf goods, curated from the northern Oregon coast. First Edition. 45.10\u00b0N, 123.98\u00b0W.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Ghost Forest Surf Club",
    title: "Ghost Forest Surf Club | A Field Guide to Coastal Goods",
    description:
      "Specimen catalog of coldwater surf goods, curated from the northern Oregon coast. First Edition. 45.10\u00b0N, 123.98\u00b0W.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ghost Forest Surf Club - A Field Guide to Coastal Goods",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghost Forest Surf Club | A Field Guide to Coastal Goods",
    description:
      "Specimen catalog of coldwater surf goods, curated from the northern Oregon coast. First Edition.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${ibmPlexMono.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
