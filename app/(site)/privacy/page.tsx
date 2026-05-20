import type { Metadata } from "next";
import Link from "next/link";
import { Shield, ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// SEO METADATA
// ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
    title: "Privacy Policy | HolarzGadgets – Phone & Gadget Store in Ekiti",
    description:
        "Learn how HolarzGadgets collects, uses, and protects your personal data. We are Ekiti's trusted gadget store — selling phones, laptops, earbuds, and accessories across Nigeria.",
    keywords: [
        "phone shop Ekiti",
        "gadget store Ekiti State",
        "buy phones Ado-Ekiti",
        "HolarzGadgets privacy",
        "best gadget store Ekiti",
        "original phones Ekiti",
        "Samsung iPhone Ekiti Nigeria",
    ],
    alternates: {
        canonical: "https://horlarzgadgets.com/privacy",
    },
    openGraph: {
        title: "Privacy Policy | HolarzGadgets Ekiti",
        description: "How HolarzGadgets handles your data — Ekiti's #1 gadget store.",
        url: "https://horlarzgadgets.com/privacy",
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
                "HolarzGadgets is Ekiti State's number one online store for original smartphones, laptops, smartwatches, power banks, earbuds and tech accessories. Serving Ado-Ekiti, Ikere-Ekiti, Ikole-Ekiti, Ilawe-Ekiti and all of Nigeria.",
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
            sameAs: ["https://wa.me/2349055427487"],
        },
        {
            "@type": "WebPage",
            "@id": "https://horlarzgadgets.com/privacy",
            url: "https://horlarzgadgets.com/privacy",
            name: "Privacy Policy — HolarzGadgets",
            isPartOf: { "@id": "https://horlarzgadgets.com/#business" },
            datePublished: "2024-01-01",
            dateModified: "2025-01-01",
            inLanguage: "en-NG",
        },
        {
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type": "Question",
                    name: "Where is HolarzGadgets located?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "HolarzGadgets is based in Ado-Ekiti, Ekiti State, Nigeria. We deliver gadgets to all 36 states including Lagos, Abuja, Ibadan, Port Harcourt, and across Ekiti State.",
                    },
                },
                {
                    "@type": "Question",
                    name: "Do you sell original phones in Ekiti?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. HolarzGadgets sells 100% original iPhones, Samsung Galaxy, Tecno, Infinix, Google Pixel, and other premium smartphones in Ekiti State and Nigeria.",
                    },
                },
                {
                    "@type": "Question",
                    name: "How do I buy a gadget from HolarzGadgets?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Browse our online store at horlarzgadgets.com, add items to your cart, and place your order. You will be redirected to WhatsApp to confirm your order and receive delivery details.",
                    },
                },
                {
                    "@type": "Question",
                    name: "Do you deliver to Ikere-Ekiti and other towns in Ekiti?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes. We deliver to Ado-Ekiti, Ikere-Ekiti, Ikole-Ekiti, Ilawe-Ekiti, Aramoko-Ekiti, and all other towns in Ekiti State, as well as nationwide across Nigeria.",
                    },
                },
            ],
        },
    ],
};

// ─────────────────────────────────────────────────────────────
// SECTIONS DATA
// ─────────────────────────────────────────────────────────────
const SECTIONS = [
    {
        id: "overview",
        title: "1. Overview",
        body: `HolarzGadgets ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit horlarzgadgets.com or make a purchase. By using our site, you agree to the practices described in this policy. We are based in Ado-Ekiti, Ekiti State, Nigeria, and we serve customers across Ekiti State and all of Nigeria.`,
    },
    {
        id: "collection",
        title: "2. Information We Collect",
        body: `We collect information you provide directly when placing an order — including your full name, phone number, WhatsApp number, email address, and delivery address. We also collect information automatically when you browse our website, such as your IP address, browser type, pages visited, and time spent on pages. We do not collect or store payment card numbers. All payment confirmation is handled via WhatsApp and bank transfer.`,
    },
    {
        id: "use",
        title: "3. How We Use Your Information",
        body: `We use your information to process and fulfil your orders; contact you on WhatsApp to confirm orders and provide delivery updates; send you promotional messages about new products, restocks, and offers (only if you opt in); improve our website and product offerings based on usage data; comply with legal obligations under Nigerian law; and resolve disputes or investigate fraud.`,
    },
    {
        id: "whatsapp",
        title: "4. WhatsApp Communication",
        body: `Our order confirmation and customer service are handled via WhatsApp. When you place an order, your name, phone number, address, and order details are shared with our team via WhatsApp to process your delivery. We do not share this information with any third parties outside of delivery fulfilment. WhatsApp messages are governed by Meta's own Privacy Policy.`,
    },
    {
        id: "sharing",
        title: "5. Sharing of Information",
        body: `We do not sell, rent, or trade your personal information to third parties. We may share your delivery address and name with courier services solely for the purpose of delivering your order. We may disclose your information if required to do so by law or in response to a valid legal process from Nigerian authorities.`,
    },
    {
        id: "cookies",
        title: "6. Cookies",
        body: `Our website uses cookies to improve your browsing experience, remember your cart items, and analyse site traffic. Cookies are small text files stored on your device. You can control cookie settings through your browser. Disabling cookies may affect some functionality on our website. We do not use cookies to track your activity across other websites.`,
    },
    {
        id: "retention",
        title: "7. Data Retention",
        body: `We retain your order information for up to 2 years for warranty, return, and tax purposes. You may request deletion of your personal data at any time by contacting us on WhatsApp. We will honour such requests unless we are legally required to retain the data.`,
    },
    {
        id: "security",
        title: "8. Data Security",
        body: `We take reasonable steps to protect your personal information from unauthorised access, disclosure, or destruction. Our website is served over HTTPS with SSL encryption. However, no method of electronic transmission is 100% secure. We cannot guarantee absolute security, and you use our services at your own risk in this regard.`,
    },
    {
        id: "rights",
        title: "9. Your Rights",
        body: `Under the Nigeria Data Protection Act (NDPA) 2023, you have the right to access the personal data we hold about you; request correction of inaccurate data; request deletion of your data; object to how we use your data; and lodge a complaint with the Nigeria Data Protection Commission (NDPC). To exercise any of these rights, contact us via WhatsApp: +234 905 542 7487.`,
    },
    {
        id: "children",
        title: "10. Children's Privacy",
        body: `Our services are not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately and we will delete it.`,
    },
    {
        id: "thirdparty",
        title: "11. Third-Party Links",
        body: `Our website may contain links to third-party websites such as manufacturer pages, review sites, or social media. We are not responsible for the privacy practices of those sites. We encourage you to review the privacy policy of any external site you visit.`,
    },
    {
        id: "changes",
        title: "12. Changes to This Policy",
        body: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated date. We encourage you to review this page periodically. Continued use of our services after changes are posted constitutes your acceptance of the revised policy.`,
    },
    {
        id: "contact",
        title: "13. Contact Us",
        body: `If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us on WhatsApp: +234 905 542 7487. You can also reach us through the contact form on our website. We are available Monday – Saturday, 8am – 8pm WAT.`,
    },
];

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function PrivacyPage() {
    return (
        <>
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-slate-950">
                {/* ── Hero ──────────────────────────────────────── */}
                <section className="relative overflow-hidden bg-slate-900/50 border-b border-slate-800/60">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl" />
                    </div>
                    <div className="container-app py-14 relative">
                        {/* Breadcrumb */}
                        <nav
                            aria-label="Breadcrumb"
                            className="flex items-center gap-1.5 text-xs text-slate-500 mb-6"
                        >
                            <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
                            <ChevronRight size={12} />
                            <span className="text-slate-400">Privacy Policy</span>
                        </nav>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                <Shield size={18} className="text-violet-400" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50">
                                Privacy Policy
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm max-w-xl">
                            Last updated: <strong className="text-slate-300">1 January 2025</strong>.
                            HolarzGadgets is committed to protecting the privacy of our customers
                            across Ekiti State and all of Nigeria.
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
                  text-slate-500 mb-3">
                                    Contents
                                </p>
                                {SECTIONS.map((s) => (
                                    <a
                                        key={s.id}
                                        href={`#${s.id}`}
                                        className="block text-xs text-slate-500 hover:text-violet-400
                      transition-colors py-1 border-l-2 border-slate-800
                      hover:border-violet-500 pl-3"
                                    >
                                        {s.title}
                                    </a>
                                ))}
                            </div>
                        </aside>

                        {/* Content */}
                        <article className="max-w-none">
                            {/* SEO-rich intro */}
                            <div className="text-slate-400 text-sm leading-relaxed mb-10
                p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                                <strong className="text-slate-200">HolarzGadgets</strong> is Ekiti
                                State&apos;s leading online store for original and affordable gadgets. We sell
                                iPhones, Samsung Galaxy phones, MacBooks, laptops, Apple Watch, Samsung
                                Galaxy Watch, AirPods, Sony earbuds, Anker power banks, and all kinds of
                                tech accessories. We are based in{" "}
                                <strong className="text-slate-200">Ado-Ekiti, Ekiti State</strong> and
                                deliver to Ikere-Ekiti, Ikole-Ekiti, Ilawe-Ekiti, and nationwide across
                                Nigeria.
                            </div>

                            {SECTIONS.map((s) => (
                                <section key={s.id} id={s.id} className="mb-10 scroll-mt-24">
                                    <h2 className="text-lg font-bold text-slate-100 mb-3">
                                        {s.title}
                                    </h2>
                                    <p className="text-slate-400 leading-relaxed text-sm">{s.body}</p>
                                </section>
                            ))}

                            {/* FAQ Section — targets featured snippet */}
                            <section className="mt-14" id="faq">
                                <h2 className="text-2xl font-black text-slate-50 mb-8">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        {
                                            q: "Where is HolarzGadgets located?",
                                            a: "HolarzGadgets is based in Ado-Ekiti, Ekiti State, Nigeria. We deliver to all towns in Ekiti State including Ikere-Ekiti, Ikole-Ekiti, Ilawe-Ekiti, and Aramoko-Ekiti, as well as nationwide across all 36 states.",
                                        },
                                        {
                                            q: "Do you sell original phones in Ekiti?",
                                            a: "Yes. HolarzGadgets sells 100% original smartphones including iPhone 16 Pro Max, Samsung Galaxy S25 Ultra, Tecno Phantom, Infinix Note, and Google Pixel. All products come with a seller warranty.",
                                        },
                                        {
                                            q: "How do I buy a phone or gadget from HolarzGadgets?",
                                            a: "Visit horlarzgadgets.com, browse our products, add your items to cart, and proceed to checkout. You will be redirected to WhatsApp to confirm your order and get payment details.",
                                        },
                                        {
                                            q: "Do you deliver to Ikere-Ekiti and other towns in Ekiti?",
                                            a: "Yes. We deliver to all major towns in Ekiti State and offer free delivery on orders above ₦50,000. Delivery within Ado-Ekiti may be available same-day or next-day.",
                                        },
                                        {
                                            q: "What is the best phone to buy in Ekiti in 2025?",
                                            a: "Popular choices at HolarzGadgets include the iPhone 16 Pro Max, Samsung Galaxy S25 Ultra, and the Tecno Phantom V Flip2 for those who want a foldable. For budget options, the Infinix Note 40 Pro and Samsung Galaxy A55 5G are bestsellers.",
                                        },
                                    ].map(({ q, a }) => (
                                        <details
                                            key={q}
                                            className="group rounded-xl bg-slate-900/50 border border-slate-800
                        overflow-hidden"
                                        >
                                            <summary className="flex items-center justify-between px-5 py-4
                        cursor-pointer text-sm font-semibold text-slate-200
                        hover:text-cyan-400 transition-colors list-none">
                                                {q}
                                                <ChevronRight
                                                    size={14}
                                                    className="text-slate-500 group-open:rotate-90
                            transition-transform duration-200 flex-shrink-0 ml-3"
                                                />
                                            </summary>
                                            <div className="px-5 pb-4">
                                                <p className="text-slate-400 text-sm leading-relaxed">{a}</p>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </section>

                            {/* CTA */}
                            <div className="mt-14 p-6 rounded-2xl bg-slate-900/60 border
                border-slate-800 text-center">
                                <p className="text-slate-300 font-semibold mb-2">
                                    Shop the best gadgets in Ekiti State
                                </p>
                                <p className="text-slate-500 text-sm mb-5">
                                    Original phones, laptops, smartwatches, and accessories — delivered
                                    to your door anywhere in Ekiti and Nigeria.
                                </p>
                                <div className="flex gap-3 justify-center flex-wrap">
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                      bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm
                      transition-colors"
                                    >
                                        Browse Products
                                    </Link>
                                    <a
                                        href="https://wa.me/2349055427487"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                      bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm
                      transition-colors"
                                    >
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </>
    );
}