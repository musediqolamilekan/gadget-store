"use client";

import Link from "next/link";
import {
    Zap, ShieldCheck, Truck, Headset,
    Star, MapPin, Users, Package,
    MessageCircle, ChevronRight, BadgeCheck,
    Smartphone, Laptop, Watch, BatteryCharging,
    Headphones, Cable,
} from "lucide-react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// JSON-LD  (rendered as a script tag for Google)
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
            email: "holarzgadgets@gmail.com",
            description:
                "HolarzGadgets is the leading online gadget store in Ekiti State, Nigeria. We sell 100% original smartphones, laptops, smartwatches, earbuds, power banks and accessories. Based in Ado-Ekiti and delivering across all 36 states.",
            foundingDate: "2023",
            founder: {
                "@type": "Person",
                name: "Oyewole Sheriffdeen",
            },
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
                "Ado-Ekiti", "Ikere-Ekiti", "Ikole-Ekiti", "Ilawe-Ekiti",
                "Aramoko-Ekiti", "Oye-Ekiti", "Ekiti State", "Nigeria",
            ],
            priceRange: "₦₦",
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "1200",
                bestRating: "5",
            },
        },
        {
            "@type": "AboutPage",
            "@id": "https://horlarzgadgets.com/about",
            url: "https://horlarzgadgets.com/about",
            name: "About HolarzGadgets",
            isPartOf: { "@id": "https://horlarzgadgets.com/#business" },
            inLanguage: "en-NG",
            datePublished: "2023-01-01",
            dateModified: "2025-01-01",
        },
    ],
};

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const STATS = [
    { value: "1,200+", label: "Happy Customers", Icon: Users },
    { value: "500+", label: "Products Available", Icon: Package },
    { value: "4.9★", label: "Average Rating", Icon: Star },
    { value: "2023", label: "Year Founded", Icon: Zap },
];

const VALUES = [
    {
        Icon: ShieldCheck,
        title: "100% Originality",
        desc: "Every product we sell is genuine and sourced from authorised distributors. No refurbished, no clones — ever.",
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
    },
    {
        Icon: Truck,
        title: "Fast Nationwide Delivery",
        desc: "We deliver to all 36 states in Nigeria. Orders within Ado-Ekiti may qualify for same-day or next-day delivery.",
        color: "text-violet-400",
        bg: "bg-violet-500/10",
    },
    {
        Icon: Headset,
        title: "Dedicated Support",
        desc: "Our team is available Monday to Saturday on WhatsApp. We don't disappear after the sale.",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
    },
    {
        Icon: BadgeCheck,
        title: "Competitive Pricing",
        desc: "We work directly with trusted suppliers to offer the best prices in Ekiti and across Nigeria — no middlemen.",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
    },
];

const CATEGORIES = [
    { Icon: Smartphone, label: "Phones", slug: "phones" },
    { Icon: Laptop, label: "Laptops", slug: "laptops" },
    { Icon: Watch, label: "Smartwatches", slug: "smartwatches" },
    { Icon: BatteryCharging, label: "Power Banks", slug: "power-banks" },
    { Icon: Headphones, label: "Earbuds", slug: "earbuds" },
    { Icon: Cable, label: "Accessories", slug: "accessories" },
];

const BRANDS = [
    "Apple", "Samsung", "Google", "Tecno", "Infinix",
    "Sony", "Anker", "Baseus", "Xiaomi", "Oraimo",
    "Dell", "HP", "Lenovo", "Asus", "Garmin",
];

const TESTIMONIALS = [
    {
        name: "Adeyemi Folake",
        location: "Ado-Ekiti",
        text: "I ordered an iPhone 16 Pro Max and it arrived the next day. 100% original, sealed box. HolarzGadgets is the real deal in Ekiti!",
        rating: 5,
    },
    {
        name: "Bello Tunde",
        location: "Ikere-Ekiti",
        text: "Best place to buy gadgets in Ekiti State. Got my MacBook M4 at a very good price. Customer service on WhatsApp is top-notch.",
        rating: 5,
    },
    {
        name: "Adesola Chinwe",
        location: "Ikole-Ekiti",
        text: "Ordered AirPods Pro and a power bank. Both delivered within 2 days. Very trustworthy and professional. Will order again!",
        rating: 5,
    },
];

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
};

const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cardAnim = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
};

const slideLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
        opacity: 1, x: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

const slideRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1, x: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
};

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function AboutPage() {
    return (
        <>
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-slate-950">

                {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
                <section className="relative overflow-hidden bg-slate-950">
                    <div aria-hidden className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px]
              rounded-full bg-cyan-500/8 blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px]
              rounded-full bg-violet-600/8 blur-[120px]" />
                        <div
                            className="absolute inset-0 opacity-[0.025]"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />
                    </div>

                    <div className="container-app pt-14 pb-20 relative">
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
                            <span className="text-slate-400">About Us</span>
                        </motion.nav>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left */}
                            <motion.div
                                variants={slideLeft}
                                initial="hidden"
                                animate="visible"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: 0.05 }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                    bg-cyan-500/10 border border-cyan-500/20 text-cyan-400
                    text-xs font-semibold tracking-widest uppercase mb-6"
                                >
                                    <MapPin size={11} />
                                    Based in Ado-Ekiti, Ekiti State
                                </motion.div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black
                  tracking-tighter leading-[1.05] text-slate-50 mb-5">
                                    Ekiti&apos;s most trusted{" "}
                                    <span className="text-gradient-cyan">gadget store</span>
                                </h1>

                                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                                    HolarzGadgets was founded with one mission — to make premium,
                                    original technology accessible to everyone in Ekiti State and
                                    across Nigeria. No fakes. No overpricing. Just great gadgets,
                                    fast delivery, and honest service.
                                </p>

                                <div className="flex gap-3 flex-wrap">
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <Link
                                            href="/products"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                        bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm
                        shadow-[0_0_20px_rgba(6,182,212,0.35)]
                        transition-all duration-200"
                                        >
                                            Shop Now
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                        <a
                                            href="https://wa.me/2349055427487"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                        bg-slate-800 hover:bg-slate-700 border border-slate-700
                        text-slate-200 font-bold text-sm transition-colors"
                                        >
                                            <MessageCircle size={15} />
                                            WhatsApp Us
                                        </a>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Right — stat cards */}
                            <motion.div
                                className="grid grid-cols-2 gap-3"
                                variants={stagger}
                                initial="hidden"
                                animate="visible"
                            >
                                {STATS.map(({ value, label, Icon }) => (
                                    <motion.div
                                        key={label}
                                        variants={cardAnim}
                                        whileHover={{ y: -4, scale: 1.02 }}
                                        className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800
                      hover:border-slate-600 transition-colors text-center"
                                    >
                                        <Icon size={20} className="text-cyan-400 mx-auto mb-2" />
                                        <p className="text-2xl font-black text-gradient-cyan">{value}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
            OUR STORY
        ══════════════════════════════════════════════ */}
                <section className="section-padding bg-slate-900/30 border-y border-slate-800/60">
                    <div className="container-app">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">

                            {/* Story text */}
                            <motion.div
                                variants={slideLeft}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                            >
                                <p className="text-xs font-bold tracking-widest uppercase
                  text-cyan-400/80 mb-3">
                                    Our Story
                                </p>
                                <h2 className="text-3xl md:text-4xl font-black tracking-tight
                  text-slate-50 mb-5">
                                    Born in Ekiti,{" "}
                                    <span className="text-gradient-volt">built for Nigeria</span>
                                </h2>
                                <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
                                    <p>
                                        HolarzGadgets was started by{" "}
                                        <strong className="text-slate-200">Oyewole Sheriffdeen</strong> in
                                        Ado-Ekiti with a simple observation: getting a genuine, fairly-priced
                                        gadget in Ekiti State was unnecessarily hard. People either paid
                                        inflated prices at local shops or risked buying fake products online.
                                    </p>
                                    <p>
                                        We changed that. By building direct relationships with authorised
                                        distributors and manufacturers, we are able to offer 100% original
                                        iPhones, Samsung Galaxy phones, MacBooks, AirPods, and hundreds of
                                        other premium gadgets — at prices that are fair and transparent.
                                    </p>
                                    <p>
                                        Today, HolarzGadgets serves customers across{" "}
                                        <strong className="text-slate-200">
                                            Ado-Ekiti, Ikere-Ekiti, Ikole-Ekiti, Ilawe-Ekiti
                                        </strong>{" "}
                                        and all 36 states in Nigeria. Every order is personally confirmed via
                                        WhatsApp so you always know exactly what you&apos;re getting.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Visual — brand marquee */}
                            <motion.div
                                variants={slideRight}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                className="space-y-3"
                            >
                                <p className="text-xs font-bold tracking-widest uppercase
                  text-slate-500 mb-4">
                                    Brands we carry
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {BRANDS.map((brand, i) => (
                                        <motion.span
                                            key={brand}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.04, duration: 0.3 }}
                                            className="px-3 py-1.5 rounded-lg bg-slate-800/70 border
                        border-slate-700/60 text-sm font-semibold text-slate-300
                        hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
                                        >
                                            {brand}
                                        </motion.span>
                                    ))}
                                </div>

                                {/* Categories */}
                                <div className="mt-6 grid grid-cols-3 gap-2">
                                    {CATEGORIES.map(({ Icon, label, slug }) => (
                                        <Link
                                            key={slug}
                                            href={`/products?category=${slug}`}
                                            className="group flex flex-col items-center gap-2 p-3 rounded-xl
                        bg-slate-900/60 border border-slate-800
                        hover:border-cyan-500/30 hover:bg-slate-800/60
                        transition-all duration-200 text-center"
                                        >
                                            <Icon
                                                size={18}
                                                className="text-slate-500 group-hover:text-cyan-400
                          transition-colors"
                                            />
                                            <span className="text-[11px] text-slate-400
                        group-hover:text-slate-200 transition-colors font-medium">
                                                {label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
            VALUES
        ══════════════════════════════════════════════ */}
                <section className="section-padding bg-slate-950">
                    <div className="container-app">
                        <motion.div
                            className="text-center max-w-xl mx-auto mb-12"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-60px" }}
                        >
                            <p className="text-xs font-bold tracking-widest uppercase
                text-violet-400/80 mb-3">
                                What We Stand For
                            </p>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight
                text-slate-50">
                                Why customers choose{" "}
                                <span className="text-gradient-volt">HolarzGadgets</span>
                            </h2>
                        </motion.div>

                        <motion.div
                            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-60px" }}
                        >
                            {VALUES.map(({ Icon, title, desc, color, bg }) => (
                                <motion.div
                                    key={title}
                                    variants={cardAnim}
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800
                    hover:border-slate-600 transition-all duration-300"
                                >
                                    <div className={`w-11 h-11 rounded-xl ${bg} flex items-center
                    justify-center mb-4`}>
                                        <Icon size={20} className={color} />
                                    </div>
                                    <h3 className="font-bold text-slate-100 mb-2">{title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
            TESTIMONIALS
        ══════════════════════════════════════════════ */}
                <section className="section-padding bg-slate-900/30 border-t border-slate-800/60">
                    <div className="container-app">
                        <motion.div
                            className="text-center max-w-xl mx-auto mb-12"
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <p className="text-xs font-bold tracking-widest uppercase
                text-amber-400/80 mb-3">
                                Customer Reviews
                            </p>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-50">
                                What our customers{" "}
                                <span className="text-amber-400">say</span>
                            </h2>
                            <p className="text-slate-500 text-sm mt-3">
                                Real customers from across Ekiti State and Nigeria
                            </p>
                        </motion.div>

                        <motion.div
                            className="grid sm:grid-cols-3 gap-4"
                            variants={stagger}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-60px" }}
                        >
                            {TESTIMONIALS.map(({ name, location, text, rating }) => (
                                <motion.div
                                    key={name}
                                    variants={cardAnim}
                                    whileHover={{ y: -4 }}
                                    className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800
                    hover:border-amber-500/20 transition-all duration-300 flex flex-col gap-4"
                                >
                                    {/* Stars */}
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: rating }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={13}
                                                className="fill-amber-400 text-amber-400"
                                            />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <p className="text-slate-300 text-sm leading-relaxed flex-1">
                                        &ldquo;{text}&rdquo;
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br
                      from-cyan-500 to-violet-600 flex items-center justify-center
                      text-white text-xs font-black flex-shrink-0">
                                            {name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-200">{name}</p>
                                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                                <MapPin size={9} /> {location}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
            SERVICE AREAS  (SEO section)
        ══════════════════════════════════════════════ */}
                <section className="section-padding bg-slate-950">
                    <div className="container-app">
                        <motion.div
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <p className="text-xs font-bold tracking-widest uppercase
                text-cyan-400/80 mb-3">
                                Delivery Coverage
                            </p>
                            <h2 className="text-3xl font-black tracking-tight text-slate-50 mb-4">
                                We deliver everywhere in{" "}
                                <span className="text-gradient-cyan">Ekiti & Nigeria</span>
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                HolarzGadgets delivers original gadgets to every town in Ekiti State
                                including Ado-Ekiti, Ikere-Ekiti, Ikole-Ekiti, Ilawe-Ekiti,
                                Aramoko-Ekiti, Oye-Ekiti, Ido-Ekiti, Emure-Ekiti, and all 36 states
                                in Nigeria including Lagos, Abuja, Ibadan, Port Harcourt, Kano,
                                Enugu, Benin City, and more.
                            </p>

                            <div className="flex flex-wrap justify-center gap-2">
                                {[
                                    "Ado-Ekiti", "Ikere-Ekiti", "Ikole-Ekiti", "Ilawe-Ekiti",
                                    "Aramoko-Ekiti", "Oye-Ekiti", "Ido-Ekiti", "Emure-Ekiti",
                                    "Lagos", "Abuja", "Ibadan", "Port Harcourt", "Kano", "Enugu",
                                ].map((city, i) => (
                                    <motion.span
                                        key={city}
                                        initial={{ opacity: 0, scale: 0.85 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.03 }}
                                        className="px-3 py-1.5 rounded-full bg-slate-800/60
                      border border-slate-700/60 text-xs text-slate-400
                      font-medium"
                                    >
                                        {city}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════
            CTA
        ══════════════════════════════════════════════ */}
                <section className="section-padding bg-slate-950">
                    <div className="container-app">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55 }}
                            className="relative overflow-hidden rounded-3xl
                bg-gradient-to-br from-cyan-900/40 via-slate-900 to-violet-900/40
                border border-cyan-500/20 p-8 md:p-14 text-center"
                        >
                            <div aria-hidden className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-0 right-0 w-72 h-72 rounded-full
                  bg-cyan-500/10 blur-3xl" />
                                <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full
                  bg-violet-600/10 blur-3xl" />
                            </div>

                            <motion.div
                                className="relative"
                                initial={{ scale: 0.95, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16
                  rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 mb-6
                  shadow-[0_0_30px_rgba(6,182,212,0.4)]">
                                    <Zap size={28} className="text-white" />
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black tracking-tight
                  text-slate-50 mb-4">
                                    Ready to upgrade your tech?
                                </h2>
                                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                    Browse our full range of original gadgets — trusted by over 1,200
                                    customers across Ekiti State and Nigeria.
                                </p>

                                <div className="flex gap-3 justify-center flex-wrap">
                                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                        <Link
                                            href="/products"
                                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                        bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm
                        shadow-[0_0_25px_rgba(6,182,212,0.4)]
                        hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]
                        transition-all duration-200"
                                        >
                                            Browse Products
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                                        <a
                                            href="https://wa.me/2349055427487"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                        bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm
                        shadow-[0_0_25px_rgba(16,185,129,0.35)]
                        transition-all duration-200"
                                        >
                                            <MessageCircle size={16} />
                                            Chat on WhatsApp
                                        </a>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

            </div>
        </>
    );
}