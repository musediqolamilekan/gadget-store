import { Metadata } from "next";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
