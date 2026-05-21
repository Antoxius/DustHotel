import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "Hotel Barndomshjemmet",
  description: "Personlig hotelinspireret hjemmeside med varme farver og hyggelig boutique-stemning.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="da"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
