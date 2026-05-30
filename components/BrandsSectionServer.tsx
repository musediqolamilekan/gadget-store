import { getAllBrands } from "@/sanity/lib/fetch";
import BrandsSection   from "./BrandsSection";

export default async function BrandsSectionServer() {
  const brands = await getAllBrands();
  return <BrandsSection brands={brands} />;
}