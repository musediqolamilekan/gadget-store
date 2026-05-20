"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, HelpCircle, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// JSON-LD
// ─────────────────────────────────────────────────────────────
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "Where is HolarzGadgets located?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "HolarzGadgets is based in Ado-Ekiti, Ekiti State, Nigeria. We are an online-first store and deliver to all towns in Ekiti State and all 36 states in Nigeria.",
            },
        },
        {
            "@type": "Question",
            name: "Do you sell original (not fake) phones and gadgets?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. HolarzGadgets sells 100% original, brand-new gadgets sourced from authorised distributors. We do not sell refurbished, cloned, or fake products.",
            },
        },
        {
            "@type": "Question",
            name: "How do I place an order on HolarzGadgets?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Browse our website at horlarzgadgets.com, add items to your cart, and proceed to checkout. After submitting your delivery details, you will be redirected to WhatsApp to confirm your order and receive payment instructions.",
            },
        },
        {
            "@type": "Question",
            name: "How do I pay for my order?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "We accept bank transfer to our verified Opay account. Payment details are shared via WhatsApp after your order is confirmed. We do not accept cash on delivery at this time.",
            },
        },
        {
            "@type": "Question",
            name: "How long does delivery take in Ekiti State?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Delivery within Ado-Ekiti is typically same-day or next-day. Other towns in Ekiti State usually take 1–2 business days. Nationwide delivery across Nigeria takes 1–5 business days depending on your location.",
            },
        },
        {
            "@type": "Question",
            name: "Is there free shipping?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Orders above ₦50,000 qualify for free delivery. Orders below this amount attract a flat shipping fee of ₦3,500.",
            },
        },
        {
            "@type": "Question",
            name: "Can I return a product if I change my mind?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "We accept returns within 7 days of delivery for items that are defective, damaged, or significantly different from the product description. Items must be in original packaging with all accessories. Contact us on WhatsApp to initiate a return.",
            },
        },
        {
            "@type": "Question",
            name: "Do the products come with warranty?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. All products come with a minimum 6-month seller warranty in addition to any manufacturer warranty. For Apple, Samsung, and other brands with local service centres in Nigeria, we help you navigate the manufacturer warranty process.",
            },
        },
        {
            "@type": "Question",
            name: "Do you sell iPhones in Ekiti?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. HolarzGadgets sells original iPhones including the latest iPhone 16 Pro Max, iPhone 16 Pro, iPhone 15 series, and more. All iPhones are brand new and come with a warranty.",
            },
        },
        {
            "@type": "Question",
            name: "Do you deliver to Ikere-Ekiti, Ikole-Ekiti and other Ekiti towns?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. We deliver to all towns in Ekiti State including Ikere-Ekiti, Ikole-Ekiti, Ilawe-Ekiti, Aramoko-Ekiti, Oye-Ekiti, Ido-Ekiti, and Emure-Ekiti.",
            },
        },
        {
            "@type": "Question",
            name: "Can I buy gadgets in bulk for my business?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. We offer special pricing for bulk and business orders. Contact us on WhatsApp at +234 905 542 7487 to discuss bulk pricing and availability.",
            },
        },
        {
            "@type": "Question",
            name: "What brands do you sell?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "We carry Apple, Samsung, Google, Tecno, Infinix, Sony, Anker, Baseus, Xiaomi, Oraimo, Dell, HP, Lenovo, Asus, Garmin, Belkin, Logitech, and many more.",
            },
        },
    ],
};

// ─────────────────────────────────────────────────────────────
// FAQ DATA  (grouped by category)
// ─────────────────────────────────────────────────────────────
const FAQ_GROUPS = [
    {
        category: "Ordering & Payment",
        color: "cyan",
        faqs: [
            {
                q: "How do I place an order on HolarzGadgets?",
                a: "Browse our website at horlarzgadgets.com, add items to your cart, and proceed to checkout. After submitting your delivery details, you will be redirected to WhatsApp to confirm your order and receive payment instructions.",
            },
            {
                q: "How do I pay for my order?",
                a: "We accept bank transfer to our verified Opay account. Payment details are shared via WhatsApp after your order is confirmed. We do not accept cash on delivery at this time.",
            },
            {
                q: "Can I reserve a product before paying?",
                a: "Yes — for high-demand items, chat us on WhatsApp and we can hold a unit for you for up to 24 hours while you arrange payment.",
            },
            {
                q: "Can I buy gadgets in bulk for my business?",
                a: "Yes. We offer special pricing for bulk and business orders. Contact us on WhatsApp at +234 905 542 7487 to discuss bulk pricing and availability.",
            },
        ],
    },
    {
        category: "Delivery & Shipping",
        color: "violet",
        faqs: [
            {
                q: "How long does delivery take in Ekiti State?",
                a: "Delivery within Ado-Ekiti is typically same-day or next-day. Other towns in Ekiti State usually take 1–2 business days. Nationwide delivery across Nigeria takes 1–5 business days depending on your location.",
            },
            {
                q: "Is there free shipping?",
                a: "Yes. Orders above ₦50,000 qualify for free delivery anywhere in Nigeria. Orders below this attract a flat shipping fee of ₦3,500.",
            },
            {
                q: "Do you deliver to Ikere-Ekiti, Ikole-Ekiti and other Ekiti towns?",
                a: "Yes. We deliver to all towns in Ekiti State including Ikere-Ekiti, Ikole-Ekiti, Ilawe-Ekiti, Aramoko-Ekiti, Oye-Ekiti, Ido-Ekiti, and Emure-Ekiti. We also deliver nationwide.",
            },
            {
                q: "How will I know when my order has been dispatched?",
                a: "Once your order is dispatched, we will send you a WhatsApp message with the tracking details or courier contact so you can monitor your delivery.",
            },
        ],
    },
    {
        category: "Products & Authenticity",
        color: "emerald",
        faqs: [
            {
                q: "Do you sell original (not fake) phones and gadgets?",
                a: "Yes. HolarzGadgets sells 100% original, brand-new gadgets sourced from authorised distributors. We do not sell refurbished, cloned, or fake products — ever.",
            },
            {
                q: "Do you sell iPhones in Ekiti?",
                a: "Yes. We sell original iPhones including the latest iPhone 16 Pro Max, iPhone 16 Pro, iPhone 15 series, and more. All iPhones are brand new, sealed, and come with a seller warranty.",
            },
            {
                q: "What brands do you sell?",
                a: "We carry Apple, Samsung, Google, Tecno, Infinix, Sony, Anker, Baseus, Xiaomi, Oraimo, Dell, HP, Lenovo, Asus, Garmin, Belkin, Logitech, and many more.",
            },
            {
                q: "Can I see the product before buying?",
                a: "We are an online-first store so in-person viewing is not available. However, all our product listings include detailed specifications and authentic images. You can also chat us on WhatsApp for more details or videos of a specific product.",
            },
        ],
    },
    {
        category: "Returns & Warranty",
        color: "amber",
        faqs: [
            {
                q: "Can I return a product if it is defective?",
                a: "Yes. We accept returns within 7 days of delivery for items that are defective, damaged, or significantly different from the product description. Items must be in original packaging with all accessories. Contact us on WhatsApp to initiate a return.",
            },
            {
                q: "Do the products come with warranty?",
                a: "Yes. All products come with a minimum 6-month seller warranty in addition to any manufacturer warranty. For Apple, Samsung, and other brands with local service centres in Nigeria, we help you navigate the manufacturer warranty process.",
            },
            {
                q: "What if my item arrives damaged?",
                a: "Take photos or a video of the damaged item immediately and send them to us on WhatsApp. We will arrange a replacement or refund as quickly as possible.",
            },
        ],
    },
];

// ─────────────────────────────────────────────────────────────
// ACCORDION ITEM
// ─────────────────────────────────────────────────────────────
function AccordionItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-slate-800/60 last:border-0">
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-start justify-between gap-4 py-5
          text-left group"
            >
                <span className={`text-sm font-semibold transition-colors
          ${open ? "text-cyan-400" : "text-slate-200 group-hover:text-slate-100"}`}>
                    {q}
                </span>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 mt-0.5"
                >
                    <ChevronDown
                        size={16}
                        className={`transition-colors ${open ? "text-cyan-400" : "text-slate-500"}`}
                    />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="text-slate-400 text-sm leading-relaxed pb-5 pr-8">
                            {a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// COLOR MAP
// ─────────────────────────────────────────────────────────────
const COLOR = {
    cyan: { dot: "bg-cyan-500", label: "text-cyan-400", border: "border-cyan-500/30" },
    violet: { dot: "bg-violet-500", label: "text-violet-400", border: "border-violet-500/30" },
    emerald: { dot: "bg-emerald-500", label: "text-emerald-400", border: "border-emerald-500/30" },
    amber: { dot: "bg-amber-500", label: "text-amber-400", border: "border-amber-500/30" },
} as const;

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function FAQPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-slate-950">

                {/* ── HERO ──────────────────────────────────────── */}
                <section className="relative overflow-hidden bg-slate-900/50
          border-b border-slate-800/60">
                    <div aria-hidden className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-96 h-96 rounded-full
              bg-cyan-500/6 blur-3xl" />
                    </div>

                    <div className="container-app py-14 relative">
                        {/* Breadcrumb */}
                        <motion.nav
                            aria-label="Breadcrumb"
                            className="flex items-center gap-1.5 text-xs text-slate-500 mb-8"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Link href="/" className="hover:text-slate-300 transition-colors">
                                Home
                            </Link>
                            <ChevronRight size={12} />
                            <span className="text-slate-400">FAQ</span>
                        </motion.nav>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10
                  flex items-center justify-center">
                                    <HelpCircle size={18} className="text-cyan-400" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight
                  text-slate-50">
                                    Frequently Asked Questions
                                </h1>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Everything you need to know about ordering from{" "}
                                <strong className="text-slate-200">HolarzGadgets</strong> —
                                Ekiti State&apos;s most trusted gadget store. Can&apos;t find your
                                answer?{" "}
                                <a
                                    href="https://wa.me/2349055427487"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cyan-400 hover:text-cyan-300 transition-colors
                    font-medium"
                                >
                                    Chat us on WhatsApp
                                </a>
                                .
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* ── FAQ GROUPS ────────────────────────────────── */}
                <div className="container-app py-14 space-y-8">
                    {FAQ_GROUPS.map((group, gi) => {
                        const c = COLOR[group.color as keyof typeof COLOR];
                        return (
                            <motion.section
                                key={group.category}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-60px" }}
                                transition={{ duration: 0.5, delay: gi * 0.08 }}
                                className={`rounded-2xl bg-slate-900/50 border ${c.border}
                  overflow-hidden`}
                            >
                                {/* Category header */}
                                <div className="flex items-center gap-3 px-6 py-4
                  border-b border-slate-800/60">
                                    <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                                    <h2 className={`text-xs font-bold tracking-widest uppercase
                    ${c.label}`}>
                                        {group.category}
                                    </h2>
                                </div>

                                {/* Accordion items */}
                                <div className="px-6">
                                    {group.faqs.map(({ q, a }) => (
                                        <AccordionItem key={q} q={q} a={a} />
                                    ))}
                                </div>
                            </motion.section>
                        );
                    })}
                </div>

                {/* ── STILL NEED HELP ───────────────────────────── */}
                <section className="container-app pb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative overflow-hidden rounded-3xl
              bg-gradient-to-br from-emerald-900/30 via-slate-900 to-cyan-900/30
              border border-emerald-500/20 p-8 md:p-12 text-center"
                    >
                        <div aria-hidden className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-0 right-0 w-64 h-64 rounded-full
                bg-emerald-500/8 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full
                bg-cyan-500/8 blur-3xl" />
                        </div>

                        <div className="relative">
                            <div className="inline-flex items-center justify-center w-14 h-14
                rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600
                mb-5 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                                <MessageCircle size={24} className="text-white" />
                            </div>

                            <h2 className="text-2xl font-black tracking-tight text-slate-50 mb-3">
                                Still have a question?
                            </h2>
                            <p className="text-slate-400 text-sm mb-7 max-w-sm mx-auto">
                                Our team replies in minutes on WhatsApp. Ask us anything about
                                products, delivery, pricing, or your order.
                            </p>

                            <div className="flex gap-3 justify-center flex-wrap">
                                <motion.a
                                    href="https://wa.me/2349055427487?text=Hello%20HolarzGadgets%2C%20I%20have%20a%20question%20not%20in%20your%20FAQ."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                    bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm
                    shadow-[0_0_20px_rgba(16,185,129,0.35)]
                    transition-all duration-200"
                                >
                                    <MessageCircle size={15} />
                                    Chat on WhatsApp
                                </motion.a>

                                <motion.div
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Link
                                        href="/products"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                      bg-slate-800 hover:bg-slate-700 border border-slate-700
                      text-slate-200 font-bold text-sm transition-colors"
                                    >
                                        Browse Products
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </section>
            </div>
        </>
    );
}