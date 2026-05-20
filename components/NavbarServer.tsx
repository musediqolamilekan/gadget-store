import { getAllCategories } from "@/sanity/lib/fetch";
import Navbar from "./Navbar";

export default async function NavbarServer() {
  const categories = await getAllCategories();
  return <Navbar categories={categories} />;
}