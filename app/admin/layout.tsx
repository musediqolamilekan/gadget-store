import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import "../(site)/globals.css";
import AdminShell from "@/components/admin/AdminShell";
import { AdminToastProvider } from "@/components/admin/AdminToast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | HolarzGadgets",
    template: "%s | Admin · HolarzGadgets",
  },
  description: "Admin dashboard for managing HolarzGadgets content",
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.ico",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${raleway.variable}`}>
      <body className="min-h-screen bg-bg antialiased font-inter">
        <AdminToastProvider>
          <AdminShell>{children}</AdminShell>
        </AdminToastProvider>
      </body>
    </html>
  );
}
