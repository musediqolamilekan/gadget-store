"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, Zap, AlertCircle } from "lucide-react";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError(data.error ?? "Invalid password");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-subtle flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-50 blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary-50 blur-3xl opacity-40" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 mb-4">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-text tracking-tight font-raleway">HolarzGadgets</h1>
          <p className="text-sm text-text-muted mt-1">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-bg border border-border rounded-2xl p-6 shadow-xl shadow-black/5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text">Restricted Area</h2>
              <p className="text-xs text-text-faint">Enter admin password to continue</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                autoFocus
                required
                className="w-full bg-bg-subtle border border-border rounded-xl px-4 py-3 pr-11 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted transition-colors"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-danger-bg border border-danger/20 text-danger text-xs">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-md shadow-primary-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-text-faint mt-4">
          HolarzGadgets · Secure Admin Panel
        </p>
      </div>
    </div>
  );
}
