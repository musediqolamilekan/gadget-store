"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminLogin from "./AdminLogin";

const SESSION_KEY = "holarz_admin_auth";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    // Check sessionStorage for auth token
    const stored = sessionStorage.getItem(SESSION_KEY);
    setAuthed(stored === "1");
  }, []);

  const handleLogin = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setAuthed(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  // Loading state
  if (authed === null) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated — show login
  if (!authed) {
    return <AdminLogin onSuccess={handleLogin} />;
  }

  // Authenticated — show dashboard
  return (
    <div className="flex h-screen overflow-hidden bg-bg-subtle">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
