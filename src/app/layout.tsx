import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/db";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.websiteSetting.findUnique({ where: { id: "settings" } });
  return {
    title: s?.hotelName ?? "Grand Azure Hotel",
    description: s?.heroSubtitle ?? "Luxury hotel and resort",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.websiteSetting.findUnique({ where: { id: "settings" } });
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <Navbar hotelName={settings?.hotelName ?? "The Grand Azure"} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
