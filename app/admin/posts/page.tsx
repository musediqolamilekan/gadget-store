import { Metadata } from "next";
import AdminPostsClient from "@/components/admin/AdminPostsClient";

export const metadata: Metadata = { title: "Blog Posts" };
export const dynamic = "force-dynamic";

export default function AdminPostsPage() {
  return <AdminPostsClient />;
}
