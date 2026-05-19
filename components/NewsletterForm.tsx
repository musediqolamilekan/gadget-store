"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <CheckCircle className="text-emerald-400" size={40} />
        <p className="text-slate-200 font-semibold">You're on the list!</p>
        <p className="text-slate-500 text-sm">
          We'll send you the good stuff — no spam, ever.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3
          text-sm text-slate-200 placeholder:text-slate-500
          focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30
          transition-all"
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 
          text-slate-950 font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed 
          transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)]"
      >
        {loading ? (
          <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
        ) : (
          <>Subscribe <ArrowRight size={14} /></>
        )}
      </button>
    </form>
  );
}