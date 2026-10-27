import { Metadata } from "next";
import AdminProductsClient from "@/components/admin/AdminProductsClient";

export const metadata: Metadata = { title: "Products" };
export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}
