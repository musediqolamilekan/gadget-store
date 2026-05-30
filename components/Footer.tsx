"use client";

import Link        from "next/link";
import { Zap, MapPin } from "lucide-react";
import { motion }  from "framer-motion";
import type { SanityCategory } from "@/sanity/lib/fetch";

// ─────────────────────────────────────────────────────────────
// STATIC LINKS
// ─────────────────────────────────────────────────────────────
const SUPPORT_LINKS = [
  { label: "FAQ",               href: "/faq"      },
  { label: "Shipping Policy",   href: "/policies" },
  { label: "Returns & Refunds", href: "/policies" },
  { label: "Warranty",          href: "/policies" },
  { label: "Contact Us",        href: "/contact"  },
];

const SERVICES_LINKS = [
  { label: "Buy Data",           href: "/services#data"           },
  { label: "Buy Airtime",        href: "/services#airtime"        },
  { label: "DSTV Subscription",  href: "/services#dstv"           },
  { label: "Google Numbers",     href: "/services#google-numbers" },
];

const COMPANY_LINKS = [
  { label: "About Us",   href: "/about"    },
  { label: "Blog",       href: "/blog"     },
  { label: "Services",   href: "/services" },
  { label: "Contact Us", href: "/contact"  },
];

// Social channels — update hrefs before launch
const SOCIALS = [
  {
    label: "WhatsApp",
    href:  "https://wa.me/2349055427487",
    bg:    "bg-[#25D366]",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.109.549 4.09 1.508 5.814L.057 23.25l5.575-1.462A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.361-.214-3.31.869.882-3.23-.235-.373A9.872 9.872 0 012.1 12c0-5.457 4.444-9.9 9.9-9.9 5.457 0 9.9 4.443 9.9 9.9 0 5.458-4.443 9.9-9.9 9.9z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href:  "https://instagram.com/horlarzgadgets",
    bg:    "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href:  "https://tiktok.com/@horlarzgadgets",
    bg:    "bg-black",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href:  "https://facebook.com/horlarzgadgets",
    bg:    "bg-[#1877F2]",
    icon: (
      <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const columnVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const linkVariants = {
  hidden:  { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// ─────────────────────────────────────────────────────────────
// LINK COLUMN — uses bg-inverse palette (dark footer)
// ─────────────────────────────────────────────────────────────
function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <motion.div variants={columnVariants}>
      <h3 className="text-[10px] font-black tracking-[0.2em] uppercase
        text-primary-400 mb-4">
        {title}
      </h3>
      <motion.ul
        className="space-y-2.5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {links.map(({ label, href }) => (
          <motion.li key={label} variants={linkVariants}>
            <Link
              href={href}
              className="text-sm text-slate-400 hover:text-white
                hover:translate-x-0.5 transition-all duration-200
                inline-block"
            >
              {label}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────
interface FooterProps {
  categories: SanityCategory[];
}

export default function Footer({ categories }: FooterProps) {
  const shopLinks = categories.map((c) => ({
    label: c.title,
    href:  `/products?category=${c.slug}`,
  }));

  return (
    <footer className="bg-bg-inverse border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main grid ─────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-14"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >

          {/* ── Brand column ─────────────────────────────── */}
          <motion.div
            className="col-span-2 md:col-span-1"
            variants={columnVariants}
          >
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-2.5 group mb-5">
              <motion.div
                className="w-9 h-9 rounded-xl bg-gradient-to-br
                  from-primary-500 to-primary-700
                  flex items-center justify-center glow-primary"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Zap size={17} className="text-white" />
              </motion.div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-black tracking-tight text-white">
                  Holarz<span className="text-primary-400">Gadgets</span>
                </span>
                <span className="text-[9px] font-semibold tracking-widest
                  uppercase text-slate-500 leading-none">
                  Ekiti&apos;s #1 Tech Store
                </span>
              </div>
            </Link>

            {/* Description */}
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-5">
              Your trusted source for 100% original gadgets in Ekiti State.
              Shop phones, laptops, smartwatches, earbuds and accessories.
            </p>

            {/* Location */}
            <a
              href="https://maps.google.com/?q=Ado-Ekiti,Ekiti+State,Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-slate-500
                hover:text-primary-400 transition-colors mb-5 group"
            >
              <MapPin size={12} className="text-primary-500 flex-shrink-0" />
              Ado-Ekiti, Ekiti State, Nigeria
            </a>

            {/* Social icons */}
            <div className="flex gap-2.5 flex-wrap">
              {SOCIALS.map(({ label, href, bg, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  className={`w-8 h-8 rounded-full ${bg}
                    flex items-center justify-center
                    shadow-sm transition-all duration-200`}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── Link columns ─────────────────────────────── */}
          <LinkColumn title="Shop"     links={shopLinks}      />
          <LinkColumn title="Support"  links={SUPPORT_LINKS}  />
          <LinkColumn title="Services" links={SERVICES_LINKS} />
          <LinkColumn title="Company"  links={COMPANY_LINKS}  />
        </motion.div>

        {/* ── WhatsApp CTA bar ──────────────────────────── */}
        <motion.div
          className="rounded-2xl bg-primary-500/10 border border-primary-500/20
            px-6 py-4 mb-10 flex flex-col sm:flex-row items-center
            justify-between gap-4"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div>
            <p className="font-bold text-white text-sm">
              Ready to order? Chat us on WhatsApp
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Mon–Sat · 8am–8pm · Fast response guaranteed
            </p>
          </div>
          <motion.a
            href="https://wa.me/2349055427487"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-sm
              transition-colors duration-200 flex-shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.109.549 4.09 1.508 5.814L.057 23.25l5.575-1.462A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.361-.214-3.31.869.882-3.23-.235-.373A9.872 9.872 0 012.1 12c0-5.457 4.444-9.9 9.9-9.9 5.457 0 9.9 4.443 9.9 9.9 0 5.458-4.443 9.9-9.9 9.9z"/>
            </svg>
            Chat on WhatsApp
          </motion.a>
        </motion.div>

        {/* ── Bottom bar ────────────────────────────────── */}
        <motion.div
          className="pt-6 border-t border-white/5 flex flex-col sm:flex-row
            items-center justify-between gap-4 text-xs text-slate-600"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>© {new Date().getFullYear()} HolarzGadgets. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link href="/privacy"
              className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms"
              className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
          </div>

          <p>
            Built by{" "}
            <a
              href="https://wa.me/2347047257462"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 font-semibold
                hover:text-primary-300 transition-colors"
            >
              Olamilekan Musediq
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}