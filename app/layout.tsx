import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"


// ── Fonts ────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

// ── Metadata ─────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "HolarzGadgets – Premium Gadgets & Tech",
    template: "%s | HolarzGadgets",
  },
  description:
    "Shop the latest phones, laptops, smartwatches, earbuds, power banks, and tech accessories at HolarzGadgets. Premium gadgets, unbeatable prices.",
  keywords: ["gadgets", "phones", "laptops", "smartwatches", "earbuds", "tech"],
  authors: [{ name: "HolarzGadgets" }],
  creator: "HolarzGadgets",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://HolarzGadgets.dev",
    siteName: "HolarzGadgets",
    title: "HolarzGadgets – Premium Gadgets & Tech",
    description: "Shop the latest phones, laptops, smartwatches, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HolarzGadgets – Premium Gadgets & Tech",
    description: "Shop the latest phones, laptops, smartwatches, and more.",
    creator: "@HolarzGadgets",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── Root Layout ───────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-slate-950 text-slate-200 font-inter antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <Footer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
