"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-3 py-4"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 18, delay: 0.1 }}
          >
            <CheckCircle className="text-emerald-400" size={44} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-slate-200 font-semibold text-lg"
          >
            You&apos;re on the list!
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-slate-500 text-sm"
          >
            We&apos;ll send you the good stuff — no spam, ever.
          </motion.p>
        </motion.div>

      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          className="flex gap-2 max-w-md mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <motion.input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            whileFocus={{ scale: 1.01 }}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3
              text-sm text-slate-200 placeholder:text-slate-500
              focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30
              transition-all"
          />
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.04 }}
            whileTap={{ scale: loading ? 1 : 0.97 }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl
              bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors shadow-[0_0_15px_rgba(6,182,212,0.35)]
              hover:shadow-[0_0_25px_rgba(6,182,212,0.55)]"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span
                  key="spinner"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  className="flex items-center justify-center"
                >
                  <motion.span
                    className="w-4 h-4 rounded-full border-2
                      border-slate-950 border-t-transparent block"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  />
                </motion.span>
              ) : (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  Subscribe <ArrowRight size={14} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}