import Link from "next/link";
import { Zap, Github, Twitter, Instagram } from "lucide-react";

const FOOTER_LINKS = {
  Shop: [
    { label: "Phones",       href: "/products?category=phones" },
    { label: "Laptops",      href: "/products?category=laptops" },
    { label: "Smartwatches", href: "/products?category=smartwatches" },
    { label: "Power Banks",  href: "/products?category=power-banks" },
    { label: "Earbuds",      href: "/products?category=earbuds" },
    { label: "Accessories",  href: "/products?category=accessories" },
  ],
  Support: [
    { label: "FAQ",             href: "/faq" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns",         href: "/returns" },
    { label: "Warranty",        href: "/warranty" },
    { label: "Contact Us",      href: "/contact" },
  ],
  Company: [
    { label: "About Us",    href: "/about" },
    { label: "Careers",     href: "/careers" },
    { label: "Press",       href: "/press" },
    { label: "Blog",        href: "/blog" },
    { label: "Affiliates",  href: "/affiliates" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter text-slate-50">
                Holarz<span className="text-cyan-400">Gadgets</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Your trusted destination for premium gadgets and tech accessories.
              Curated for performance. Built for the future.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Github, href: "#", label: "GitHub" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/50
                    flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} HolarzGadgets. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
