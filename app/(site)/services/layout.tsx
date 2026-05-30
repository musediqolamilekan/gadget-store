import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Digital Services | HolarzGadgets — Data, Airtime, DSTV & Google Numbers",
  description:
    "Buy cheap data bundles, airtime, renew DSTV subscriptions, and get Google Voice / US numbers from HolarzGadgets. Fast, reliable digital services in Ekiti and across Nigeria.",
  keywords: [
    "buy data Nigeria",
    "cheap data bundles Ekiti",
    "buy airtime online Nigeria",
    "DSTV subscription renewal Nigeria",
    "Google Voice number Nigeria",
    "US number Nigeria",
    "MTN data Ekiti",
    "Airtel data Nigeria",
    "HolarzGadgets services",
  ],
  alternates: { canonical: "https://horlarzgadgets.com/services" },
  openGraph: {
    title:       "Digital Services | HolarzGadgets",
    description: "Data, airtime, DSTV renewals and Google Voice numbers — fast and reliable.",
    url:         "https://horlarzgadgets.com/services",
    siteName:    "HolarzGadgets",
    locale:      "en_NG",
    type:        "website",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}