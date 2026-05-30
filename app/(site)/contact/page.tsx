"use client";

import Link        from "next/link";
import {
  MessageCircle, Mail, Clock, MapPin,
  ChevronRight, Smartphone, Headphones, Zap,
} from "lucide-react";
import { motion } from "framer-motion";

// ─────────────────────────────────────────────────────────────
// CONTACT CHANNELS
// ─────────────────────────────────────────────────────────────
const CONTACT_CHANNELS = [
  {
    Icon:      MessageCircle,
    title:     "WhatsApp",
    subtitle:  "Fastest response — usually within minutes",
    value:     "+234 905 542 7487",
    href:      "https://wa.me/2349055427487?text=Hello%20HolarzGadgets%2C%20I%20have%20a%20question.",
    cta:       "Chat Now",
    gradient:  "from-emerald-500 to-teal-600",
    glowColor: "rgba(16,185,129,0.2)",
    external:  true,
  },
  {
    Icon:      Mail,
    title:     "Email",
    subtitle:  "For detailed enquiries — we reply within 24hrs",
    value:     "holarzgadgets@gmail.com",
    href:      "mailto:holarzgadgets@gmail.com",
    cta:       "Send Email",
    gradient:  "from-cyan-500 to-blue-600",
    glowColor: "rgba(6,182,212,0.2)",
    external:  false,
  },
];

const WHY_ITEMS = [
  { Icon: Smartphone,  title: "Order enquiries",
    desc: "Ask about a specific product, check availability, or get a price confirmation." },
  { Icon: Zap,         title: "After-sales support",
    desc: "Warranty claims, returns, or troubleshooting — we've got you covered." },
  { Icon: Headphones,  title: "Bulk & business orders",
    desc: "Need gadgets in bulk for your company or reselling? Let's talk deals." },
];

// ─────────────────────────────────────────────────────────────
// SOCIAL LINKS (inline — no separate import needed)
// ─────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label:    "WhatsApp",
    sublabel: "Order & Chat",
    href:     "https://wa.me/2349055427487",
    bg:       "bg-[#25D366]",
    glow:     "hover:shadow-[0_8px_24px_rgba(37,211,102,0.35)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.109.549 4.09 1.508 5.814L.057 23.25l5.575-1.462A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.361-.214-3.31.869.882-3.23-.235-.373A9.872 9.872 0 012.1 12c0-5.457 4.444-9.9 9.9-9.9 5.457 0 9.9 4.443 9.9 9.9 0 5.458-4.443 9.9-9.9 9.9z"/>
      </svg>
    ),
  },
  {
    label:    "Telegram",
    sublabel: "Join Channel",
    href:     "https://t.me/horlarzgadgets",
    bg:       "bg-[#229ED9]",
    glow:     "hover:shadow-[0_8px_24px_rgba(34,158,217,0.35)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.9l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.983.659z"/>
      </svg>
    ),
  },
  {
    label:    "TikTok",
    sublabel: "Watch Videos",
    href:     "https://tiktok.com/@horlarzgadgets",
    bg:       "bg-black",
    glow:     "hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
      </svg>
    ),
  },
  {
    label:    "Instagram",
    sublabel: "See Photos",
    href:     "https://instagram.com/horlarzgadgets",
    bg:       "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    glow:     "hover:shadow-[0_8px_24px_rgba(221,42,123,0.35)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label:    "Facebook",
    sublabel: "Like our Page",
    href:     "https://facebook.com/horlarzgadgets",
    bg:       "bg-[#1877F2]",
    glow:     "hover:shadow-[0_8px_24px_rgba(24,119,242,0.35)]",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label:    "Our Location",
    sublabel: "Ado-Ekiti, Ekiti",
    href:     "https://maps.google.com/?q=Ado-Ekiti,Ekiti+State,Nigeria",
    bg:       "bg-gradient-to-br from-primary-400 to-primary-600",
    glow:     "hover:shadow-[0_8px_24px_rgb(var(--color-primary-500)/30%)]",
    icon:     <MapPin size={24} className="text-white" />,
  },
];

const socialItemVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg">

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="bg-bg-subtle border-b border-border">
        <div className="container-app py-16 md:py-20">

          {/* Breadcrumb */}
          <motion.nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-text-faint mb-8"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1,  y:  0 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-text-muted">Contact Us</span>
          </motion.nav>

          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y:  0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                bg-primary-50 border border-primary-200 text-primary-600
                text-xs font-semibold tracking-widest uppercase mb-6"
            >
              <MessageCircle size={11} />
              We&apos;re always available
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl font-black tracking-tight
                text-text leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y:  0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Get in touch with{" "}
              <span className="text-gradient-primary">HolarzGadgets</span>
            </motion.h1>

            <motion.p
              className="text-text-muted text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y:  0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
            >
              Have a question about a product, need help with an order, or want
              to place a bulk purchase? Reach us through any of the channels
              below — WhatsApp is the fastest.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── CONTACT CARDS ─────────────────────────────── */}
      <section className="container-app pt-12 pb-10">
        <motion.div
          className="grid sm:grid-cols-2 gap-4 max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {CONTACT_CHANNELS.map(({
            Icon, title, subtitle, value, href,
            cta, gradient, glowColor, external,
          }) => (
            <motion.a
              key={title}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              variants={cardVariants}
              whileHover={{ y: -4, boxShadow: `0 20px 60px ${glowColor}` }}
              whileTap={{ scale: 0.98 }}
              className="group flex flex-col gap-4 p-6 rounded-2xl card
                hover:shadow-card-hover hover:border-primary-200
                transition-all duration-300 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient}
                flex items-center justify-center shadow-card
                group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-bold text-text mb-0.5">{title}</h2>
                <p className="text-xs text-text-faint mb-3">{subtitle}</p>
                <p className="text-sm font-semibold text-primary-600">{value}</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold
                text-text-muted group-hover:text-text transition-colors">
                {cta}
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >→</motion.span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* ── CONNECT WITH US (social links) ─────────────── */}
      <section className="container-app pb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-xs font-bold tracking-widest uppercase
            text-primary-500 mb-2">
            Find us online
          </p>
          <h2 className="text-2xl font-black tracking-tight text-text">
            Connect with us
          </h2>
        </motion.div>

        <div className="flex flex-wrap gap-6 md:gap-10">
          {SOCIALS.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              variants={socialItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ y: -6, scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full
                ${s.bg} ${s.glow}
                flex items-center justify-center
                shadow-card transition-all duration-300`}>
                {s.icon}
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-text
                  group-hover:text-primary-500 transition-colors">
                  {s.label}
                </p>
                <p className="text-[11px] text-text-faint mt-0.5">{s.sublabel}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ── HOURS + LOCATION ──────────────────────────── */}
      <section className="container-app pb-14">
        <motion.div
          className="grid sm:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Hours */}
          <motion.div variants={fadeUp} className="p-6 rounded-2xl card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-warning-bg flex items-center justify-center">
                <Clock size={18} className="text-warning" />
              </div>
              <h2 className="font-bold text-text">Business Hours</h2>
            </div>
            <div className="space-y-2.5">
              {[
                { day: "Monday – Friday", hours: "8:00 AM – 8:00 PM" },
                { day: "Saturday",        hours: "9:00 AM – 7:00 PM" },
                { day: "Sunday",          hours: "Closed"             },
              ].map(({ day, hours }) => (
                <div key={day} className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{day}</span>
                  <span className={`text-sm font-semibold
                    ${hours === "Closed" ? "text-danger" : "text-text"}`}>
                    {hours}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-text-faint">
              All times in West Africa Time (WAT, UTC+1)
            </p>
          </motion.div>

          {/* Location */}
          <motion.div variants={fadeUp} className="p-6 rounded-2xl card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                <MapPin size={18} className="text-primary-500" />
              </div>
              <h2 className="font-bold text-text">Location</h2>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-text">
                Ado-Ekiti, Ekiti State, Nigeria
              </p>
              <p className="text-sm text-text-muted">
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
                text-accent-green hover:opacity-80 transition-opacity"
            >
              <MessageCircle size={12} />
              Ask about pickup options
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── WHY CONTACT US ────────────────────────────── */}
      <section className="container-app pb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="text-xs font-bold tracking-widest uppercase
            text-primary-500 mb-2">
            How we can help
          </p>
          <h2 className="text-2xl font-black tracking-tight text-text">
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
              className="p-5 rounded-2xl card"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-50
                flex items-center justify-center mb-4">
                <Icon size={18} className="text-primary-500" />
              </div>
              <h3 className="font-bold text-text mb-1.5">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────── */}
      <section className="container-app pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0  }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-bg-subtle border border-border p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16
              rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700
              mb-6 glow-primary">
              <MessageCircle size={28} className="text-white" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black tracking-tight
              text-text mb-3">
              Still have questions?
            </h2>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              Our team is on WhatsApp and ready to help you find the perfect
              gadget, check stock, or sort out any issue — fast.
            </p>

            <div className="flex gap-3 justify-center flex-wrap">
              <motion.a
                href="https://wa.me/2349055427487?text=Hello%20HolarzGadgets%2C%20I%20have%20a%20question."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{   scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
                  bg-accent-green hover:opacity-90 text-white font-bold text-sm
                  shadow-[0_0_25px_rgb(var(--color-accent-green)/30%)]
                  transition-all duration-200"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </motion.a>
              <motion.a
                href="mailto:holarzgadgets@gmail.com"
                whileHover={{ scale: 1.04 }}
                whileTap={{   scale: 0.97 }}
                className="inline-flex items-center gap-2 px-7 py-3.5
                  rounded-xl btn-outline text-sm font-bold"
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

export const dynamic = "force-static";