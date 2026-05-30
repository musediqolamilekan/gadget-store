"use client";

import { motion } from "framer-motion";
import { Smartphone, Laptop, Watch, Headphones, BatteryCharging, Wifi } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// Floating device cards shown in the hero right panel
// ─────────────────────────────────────────────────────────────
const DEVICES = [
    {
        icon: Smartphone,
        label: "iPhone 16 Pro",
        sub: "A18 Pro · 48MP",
        gradient: "from-cyan-500 to-blue-600",
        glow: "rgba(6,182,212,0.35)",
        delay: 0,
        x: "-55%",
        y: "-10%",
        rotate: "-6deg",
    },
    {
        icon: Laptop,
        label: "MacBook M4",
        sub: "22hr battery",
        gradient: "from-violet-500 to-purple-700",
        glow: "rgba(124,58,237,0.35)",
        delay: 0.15,
        x: "30%",
        y: "-30%",
        rotate: "5deg",
    },
    {
        icon: Watch,
        label: "Galaxy Watch 7",
        sub: "7-day battery",
        gradient: "from-emerald-500 to-teal-600",
        glow: "rgba(16,185,129,0.35)",
        delay: 0.3,
        x: "-40%",
        y: "45%",
        rotate: "4deg",
    },
    {
        icon: Headphones,
        label: "AirPods Pro 2",
        sub: "ANC · 30hr",
        gradient: "from-rose-500 to-pink-600",
        glow: "rgba(244,63,94,0.35)",
        delay: 0.45,
        x: "35%",
        y: "40%",
        rotate: "-4deg",
    },
    {
        icon: BatteryCharging,
        label: "Anker 250W",
        sub: "27,650mAh",
        gradient: "from-amber-500 to-orange-600",
        glow: "rgba(245,158,11,0.3)",
        delay: 0.6,
        x: "-10%",
        y: "10%",
        rotate: "2deg",
    },
];

const floatAnim = (delay: number) => ({
    animate: {
        y: [0, -10, 0],
        transition: {
            delay,
            duration: 3 + delay,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
});

export default function HeroVisual() {
    return (
        <div className="relative w-full h-[420px] md:h-[500px] lg:h-[560px]
      flex items-center justify-center">

            {/* Central glow orb */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px]" />
                <div className="absolute w-48 h-48 rounded-full bg-violet-500/10 blur-[60px]" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
                    backgroundSize: "32px 32px",
                }}
            />

            {/* Central "store" badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex flex-col items-center gap-3"
            >
                <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500
            to-violet-600 flex items-center justify-center
            shadow-[0_0_50px_rgba(6,182,212,0.5)]"
                >
                    <Wifi size={36} className="text-white" />
                </motion.div>
                <div className="text-center">
                    <p className="text-xs font-bold tracking-widest uppercase
            text-cyan-400/80">
                        HolarzGadgets
                    </p>
                    <p className="text-[10px] text-slate-500">Premium Tech Store</p>
                </div>
            </motion.div>

            {/* Orbiting device cards */}
            {DEVICES.map(({ icon: Icon, label, sub, gradient, glow, delay, x, y, rotate }) => (
                <motion.div
                    key={label}
                    {...floatAnim(delay)}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                    transition={{
                        opacity: { duration: 0.5, delay },
                        scale: { duration: 0.5, delay },
                        y: { duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay },
                    }}
                    style={{
                        position: "absolute",
                        transform: `translate(${x}, ${y}) rotate(${rotate})`,
                        boxShadow: `0 8px 32px ${glow}`,
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl
            bg-slate-900/90 border border-slate-700/80 backdrop-blur-sm
            min-w-[130px]"
                >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient}
            flex items-center justify-center flex-shrink-0`}>
                        <Icon size={17} className="text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-100 leading-none mb-0.5">
                            {label}
                        </p>
                        <p className="text-[10px] text-slate-500">{sub}</p>
                    </div>
                </motion.div>
            ))}

            {/* Connecting lines (decorative) */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line x1="50%" y1="50%" x2="25%" y2="30%" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#7C3AED" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="28%" y2="70%" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="72%" y2="72%" stroke="#F43F5E" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="50%" y2="58%" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
        </div>
    );
}