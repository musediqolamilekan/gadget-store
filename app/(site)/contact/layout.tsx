import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us | HolarzGadgets – Gadget Store in Ekiti",
    description:
        "Contact HolarzGadgets via WhatsApp or email. We are Ekiti's trusted gadget store selling original phones, laptops, smartwatches, and accessories. Fast response guaranteed.",
    alternates: {
        canonical: "https://horlarzgadgets.com/contact",
    },
    openGraph: {
        title: "Contact HolarzGadgets — Ekiti's #1 Gadget Store",
        description: "Reach us on WhatsApp or email for orders, support, and enquiries.",
        url: "https://horlarzgadgets.com/contact",
        siteName: "HolarzGadgets",
        locale: "en_NG",
        type: "website",
    },
};

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}