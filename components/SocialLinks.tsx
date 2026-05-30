"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// SOCIAL LINKS DATA
// ─────────────────────────────────────────────────────────────
const SOCIALS = [
    {
        id: "whatsapp",
        label: "WhatsApp",
        sublabel: "Order & Chat",
        href: "https://wa.me/2349055427487",
        bg: "bg-[#25D366]",
        glow: "hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)]",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.109.549 4.09 1.508 5.814L.057 23.25l5.575-1.462A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.9a9.9 9.9 0 01-5.031-1.371l-.361-.214-3.31.869.882-3.23-.235-.373A9.872 9.872 0 012.1 12c0-5.457 4.444-9.9 9.9-9.9 5.457 0 9.9 4.443 9.9 9.9 0 5.458-4.443 9.9-9.9 9.9z" />
            </svg>
        ),
    },
    {
        id: "telegram",
        label: "Telegram",
        sublabel: "Join Channel",
        href: "https://t.me/horlarzgadgets",
        bg: "bg-[#229ED9]",
        glow: "hover:shadow-[0_8px_30px_rgba(34,158,217,0.4)]",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.9l-2.965-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.983.659z" />
            </svg>
        ),
    },
    {
        id: "tiktok",
        label: "TikTok",
        sublabel: "Watch Videos",
        href: "https://tiktok.com/@horlarzgadgets",
        bg: "bg-black",
        glow: "hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
            </svg>
        ),
    },
    {
        id: "instagram",
        label: "Instagram",
        sublabel: "See Photos",
        href: "https://instagram.com/horlarzgadgets",
        bg: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
        glow: "hover:shadow-[0_8px_30px_rgba(221,42,123,0.4)]",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
        ),
    },
    {
        id: "facebook",
        label: "Facebook",
        sublabel: "Like our Page",
        href: "https://facebook.com/horlarzgadgets",
        bg: "bg-[#1877F2]",
        glow: "hover:shadow-[0_8px_30px_rgba(24,119,242,0.4)]",
        icon: (
            <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        id: "location",
        label: "Office Location",
        sublabel: "Ado-Ekiti",
        href: "https://maps.google.com/?q=Ado-Ekiti,Ekiti+State,Nigeria",
        bg: "bg-gradient-to-br from-primary-400 to-primary-600",
        glow: "hover:shadow-[0_8px_30px_rgb(var(--color-primary-500)/40%)]",
        icon: <MapPin size={28} className="text-white" />,
    },
];

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.85 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
export default function SocialLinks() {
    return (
        <div className="flex flex-wrap items-start justify-center gap-6 md:gap-10">
            {SOCIALS.map((s, i) => (
                <motion.a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    whileHover={{ y: -6, scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex flex-col items-center gap-3 group"
                >
                    {/* Circle icon */}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full
            ${s.bg} ${s.glow}
            flex items-center justify-center
            shadow-card transition-all duration-300`}>
                        {s.icon}
                    </div>

                    {/* Labels */}
                    <div className="text-center">
                        <p className="text-sm font-bold text-text
              group-hover:text-primary-500 transition-colors">
                            {s.label}
                        </p>
                        <p className="text-[11px] text-text-faint mt-0.5">
                            {s.sublabel}
                        </p>
                    </div>
                </motion.a>
            ))}
        </div>
    );
}