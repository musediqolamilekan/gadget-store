"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Tag, Image,
  FileText, ShoppingCart, ChevronRight, Zap, LogOut, TrendingUp,
} from "lucide-react";

const nav: { group: string; items: { href: string; label: string; icon: React.ElementType }[] }[] = [
  {
    group: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "Store",
    items: [
      { href: "/admin/orders",     label: "Orders",     icon: ShoppingCart },
      { href: "/admin/revenue",    label: "Revenue",    icon: TrendingUp   },
      { href: "/admin/products",   label: "Products",   icon: ShoppingBag  },
      { href: "/admin/brands",     label: "Brands",     icon: Tag          },
      { href: "/admin/banners",    label: "Banners",    icon: Image        },
      { href: "/admin/posts",      label: "Blog Posts", icon: FileText     },
    ],
  },
];

export default function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 bg-bg border-r border-border flex flex-col h-full overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md shadow-primary-500/25 flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-text tracking-tight font-raleway">HolarzGadgets</p>
            <p className="text-[10px] text-text-faint uppercase tracking-widest font-semibold">Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {nav.map((section) => (
          <div key={section.group}>
            <p className="text-[10px] font-bold text-text-faint uppercase tracking-wider px-2 mb-1.5">
              {section.group}
            </p>
            <ul className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`
                        flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 group
                        ${isActive
                          ? "bg-primary-50 text-primary-600 font-semibold"
                          : "text-text-muted hover:text-text hover:bg-bg-subtle"
                        }
                      `}
                    >
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary-500" : "text-text-faint group-hover:text-text-muted"}`} />
                      <span className="flex-1">{label}</span>
                      {isActive && <ChevronRight className="w-3 h-3 text-primary-400" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm text-text-muted hover:text-text hover:bg-bg-subtle transition-all"
        >
          <ShoppingBag className="w-4 h-4 text-text-faint" />
          View Store
        </a>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-sm text-text-muted hover:text-danger hover:bg-danger-bg transition-all text-left"
        >
          <LogOut className="w-4 h-4 text-text-faint" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
