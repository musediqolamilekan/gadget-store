"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const HEADLINES = [
    { text: "📱 iPhone 16 Pro Max now available — A18 Pro chip, 48MP camera system", href: "/products?brand=Apple" },
    { text: "💻 MacBook Pro M4 lands with Thunderbolt 5 and up to 22hr battery life", href: "/products?brand=Apple" },
    { text: "⌚ Apple Watch Series 10 debuts sleep apnea detection, thinnest design yet", href: "/products?category=smartwatches" },
    { text: "🎧 Sony WF-1000XM5 sets a new benchmark for wireless ANC earbuds", href: "/products?category=earbuds" },
    { text: "🔋 Anker Prime 250W power bank charges a MacBook Pro in under 37 minutes", href: "/products?category=power-banks" },
    { text: "📲 Samsung Galaxy S25 Ultra ships with Snapdragon 8 Elite & built-in S Pen", href: "/products?brand=Samsung" },
    { text: "🚀 Free delivery on orders over ₦50,000 — WhatsApp us to place your order", href: "https://wa.me/2349055427487" },
];

export default function PromoBanner() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % HEADLINES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const current = HEADLINES[index];
    const isExternal = current.href.startsWith("http");

    return (
        <div className="bg-primary-600 border-b border-primary-700
      h-9 flex items-center justify-center overflow-hidden relative">

            {/* Subtle shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r
        from-primary-700/0 via-white/5 to-primary-700/0
        pointer-events-none" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative px-4"
                >
                    {isExternal ? (
                        <a
                            href={current.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] sm:text-xs font-semibold text-white/95
                tracking-wide hover:text-white transition-colors"
                        >
                            {current.text}
                        </a>
                    ) : (
                        <Link
                            href={current.href}
                            className="text-[11px] sm:text-xs font-semibold text-white/95
                tracking-wide hover:text-white transition-colors"
                        >
                            {current.text}
                        </Link>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2
        hidden sm:flex items-center gap-1">
                {HEADLINES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        aria-label={`Headline ${i + 1}`}
                        className={`rounded-full transition-all duration-300
              ${i === index
                                ? "w-4 h-1.5 bg-white"
                                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"}`}
                    />
                ))}
            </div>
        </div>
    );
}