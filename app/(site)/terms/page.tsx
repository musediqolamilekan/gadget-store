import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// SEO METADATA
// ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: "Terms of Service | HolarzGadgets – Phone & Gadget Store in Ekiti",
    description:
        "Read the Terms of Service for HolarzGadgets, Ekiti's trusted online store for phones, laptops, smartwatches, earbuds, and accessories. Shop premium gadgets in Ado-Ekiti and across Nigeria.",
    keywords: [
        "phone shop Ekiti",
        "gadget store Ekiti",
        "buy phones Ado-Ekiti",
        "laptop store Ekiti",
        "HolarzGadgets terms",
        "online gadget store Nigeria",
        "buy Samsung iPhone Ekiti",
    ],
    alternates: {
        canonical: "https://horlarzgadgets.com/terms",
    },
    openGraph: {
        title: "Terms of Service | HolarzGadgets Ekiti",
        description: "Terms governing purchases at HolarzGadgets — Ekiti's #1 gadget store.",
        url: "https://horlarzgadgets.com/terms",
        siteName: "HolarzGadgets",
        locale: "en_NG",
        type: "website",
    },
};

// ─────────────────────────────────────────────────────────────
// JSON-LD STRUCTURED DATA
// ─────────────────────────────────────────────────────────────
const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "LocalBusiness",
            "@id": "https://horlarzgadgets.com/#business",
            name: "HolarzGadgets",
            url: "https://horlarzgadgets.com",
            telephone: "+2349055427487",
            description:
                "HolarzGadgets is Ekiti's leading online store for premium phones, laptops, smartwatches, power banks, earbuds, and tech accessories. We serve Ado-Ekiti, Ikere-Ekiti, Ikole-Ekiti, and all of Nigeria.",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Ado-Ekiti",
                addressRegion: "Ekiti State",
                addressCountry: "NG",
            },
            geo: {
                "@type": "GeoCoordinates",
                latitude: 7.6234,
                longitude: 5.2214,
            },
            areaServed: [
                "Ado-Ekiti", "Ikere-Ekiti", "Ikole-Ekiti",
                "Ilawe-Ekiti", "Aramoko-Ekiti", "Ekiti State", "Nigeria",
            ],
            priceRange: "₦₦",
            openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "08:00",
                closes: "20:00",
            },
            sameAs: [
                "https://wa.me/2349055427487",
            ],
            hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Gadgets & Tech Accessories",
                itemListElement: [
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Smartphones" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Laptops" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Smartwatches" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Earbuds" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Power Banks" } },
                    { "@type": "Offer", itemOffered: { "@type": "Product", name: "Accessories" } },
                ],
            },
        },
        {
            "@type": "WebPage",
            "@id": "https://horlarzgadgets.com/terms",
            url: "https://horlarzgadgets.com/terms",
            name: "Terms of Service — HolarzGadgets",
            isPartOf: { "@id": "https://horlarzgadgets.com/#business" },
            datePublished: "2024-01-01",
            dateModified: "2025-01-01",
            inLanguage: "en-NG",
        },
    ],
};

// ─────────────────────────────────────────────────────────────
// SECTIONS DATA
// ─────────────────────────────────────────────────────────────
const SECTIONS = [
    {
        id: "acceptance",
        title: "1. Acceptance of Terms",
        body: `By accessing horlarzgadgets.com or placing an order with HolarzGadgets, you confirm that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, please do not use our website or services. These terms apply to all visitors, customers, and users of our platform across Nigeria, including Ado-Ekiti, Ikere-Ekiti, Ikole-Ekiti, and all other regions.`,
    },
    {
        id: "products",
        title: "2. Products & Availability",
        body: `HolarzGadgets offers a curated selection of premium gadgets including smartphones (iPhone, Samsung, Tecno, Infinix), laptops (MacBook, Dell, HP, Lenovo, Asus), smartwatches, power banks, earbuds, and tech accessories. All products are subject to availability. We reserve the right to discontinue any product at any time without notice. Product images are for illustration purposes; actual colours may vary slightly.`,
    },
    {
        id: "pricing",
        title: "3. Pricing & Payment",
        body: `All prices are listed in Nigerian Naira (₦) and are inclusive of applicable taxes. Prices may change without notice due to market conditions, currency fluctuations, or supplier pricing. Payment is completed via bank transfer to our verified Opay account, confirmed through WhatsApp before dispatch. We do not store any payment card information. Promotions and discount codes are subject to their own specific terms and cannot be combined unless stated.`,
    },
    {
        id: "orders",
        title: "4. Order Process",
        body: `Orders are placed through our website and confirmed via WhatsApp with our team. An order is only considered confirmed once you receive a WhatsApp confirmation message from HolarzGadgets. We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraudulent activity. You will be fully refunded in the event of a cancellation initiated by us.`,
    },
    {
        id: "shipping",
        title: "5. Shipping & Delivery",
        body: `We deliver to all 36 states in Nigeria including Ekiti State, Lagos, Abuja, Ibadan, Kano, Port Harcourt, and more. Orders within Ado-Ekiti may qualify for same-day or next-day delivery. Nationwide delivery typically takes 1–5 business days depending on your location. Free shipping applies on orders above ₦50,000. Delivery fees for orders below this threshold are calculated at checkout. HolarzGadgets is not responsible for delays caused by courier services, weather, or circumstances beyond our control.`,
    },
    {
        id: "returns",
        title: "6. Returns & Refunds",
        body: `We offer a 7-day return window from the date of delivery for items that are defective, damaged, or significantly different from the product description. To initiate a return, contact us on WhatsApp within 7 days of receiving your order. Items must be returned in their original packaging with all accessories included. Refunds are processed within 3–5 business days after the returned item is received and inspected. We do not accept returns for items damaged due to user misuse, or for software/digital products.`,
    },
    {
        id: "warranty",
        title: "7. Warranty",
        body: `All products sold by HolarzGadgets carry a minimum 6-month seller warranty in addition to any manufacturer warranty that may apply. Warranty claims must be submitted via WhatsApp with proof of purchase. Warranty does not cover physical damage, liquid damage, or damage resulting from unauthorised repairs. For Apple products, Sony, Samsung, and other brands with local service centres in Nigeria, we will assist you in navigating the manufacturer's warranty process.`,
    },
    {
        id: "conduct",
        title: "8. User Conduct",
        body: `You agree to use our website for lawful purposes only. You must not attempt to gain unauthorised access to our systems, submit false orders, impersonate another person, or engage in any activity that disrupts our service. We reserve the right to refuse service to anyone who violates these terms or engages in abusive behaviour toward our team.`,
    },
    {
        id: "ip",
        title: "9. Intellectual Property",
        body: `All content on horlarzgadgets.com — including product images, descriptions, logos, and design — is the property of HolarzGadgets or its content suppliers and is protected by Nigerian and international copyright law. You may not reproduce, distribute, or create derivative works without our express written permission.`,
    },
    {
        id: "limitation",
        title: "10. Limitation of Liability",
        body: `To the fullest extent permitted by Nigerian law, HolarzGadgets shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products. Our total liability for any claim shall not exceed the amount you paid for the product in question. We make no warranties beyond those expressly stated on product pages.`,
    },
    {
        id: "changes",
        title: "11. Changes to Terms",
        body: `HolarzGadgets reserves the right to update these Terms of Service at any time. Material changes will be communicated via our website. Continued use of our services after any changes constitutes your acceptance of the revised terms. We recommend reviewing this page periodically.`,
    },
    {
        id: "governing",
        title: "12. Governing Law",
        body: `These Terms of Service are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved under Nigerian jurisdiction. By using our services, you consent to the exclusive jurisdiction of courts in Ekiti State, Nigeria.`,
    },
    {
        id: "contact",
        title: "13. Contact Us",
        body: `For questions about these terms, reach us on WhatsApp: +234 905 542 7487. We are available Monday to Saturday, 8am – 8pm WAT.`,
    },
];

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function TermsPage() {
    return (
        <>
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-bg">
                {/* ── Hero ──────────────────────────────────────── */}
                <section className="relative overflow-hidden bg-bg-subtle border-b border-border">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent-cyan/5 blur-3xl" />
                    </div>
                    <div className="container-app py-14 relative">
                        {/* Breadcrumb */}
                        <nav
                            aria-label="Breadcrumb"
                            className="flex items-center gap-1.5 text-xs text-text-faint mb-6"
                        >
                            <Link href="/" className="hover:text-text transition-colors">Home</Link>
                            <ChevronRight size={12} />
                            <span className="text-text-muted">Terms of Service</span>
                        </nav>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
                                <FileText size={18} className="text-accent-cyan" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text">
                                Terms of Service
                            </h1>
                        </div>
                        <p className="text-text-muted text-sm max-w-xl">
                            Last updated: <strong className="text-text">1 January 2025</strong>.
                            These terms govern your use of HolarzGadgets — Ekiti&apos;s trusted
                            online gadget store serving Ado-Ekiti, Ikere-Ekiti, and all of Nigeria.
                        </p>
                    </div>
                </section>

                {/* ── Body ──────────────────────────────────────── */}
                <div className="container-app py-14">
                    <div className="grid lg:grid-cols-[220px_1fr] gap-10">

                        {/* Sticky TOC */}
                        <aside className="hidden lg:block">
                            <div className="sticky top-24 space-y-1">
                                <p className="text-[10px] font-bold tracking-widest uppercase
                  text-text-faint mb-3">
                                    Contents
                                </p>
                                {SECTIONS.map((s) => (
                                    <a
                                        key={s.id}
                                        href={`#${s.id}`}
                                        className="block text-xs text-text-faint hover:text-accent-cyan
                      transition-colors py-1 border-l-2 border-border
                      hover:border-accent-cyan pl-3"
                                    >
                                        {s.title}
                                    </a>
                                ))}
                            </div>
                        </aside>

                        {/* Content */}
                        <article className="prose prose-slate dark:prose-invert prose-sm max-w-none">
                            {/* Hidden SEO paragraph */}
                            <p className="text-text-muted text-sm leading-relaxed mb-10
                p-4 rounded-xl bg-bg-subtle border border-border not-prose">
                                <strong className="text-text">HolarzGadgets</strong> is a premier
                                online gadget store based in{" "}
                                <strong className="text-text">Ado-Ekiti, Ekiti State, Nigeria</strong>.
                                We sell original phones, laptops, smartwatches, earbuds, power banks, and
                                accessories — including iPhone, Samsung, Tecno, MacBook, Dell, Apple Watch,
                                AirPods, Sony, Anker, and more. We deliver to Ekiti State and nationwide.
                            </p>

                            {SECTIONS.map((s) => (
                                <section key={s.id} id={s.id} className="mb-10 scroll-mt-24 not-prose">
                                    <h2 className="text-lg font-bold text-text mb-3">
                                        {s.title}
                                    </h2>
                                    <p className="text-text-muted leading-relaxed text-sm">{s.body}</p>
                                </section>
                            ))}

                            {/* CTA */}
                            <div className="mt-14 p-6 rounded-2xl bg-bg-subtle border
                border-border text-center not-prose">
                                <p className="text-text font-semibold mb-2">
                                    Ready to shop the latest gadgets in Ekiti?
                                </p>
                                <p className="text-text-faint text-sm mb-5">
                                    Browse our full range of phones, laptops, and accessories —
                                    delivered to your door across Ekiti State and Nigeria.
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-primary-500 hover:bg-primary-400 text-text-onprimary font-bold text-sm
                    transition-colors"
                                >
                                    Shop Now
                                </Link>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
}