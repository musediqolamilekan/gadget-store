"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X, XCircle } from "lucide-react";

type ToastMessage = {
  id: number;
  message: string;
  type: "success" | "error";
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastMessage["type"]) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const SYNC_CHANNEL_NAME = "sanity-content-sync";

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message: string, type: ToastMessage["type"] = "success") => {
    setToast({ id: Date.now(), message, type });
    if (type === "success" && "BroadcastChannel" in window) {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage({ type: "content-updated" });
      channel.close();
    }
  }, []);

  const contextValue = { showToast };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {mounted && toast && createPortal(
        <div
          role={toast.type === "error" ? "alert" : "status"}
          className={`fixed right-4 top-4 z-[120] flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl transition-all ${
            toast.type === "success"
              ? "border-success/20 bg-bg text-text"
              : "border-danger/20 bg-bg text-text"
          }`}
          key={toast.id}
        >
          {toast.type === "success"
            ? <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
            : <XCircle className="h-5 w-5 shrink-0 text-danger" />}
          <span className="flex-1 text-sm font-semibold">{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} aria-label="Dismiss notification" className="text-text-faint transition hover:text-text">
            <X className="h-4 w-4" />
          </button>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useAdminToast must be used within AdminToastProvider");
  return context.showToast;
}
