import Link from "next/link";
import { Zap, Search, Smartphone, Laptop, Headphones } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found | HolarzGadgets",
};

const QUICK_LINKS = [
    { href: "/products?category=phones", label: "Phones", Icon: Smartphone },
    { href: "/products?category=laptops", label: "Laptops", Icon: Laptop },
    { href: "/products?category=earbuds", label: "Earbuds", Icon: Headphones },
    { href: "/products", label: "All Products", Icon: Search },
];

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            {/* Ambient blobs */}
            <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full
          bg-cyan-500/6 blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full
          bg-violet-600/6 blur-[120px]" />
            </div>

            <div className="relative text-center max-w-lg mx-auto">
                {/* 404 number */}
                <div className="relative mb-6">
                    <p className="text-[10rem] font-black leading-none tracking-tighter
            text-slate-800 select-none">
                        404
                    </p>
                    {/* Logo overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br
              from-cyan-500 to-violet-600 flex items-center justify-center
              shadow-[0_0_40px_rgba(6,182,212,0.4)]">
                            <Zap size={36} className="text-white" />
                        </div>
                    </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-black tracking-tight
          text-slate-50 mb-3">
                    Page not found
                </h1>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Head back to browse our full range of original gadgets.
                </p>

                {/* Quick links */}
                <div className="grid grid-cols-2 gap-2 mb-8">
                    {QUICK_LINKS.map(({ href, label, Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-2.5 px-4 py-3 rounded-xl
                bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40
                hover:bg-slate-800/60 text-sm font-medium text-slate-300
                hover:text-cyan-400 transition-all duration-200"
                        >
                            <Icon size={15} className="text-slate-500" />
                            {label}
                        </Link>
                    ))}
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl
            bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm
            shadow-[0_0_20px_rgba(6,182,212,0.4)]
            hover:shadow-[0_0_35px_rgba(6,182,212,0.6)]
            transition-all duration-200"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}