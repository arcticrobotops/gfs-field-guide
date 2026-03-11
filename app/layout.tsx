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

export const metadata: Metadata = {
  title: "Ghost Forest Surf Club \u2014 A Field Guide to Coastal Goods",
  description:
    "Specimen catalog of coldwater surf goods. 45.10\u00b0N, 123.98\u00b0W. First Edition.",
  openGraph: {
    title: "Ghost Forest Surf Club \u2014 A Field Guide to Coastal Goods",
    description:
      "Specimen catalog of coldwater surf goods. 45.10\u00b0N, 123.98\u00b0W. First Edition.",
    siteName: "Ghost Forest Surf Club",
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
