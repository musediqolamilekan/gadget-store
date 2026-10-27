import { Metadata } from "next";
import AdminCategoriesClient from "@/components/admin/AdminCategoriesClient";

export const metadata: Metadata = { title: "Categories" };
export const dynamic = "force-dynamic";

export default function AdminCategoriesPage() {
  return <AdminCategoriesClient />;
}
