// Shared utility components for admin pages

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Generic stat card ──────────────────────────────────────────
export function StatCard({
  label, value, icon: Icon, iconBg, change, sublabel
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  change?: { value: number; label: string };
  sublabel?: string;
}) {
  return (
    <div className="bg-bg border border-border rounded-2xl p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
        {change !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${change.value >= 0 ? "bg-success-bg text-success" : "bg-danger-bg text-danger"}`}>
            {change.value >= 0 ? "+" : ""}{change.value}%
          </span>
        )}
      </div>
      <div className="text-2xl font-black text-text tracking-tight">{value}</div>
      <div className="text-xs font-medium text-text-muted mt-0.5">{label}</div>
      {sublabel && <div className="text-xs text-text-faint mt-0.5">{sublabel}</div>}
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────
export function SectionHeader({
  title, subtitle, action
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h2 className="text-lg font-black text-text tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── Primary button ─────────────────────────────────────────────
export function PrimaryBtn({
  onClick, children, loading, disabled, color = "orange", type = "button"
}: {
  onClick?: () => void;
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  color?: "orange" | "green" | "blue" | "red" | "violet";
  type?: "button" | "submit";
}) {
  const colorClasses: Record<string, string> = {
    orange: "from-primary-500 to-primary-600 shadow-primary-500/20",
    green:  "from-success to-emerald-500 shadow-success/20",
    blue:   "from-accent-cyan to-cyan-500 shadow-cyan-500/20",
    red:    "from-danger to-rose-500 shadow-danger/20",
    violet: "from-accent-violet to-violet-600 shadow-violet-500/20",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-md`}
    >
      {loading ? (
        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : children}
    </button>
  );
}

// ── Ghost button ───────────────────────────────────────────────
export function GhostBtn({
  onClick, children, type = "button"
}: {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-text-muted text-sm font-medium hover:bg-bg-subtle hover:text-text transition-all"
    >
      {children}
    </button>
  );
}

// ── Badge ──────────────────────────────────────────────────────
export function Badge({
  label, color
}: {
  label: string;
  color: "orange" | "green" | "blue" | "red" | "amber" | "violet" | "gray" | "cyan";
}) {
  const classes: Record<string, string> = {
    orange: "bg-primary-50 text-primary-600",
    green:  "bg-success-bg text-success",
    blue:   "bg-primary-50 text-blue-600",
    red:    "bg-danger-bg text-danger",
    amber:  "bg-warning-bg text-warning",
    violet: "bg-violet-50 text-violet-600",
    gray:   "bg-bg-muted text-text-faint",
    cyan:   "bg-cyan-50 text-cyan-600",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${classes[color]}`}>
      {label}
    </span>
  );
}

// ── Form field ─────────────────────────────────────────────────
export function FormField({
  label, required, children
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-text-muted mb-1.5">
        {label}{required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputCls = "w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/10 transition-all";

// ── Toggle switch ──────────────────────────────────────────────
export function Toggle({
  checked, onChange, label
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-primary-500" : "bg-bg-muted border border-border"}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      {label && <span className="text-sm text-text-muted">{label}</span>}
    </label>
  );
}

// ── Table skeleton ─────────────────────────────────────────────
export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className={`h-3.5 bg-bg-muted rounded ${j === 0 ? "w-48" : j === 1 ? "w-24" : "w-16"}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Pagination ─────────────────────────────────────────────────
export function Pagination({
  page, totalPages, onPage
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    return start + i;
  }).filter((p) => p >= 1 && p <= totalPages);

  return (
    <div className="flex items-center justify-center gap-1 py-4 border-t border-border mt-auto">
      <button
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-bg-subtle disabled:opacity-40 transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages[0] > 1 && (
        <>
          <button onClick={() => onPage(1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-bg-subtle text-xs transition-all">1</button>
          {pages[0] > 2 && <span className="text-text-faint text-xs px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${p === page ? "bg-primary-500 text-white border border-primary-500" : "border border-border text-text-muted hover:bg-bg-subtle"}`}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="text-text-faint text-xs px-1">…</span>}
          <button onClick={() => onPage(totalPages)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-bg-subtle text-xs transition-all">{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-muted hover:bg-bg-subtle disabled:opacity-40 transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Modal shell ────────────────────────────────────────────────
export function Modal({
  open, onClose, title, children, footer, size = "md"
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "wide";
}) {
  const [mounted, setMounted] = useState(false);
  const [presented, setPresented] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted]);

  useEffect(() => {
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (open) {
      setMounted(true);
      frame = window.requestAnimationFrame(() => setPresented(true));
    } else {
      setPresented(false);
      timer = setTimeout(() => setMounted(false), 200);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, [open]);

  if (!mounted) return null;
  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl", wide: "max-w-6xl" };
  return createPortal(
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-slate-950/55 backdrop-blur-md transition-opacity duration-200 ease-out motion-reduce:transition-none ${presented ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      onClick={(e) => e.target === e.currentTarget && open && onClose()}
    >
      <div className={`bg-bg border border-border rounded-3xl shadow-[0_32px_100px_-24px_rgba(0,0,0,0.55)] w-full ${widths[size]} max-h-[94vh] flex flex-col overflow-hidden transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${presented ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"}`}>
        <div className="relative flex items-center justify-between px-6 sm:px-8 py-5 border-b border-border bg-gradient-to-r from-bg via-bg to-primary-50/70 shrink-0">
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary-400 to-primary-600" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-600">HolarzGadgets · Admin</p>
            <h3 className="font-black text-text text-lg tracking-tight mt-0.5">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-9 h-9 rounded-xl border border-border bg-bg/80 text-text-faint hover:text-text hover:border-primary-300 hover:bg-primary-50 transition-all text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 sm:px-8 py-6">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-border bg-bg/95 px-6 sm:px-8 py-4 shadow-[0_-8px_24px_-20px_rgba(15,23,42,0.35)]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ── Empty state ────────────────────────────────────────────────
export function EmptyState({
  icon: Icon, title, subtitle
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="py-16 text-center">
      <div className="w-12 h-12 rounded-2xl bg-bg-muted flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-text-faint" />
      </div>
      <p className="font-semibold text-text-muted">{title}</p>
      {subtitle && <p className="text-sm text-text-faint mt-1">{subtitle}</p>}
    </div>
  );
}

// ── Delete confirmation ────────────────────────────────────────
export function ConfirmDeleteModal({
  open, onClose, onConfirm, name, loading
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  loading?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Confirm Delete"
      size="sm"
      footer={
        <div className="flex justify-end gap-3">
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn onClick={onConfirm} loading={loading} color="red">Delete</PrimaryBtn>
        </div>
      }
    >
      <p className="text-sm text-text-muted">
        Are you sure you want to delete <span className="font-semibold text-text">&ldquo;{name}&rdquo;</span>? This action cannot be undone.
      </p>
    </Modal>
  );
}
