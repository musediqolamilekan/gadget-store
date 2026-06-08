import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider }  from "@/context/CartContext";
import CartDrawer        from "@/components/CartDrawer";
import { Analytics }     from "@vercel/analytics/next";
import NavbarServer      from "@/components/NavbarServer";
import FooterServer      from "@/components/FooterServer";
import WhatsAppFloat     from "@/components/WhatsAppFloat";

// ── Fonts ────────────────────────────────────────────────────
const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets:  ["latin"],
  variable: "--font-space",
  display:  "swap",
});

// ── Site URL ─────────────────────────────────────────────────
const siteUrl = "https://horlarzgadgets.com";

// ── Metadata ─────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:  "HolarzGadgets | Original Phones, Laptops & Gadgets in Ekiti, Nigeria",
    template: "%s | HolarzGadgets",
  },

  description:
    "Shop 100% original phones, laptops, smartwatches, earbuds, power banks and accessories at HolarzGadgets — Ekiti's most trusted gadget store. Fast delivery across Ekiti State and Nigeria.",

  keywords: [
    // Local — highest value, least competition
    "phone shop Ekiti",
    "gadgets Ekiti State",
    "buy phones Ado-Ekiti",
    "gadget store Ekiti Nigeria",
    "original phones Ekiti",
    "laptop store Ekiti",
    "phone shop Ado-Ekiti",
    "where to buy iPhone Ekiti",
    "tech accessories Ekiti",
    // Brand
    "HolarzGadgets",
    "Holarz Gadgets Nigeria",
    "horlarzgadgets.com",
    // Product categories
    "buy phones Nigeria",
    "laptops Nigeria",
    "smartwatches Nigeria",
    "earbuds Nigeria",
    "power banks Nigeria",
    "iPhone Nigeria",
    "Samsung Galaxy Nigeria",
    "MacBook Nigeria",
    "AirPods Nigeria",
    // Intent-based
    "original gadgets Nigeria",
    "online gadget store Nigeria",
    "best phone prices Nigeria",
    "gadget delivery Nigeria",
  ],

  applicationName: "HolarzGadgets",
  authors:         [{ name: "Olamilekan Musediq" }],
  creator:         "Olamilekan Musediq",
  publisher:       "HolarzGadgets",
  category:        "Technology",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: [
      { url: "/favicon.ico"              },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple:   "/apple-icon.png",
    shortcut:"/favicon.ico",
  },

  openGraph: {
    type:        "website",
    locale:      "en_NG",
    url:         siteUrl,
    siteName:    "HolarzGadgets",
    title:
      "HolarzGadgets | Original Phones, Laptops & Gadgets in Ekiti, Nigeria",
    description:
      "Shop 100% original phones, laptops, smartwatches, earbuds, power banks and tech accessories at HolarzGadgets — Ekiti's most trusted gadget store.",
    images: [
      {
        url:    "/og-image.jpg",
        width:  1200,
        height: 630,
        alt:    "HolarzGadgets — Ekiti's #1 Gadget Store",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:
      "HolarzGadgets | Original Phones, Laptops & Gadgets in Ekiti, Nigeria",
    description:
      "Shop 100% original gadgets in Nigeria — phones, laptops, smartwatches, earbuds, and accessories. Based in Ado-Ekiti, delivering nationwide.",
    images:  ["/og-image.jpg"],
    creator: "@horlarzgadgets",
    site:    "@horlarzgadgets",
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet":       -1,
    },
  },

  // ── Google Search Console verification ──────────────────
  verification: {
    google: "YltzVa2mOfbsnBD4c0vQm21KYoIh4idT4zy6Y-4L8GI",
  },

  // ── Geo tags — help Google associate site with Ekiti ────
  other: {
    "geo.region":          "NG-EK",
    "geo.placename":       "Ado-Ekiti, Ekiti State, Nigeria",
    "geo.position":        "7.6234;5.2214",
    "ICBM":                "7.6234, 5.2214",
    "og:locale:alternate": "en_NG",
  },
};

// ── Root Layout ───────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-NG"
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body
        className="min-h-screen antialiased"
      >
        <CartProvider>
          <NavbarServer />
          <CartDrawer />
          <main className="min-h-[calc(100vh-80px)]">{children}</main>
          <FooterServer />
          <WhatsAppFloat />
        </CartProvider>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}