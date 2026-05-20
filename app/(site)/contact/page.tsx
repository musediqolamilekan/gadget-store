"use client";

import Link from "next/link";
import {
    MessageCircle, Mail, Clock, MapPin,
    Instagram, Twitter, ChevronRight,
    Smartphone, Headphones, Zap,
} from "lucide-react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// CONTACT DATA
// ─────────────────────────────────────────────────────────────
const CONTACT_CHANNELS = [
    {
        Icon: MessageCircle,
        title: "WhatsApp",
        subtitle: "Fastest response — usually within minutes",
        value: "+234 905 542 7487",
        href: "https://wa.me/2349055427487?text=Hello%20HolarzGadgets%2C%20I%20have%20a%20question.",
        cta: "Chat Now",
        gradient: "from-emerald-500 to-teal-600",
        glow: "rgba(16,185,129,0.3)",
        external: true,
    },
    {
        Icon: Mail,
        title: "Email",
        subtitle: "For detailed enquiries — we reply within 24hrs",
        value: "holarzgadgets@gmail.com",
        href: "mailto:holarzgadgets@gmail.com",
        cta: "Send Email",
        gradient: "from-cyan-500 to-blue-600",
        glow: "rgba(6,182,212,0.3)",
        external: false,
    },
    {
        Icon: Instagram,
        title: "Instagram",
        subtitle: "Follow us for new arrivals and deals",
        value: "@horlarzgadgets",
        href: "https://instagram.com/horlarzgadgets",
        cta: "Follow Us",
        gradient: "from-pink-500 to-rose-600",
        glow: "rgba(236,72,153,0.3)",
        external: true,
    },
    {
        Icon: Twitter,
        title: "Twitter / X",
        subtitle: "DM us or tag us in your questions",
        value: "@horlarzgadgets",
        href: "https://twitter.com/horlarzgadgets",
        cta: "Follow Us",
        gradient: "from-slate-400 to-slate-600",
        glow: "rgba(148,163,184,0.2)",
        external: true,
    },
];

const WHY_ITEMS = [
    {
        Icon: Smartphone,
        title: "Order enquiries",
        desc: "Ask about a specific product, check availability, or get a price confirmation.",
    },
    {
        Icon: Zap,
        title: "After-sales support",
        desc: "Warranty claims, returns, or troubleshooting — we've got you covered.",
    },
    {
        Icon: Headphones,
        title: "Bulk & business orders",
        desc: "Need gadgets in bulk for your company or reselling? Let's talk deals.",
    },
];

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1, y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
};

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-950">

            {/* ── HERO ──────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-slate-950">
                {/* Ambient blobs */}
                <div aria-hidden className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-5%] w-96 h-96 rounded-full
            bg-cyan-500/8 blur-[100px]" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full
            bg-violet-600/8 blur-[100px]" />
                </div>

                <div className="container-app py-16 md:py-24 relative">
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
                        <span className="text-slate-400">Contact Us</span>
                    </motion.nav>

                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-cyan-500/10 border border-cyan-500/20 text-cyan-400
                text-xs font-semibold tracking-widest uppercase mb-6">
                                <MessageCircle size={11} />
                                We&apos;re always available
                            </div>
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-5xl font-black tracking-tight
                text-slate-50 leading-tight mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.12 }}
                        >
                            Get in touch with{" "}
                            <span className="text-gradient-cyan">HolarzGadgets</span>
                        </motion.h1>

                        <motion.p
                            className="text-slate-400 text-lg leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Have a question about a product, need help with an order, or want
                            to place a bulk purchase? Reach us through any of the channels below
                            — WhatsApp is the fastest.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* ── CONTACT CARDS ─────────────────────────────────── */}
            <section className="container-app pb-16">
                <motion.div
                    className="grid sm:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {CONTACT_CHANNELS.map(({
                        Icon, title, subtitle, value, href,
                        cta, gradient, glow, external,
                    }) => (
                        <motion.a
                            key={title}
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            variants={cardVariants}
                            whileHover={{
                                y: -4,
                                boxShadow: `0 20px 60px ${glow}`,
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="group flex flex-col gap-4 p-6 rounded-2xl
                bg-slate-900/60 border border-slate-800
                hover:border-slate-600
                transition-colors duration-300 cursor-pointer"
                        >
                            {/* Icon */}
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient}
                flex items-center justify-center
                shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={22} className="text-white" />
                            </div>

                            {/* Text */}
                            <div className="flex-1">
                                <h2 className="text-base font-bold text-slate-100 mb-0.5">
                                    {title}
                                </h2>
                                <p className="text-xs text-slate-500 mb-3">{subtitle}</p>
                                <p className="text-sm font-semibold text-cyan-400">{value}</p>
                            </div>

                            {/* CTA */}
                            <div className="flex items-center gap-2 text-sm font-bold text-slate-300
                group-hover:text-slate-100 transition-colors">
                                {cta}
                                <motion.span
                                    className="inline-block"
                                    animate={{ x: [0, 4, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                >
                                    →
                                </motion.span>
                            </div>
                        </motion.a>
                    ))}
                </motion.div>
            </section>

            {/* ── HOURS + LOCATION ──────────────────────────────── */}
            <section className="container-app pb-16">
                <motion.div
                    className="grid sm:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                >
                    {/* Hours */}
                    <motion.div
                        variants={fadeUp}
                        className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                <Clock size={18} className="text-amber-400" />
                            </div>
                            <h2 className="font-bold text-slate-200">Business Hours</h2>
                        </div>
                        <div className="space-y-2.5">
                            {[
                                { day: "Monday – Friday", hours: "8:00 AM – 8:00 PM" },
                                { day: "Saturday", hours: "9:00 AM – 7:00 PM" },
                                { day: "Sunday", hours: "Closed" },
                            ].map(({ day, hours }) => (
                                <div key={day} className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">{day}</span>
                                    <span className={`text-sm font-semibold ${hours === "Closed" ? "text-rose-400" : "text-slate-200"
                                        }`}>
                                        {hours}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-xs text-slate-500">
                            All times in West Africa Time (WAT, UTC+1)
                        </p>
                    </motion.div>

                    {/* Location */}
                    <motion.div
                        variants={fadeUp}
                        className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800"
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                                <MapPin size={18} className="text-cyan-400" />
                            </div>
                            <h2 className="font-bold text-slate-200">Location</h2>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-200">
                                Ado-Ekiti, Ekiti State, Nigeria
                            </p>
                            <p className="text-sm text-slate-400">
                                We are an online-first store. Orders are placed via our website
                                and confirmed on WhatsApp. We deliver to Ado-Ekiti, Ikere-Ekiti,
                                Ikole-Ekiti, and nationwide.
                            </p>
                        </div>
                        <a
                            href="https://wa.me/2349055427487?text=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20pickup%20options."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-4 text-xs font-semibold
                text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            <MessageCircle size={12} />
                            Ask about pickup options
                        </a>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── WHY CONTACT US ────────────────────────────────── */}
            <section className="container-app pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <p className="text-xs font-bold tracking-widest uppercase
            text-cyan-400/80 mb-2">
                        How we can help
                    </p>
                    <h2 className="text-2xl font-black tracking-tight text-slate-50">
                        What to reach us about
                    </h2>
                </motion.div>

                <motion.div
                    className="grid sm:grid-cols-3 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                >
                    {WHY_ITEMS.map(({ Icon, title, desc }) => (
                        <motion.div
                            key={title}
                            variants={cardVariants}
                            className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80"
                        >
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center
                justify-center mb-4">
                                <Icon size={18} className="text-cyan-400" />
                            </div>
                            <h3 className="font-bold text-slate-200 mb-1.5">{title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── FINAL CTA ─────────────────────────────────────── */}
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

                    <motion.div
                        className="relative"
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16
              rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600
              mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                            <MessageCircle size={28} className="text-white" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black tracking-tight
              text-slate-50 mb-3">
                            Still have questions?
                        </h2>
                        <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Our team is on WhatsApp and ready to help you find the perfect gadget,
                            check stock, or sort out any issue — fast.
                        </p>

                        <div className="flex gap-3 justify-center flex-wrap">
                            <motion.a
                                href="https://wa.me/2349055427487?text=Hello%20HolarzGadgets%2C%20I%20have%20a%20question."
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                  bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm
                  shadow-[0_0_25px_rgba(16,185,129,0.4)]
                  hover:shadow-[0_0_40px_rgba(16,185,129,0.6)]
                  transition-all duration-200"
                            >
                                <MessageCircle size={16} />
                                Chat on WhatsApp
                            </motion.a>

                            <motion.a
                                href="mailto:holarzgadgets@gmail.com"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                  bg-slate-800 hover:bg-slate-700 border border-slate-700
                  text-slate-200 font-bold text-sm transition-all duration-200"
                            >
                                <Mail size={16} />
                                Send Email
                            </motion.a>
                        </div>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// METADATA  (exported from a separate server-side export)
// ─────────────────────────────────────────────────────────────
export const dynamic = "force-static";