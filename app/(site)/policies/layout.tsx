import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Shipping, Returns & Warranty | HolarzGadgets",
  description:
    "Read HolarzGadgets' shipping policy, returns & refund policy, and warranty terms. We deliver gadgets across Ekiti State and all of Nigeria with a clear, customer-first returns process.",
  keywords: [
    "HolarzGadgets shipping policy",
    "gadget return policy Nigeria",
    "phone warranty Ekiti",
    "free shipping Ekiti",
    "returns policy gadget store Nigeria",
    "phone shop refund Ekiti",
  ],
  alternates: { canonical: "https://horlarzgadgets.com/policies" },
  openGraph: {
    title:       "Shipping, Returns & Warranty | HolarzGadgets",
    description: "Clear shipping, returns and warranty policies from Ekiti's most trusted gadget store.",
    url:         "https://horlarzgadgets.com/policies",
    siteName:    "HolarzGadgets",
    locale:      "en_NG",
    type:        "website",
  },
};

export default function PoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}