import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | HolarzGadgets – Ekiti's #1 Gadget Store",
    description:
        "Learn about HolarzGadgets — Ado-Ekiti's most trusted online store for original phones, laptops, smartwatches, earbuds, and accessories. Founded to bring premium tech to Ekiti State and Nigeria.",
    keywords: [
        "about HolarzGadgets",
        "gadget store Ekiti",
        "phone shop Ado-Ekiti",
        "original phones Ekiti State",
        "best gadget store Nigeria",
        "buy laptop Ekiti",
        "tech accessories Ekiti",
    ],
    alternates: {
        canonical: "https://horlarzgadgets.com/about",
    },
    openGraph: {
        title: "About HolarzGadgets — Ekiti's #1 Gadget Store",
        description:
            "We are Ado-Ekiti's trusted gadget store. Original phones, laptops, smartwatches, earbuds and accessories delivered across Ekiti State and Nigeria.",
        url: "https://horlarzgadgets.com/about",
        siteName: "HolarzGadgets",
        locale: "en_NG",
        type: "website",
    },
};

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}