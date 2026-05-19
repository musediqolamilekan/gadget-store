"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto">
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all duration-200 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
        <Search size={18} className="ml-3 text-slate-500 flex-shrink-0" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for phones, laptops, earbuds…"
          className="flex-1 bg-transparent text-slate-200 placeholder:text-slate-500 text-sm py-2 pr-2 focus:outline-none"
        />
        <button
          type="submit"
          className="flex-shrink-0 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        >
          Search
        </button>
      </div>
    </form>
  );
}