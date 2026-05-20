import { Suspense } from "react";
import { getAllProducts, getAllBrands, getAllCategories } from "@/sanity/lib/fetch";
import ProductsClient from "@/components/ProductsClient";

export const metadata = {
  title: "All Products",
  description: "Browse phones, laptops, earbuds, smartwatches and more at Horlarz Gadgets.",
};

export default async function ProductsPage() {
  const [products, brands, categories] = await Promise.all([
    getAllProducts(),
    getAllBrands(),
    getAllCategories(),
  ]);

  const brandNames = brands.map((b) => b.name);

  return (
    <Suspense>
      <ProductsClient
        allProducts={products}
        allBrands={brandNames}
        allCategories={categories}
      />
    </Suspense>
  );
}