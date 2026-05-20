"use client";

import Link from "next/link";
import { Zap, Twitter, Instagram, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { SanityCategory } from "@/sanity/lib/fetch";

// ─────────────────────────────────────────────────────────────
// STATIC LINKS
// ─────────────────────────────────────────────────────────────
const SUPPORT_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Policy", href: "/policies" },
  { label: "Contact Us", href: "/contact" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
];

const SOCIAL = [
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: MessageCircle, href: "https://wa.me/2349055427487", label: "WhatsApp" },
];

// ─────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const linkVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

// ─────────────────────────────────────────────────────────────
// LINK COLUMN
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
      <h3 className="text-xs font-bold tracking-widest uppercase
        text-slate-400 mb-4">
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
              className="text-sm text-slate-500 hover:text-slate-200
                transition-colors duration-200"
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
    href: `/products?category=${c.slug}`,
  }));

  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main grid ─────────────────────────────────── */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Brand column */}
          <motion.div
            className="col-span-2 md:col-span-1"
            variants={columnVariants}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 group mb-4"
            >
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500
                  to-violet-600 flex items-center justify-center"
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 0 20px rgba(6,182,212,0.6)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Zap size={16} className="text-white" />
              </motion.div>
              <span className="text-lg font-black tracking-tighter text-slate-50">
                Holarz<span className="text-cyan-400">Gadgets</span>
              </span>
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-5">
              Your trusted destination for premium gadgets and tech accessories.
              Curated for performance. Built for the future.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {SOCIAL.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700
                    border border-slate-700/50
                    flex items-center justify-center
                    text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Shop — from Sanity categories */}
          <LinkColumn title="Shop" links={shopLinks} />
          <LinkColumn title="Support" links={SUPPORT_LINKS} />
          <LinkColumn title="Company" links={COMPANY_LINKS} />
        </motion.div>

        {/* ── Bottom bar ────────────────────────────────── */}
        <motion.div
          className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row
            items-center justify-between gap-4 text-xs text-slate-600"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p>© {new Date().getFullYear()} HolarzGadgets. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-slate-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-slate-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          <p className="flex items-center gap-1.5">
            Built by{" "}
            <a
              href="https://wa.me/2349055427487"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 font-semibold hover:text-cyan-400 transition-colors"
            >
              Olamilekan Musediq
            </a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}