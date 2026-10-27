import { Metadata } from "next";
import AdminBannersClient from "@/components/admin/AdminBannersClient";

export const metadata: Metadata = { title: "Banners" };
export const dynamic = "force-dynamic";

export default function AdminBannersPage() {
  return <AdminBannersClient />;
}
