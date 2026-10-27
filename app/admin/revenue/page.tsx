import { Metadata } from "next";
import AdminRevenueClient from "@/components/admin/AdminRevenueClient";

export const metadata: Metadata = { title: "Revenue" };
export const dynamic = "force-dynamic";

export default function AdminRevenuePage() {
  return <AdminRevenueClient />;
}
