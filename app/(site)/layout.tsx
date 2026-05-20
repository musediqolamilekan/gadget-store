import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { Analytics } from "@vercel/analytics/next";
import NavbarServer from "@/components/NavbarServer";
import FooterServer from "@/components/Footerserver";

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
const siteUrl = "https://holarzgadgets.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "HolarzGadgets | Buy Phones, Laptops, Smartwatches & Accessories in Nigeria",
    template: "%s | HolarzGadgets",
  },

  description:
    "Shop original phones, laptops, smartwatches, earbuds, power banks, gaming accessories, and other gadgets in Nigeria at HolarzGadgets. Fast delivery and secure ordering.",

  keywords: [
    "gadgets in Nigeria",
    "buy phones in Nigeria",
    "laptops in Nigeria",
    "smartwatches",
    "earbuds",
    "power banks",
    "gaming accessories",
    "tech accessories",
    "online gadget store",
    "HolarzGadgets",
  ],

  applicationName: "HolarzGadgets",
  authors: [{ name: "HolarzGadgets" }],
  creator: "HolarzGadgets",
  publisher: "HolarzGadgets",
  category: "Technology",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "HolarzGadgets",
    title:
      "HolarzGadgets | Buy Phones, Laptops, Smartwatches & Accessories in Nigeria",
    description:
      "Shop original phones, laptops, smartwatches, earbuds, power banks, and tech accessories in Nigeria.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HolarzGadgets",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "HolarzGadgets | Buy Phones, Laptops, Smartwatches & Accessories in Nigeria",
    description:
      "Shop original gadgets in Nigeria, including phones, laptops, smartwatches, and accessories.",
    images: ["/og-image.jpg"],
    creator: "@holarzgadgets",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  verification: {
    google: "_V9En2uLAme-5ix1dB9ONuACzxQCixLb9DDHEqG9q-g",
  },
};

// ── Root Layout ───────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-slate-950 text-slate-200 font-inter antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <CartProvider>
          <NavbarServer />
          <CartDrawer />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <FooterServer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}