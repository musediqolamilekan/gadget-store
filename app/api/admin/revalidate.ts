import { revalidatePath, revalidateTag } from "next/cache";

type SanityDocumentType = "product" | "brand" | "category" | "banner" | "post" | "order";

export function revalidateSanityDocument(type: SanityDocumentType, slugs: string[] = []) {
  switch (type) {
    case "product":
      revalidateTag("products");
      revalidateTag("featured");
      revalidateTag("bestsellers");
      for (const slug of slugs) {
        revalidateTag(`product-${slug}`);
      }
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/products/[slug]", "page");
      break;
    case "brand":
      revalidateTag("brands");
      revalidateTag("products");
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/products/[slug]", "page");
      break;
    case "category":
      revalidateTag("categories");
      revalidateTag("products");
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath("/products/[slug]", "page");
      break;
    case "banner":
      revalidateTag("banners");
      revalidatePath("/");
      break;
    case "post":
      revalidateTag("posts");
      revalidateTag("featured-posts");
      revalidatePath("/blog");
      revalidatePath("/blog/[slug]", "page");
      break;
    case "order":
      revalidatePath("/admin");
      revalidatePath("/admin/orders");
      revalidatePath("/admin/revenue");
      break;
  }
}
