import { Metadata } from "next";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export const metadata: Metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
