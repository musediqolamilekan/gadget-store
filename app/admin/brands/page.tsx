import { Metadata } from "next";
import AdminBrandsClient from "@/components/admin/AdminBrandsClient";

export const metadata: Metadata = { title: "Brands" };
export const dynamic = "force-dynamic";

export default function AdminBrandsPage() {
  return <AdminBrandsClient />;
}
