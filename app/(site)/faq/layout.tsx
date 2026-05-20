import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "FAQ | HolarzGadgets – Frequently Asked Questions",
  description:
    "Find answers to common questions about buying phones, laptops and gadgets from HolarzGadgets in Ekiti State. Shipping, returns, warranty, payment and more.",
  keywords: [
    "HolarzGadgets FAQ",
    "buy phone Ekiti",
    "original gadgets Nigeria",
    "phone shop Ado-Ekiti",
    "gadget delivery Ekiti",
    "how to buy laptop Ekiti",
  ],
  alternates: { canonical: "https://horlarzgadgets.com/faq" },
  openGraph: {
    title:       "FAQ | HolarzGadgets — Ekiti Gadget Store",
    description: "Answers to common questions about ordering gadgets from HolarzGadgets.",
    url:         "https://horlarzgadgets.com/faq",
    siteName:    "HolarzGadgets",
    locale:      "en_NG",
    type:        "website",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}