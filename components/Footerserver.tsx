import { getAllCategories } from "@/sanity/lib/fetch";
import Footer from "./Footer";

export default async function FooterServer() {
  const categories = await getAllCategories();
  return <Footer categories={categories} />;
}