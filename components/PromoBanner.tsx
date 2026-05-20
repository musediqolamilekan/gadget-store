"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HEADLINES = [
    "📱 iPhone 16 Pro Max now available — A18 Pro chip, 48MP camera system",
    "💻 MacBook Pro M4 lands with Thunderbolt 5 and up to 22hr battery life",
    "⌚ Apple Watch Series 10 debuts sleep apnea detection, thinnest design yet",
    "🎧 Sony WF-1000XM5 sets new benchmark for wireless ANC earbuds",
    "🔋 Anker Prime 250W power bank charges a MacBook Pro in under 37 minutes",
    "📲 Samsung Galaxy S25 Ultra ships with Snapdragon 8 Elite & built-in S Pen",
    "🟢 Free delivery on orders over ₦50,000 · WhatsApp us to place your order",
];

export default function PromoBanner() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % HEADLINES.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-slate-900 border-b border-slate-800/80 text-center py-2 overflow-hidden relative h-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="text-xs font-medium text-slate-300 tracking-wide px-4"
                >
                    {HEADLINES[index]}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}