"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, RefreshCw, Search } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin":            "Dashboard",
  "/admin/orders":     "Orders",
  "/admin/products":   "Products",
  "/admin/brands":     "Brands",
  "/admin/categories": "Categories",
  "/admin/banners":    "Banners",
  "/admin/posts":      "Blog Posts",
};

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const title = Object.entries(pageTitles).find(([k]) => pathname === k || (k !== "/admin" && pathname.startsWith(k)))?.[1] ?? "Admin";

  return (
    <header className="h-14 flex-shrink-0 bg-bg border-b border-border flex items-center justify-between px-5 lg:px-7 sticky top-0 z-10">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-faint hidden sm:block">Admin</span>
        <span className="text-xs text-text-faint hidden sm:block">/</span>
        <h1 className="text-sm font-bold text-text">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search placeholder */}
        <div className="hidden md:flex items-center gap-2 bg-bg-subtle border border-border rounded-xl px-3 py-1.5 text-xs text-text-faint cursor-pointer hover:border-border-strong transition-colors">
          <Search className="w-3 h-3" />
          <span>Search...</span>
          <kbd className="text-[9px] bg-bg-muted rounded px-1 py-0.5 ml-1 text-text-faint">⌘K</kbd>
        </div>

        <button
          onClick={() => router.refresh()}
          title="Refresh"
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-text hover:bg-bg-subtle transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-faint hover:text-text hover:bg-bg-subtle transition-all relative">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-500 rounded-full" />
        </button>

        {/* Live indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-success-bg border border-success/20 text-success text-xs font-medium">
          <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
          Live
        </div>
      </div>
    </header>
  );
}
