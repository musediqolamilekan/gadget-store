import { revalidateTag, revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // ── Verify secret ────────────────────────────────────
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { _type, slug } = body as {
      _type: string;
      slug?: { current: string };
    };

    switch (_type) {
      case "product":
        revalidateTag("products");
        revalidateTag("featured");
        revalidateTag("bestsellers");
        revalidatePath("/");
        revalidatePath("/products");
        if (slug?.current) {
          revalidateTag(`product-${slug.current}`);
          revalidatePath(`/products/${slug.current}`);
        }
        break;

      case "brand":
        revalidateTag("brands");
        revalidateTag("products");
        revalidatePath("/products");
        break;

      case "category":
        revalidateTag("categories");
        revalidateTag("products");
        revalidatePath("/");
        revalidatePath("/products");
        if (slug?.current) {
          revalidateTag(`category-${slug.current}`);
        }
        break;

      case "banner":
        revalidateTag("banners");
        revalidatePath("/");
        break;

      case "post":
        revalidateTag("posts");
        revalidateTag("featured-posts");
        revalidatePath("/blog");
        if (slug?.current) {
          revalidateTag(`post-${slug.current}`);
          revalidatePath(`/blog/${slug.current}`);
        }
        break;

      default:
        // Nuclear option — revalidate everything
        revalidateTag("products");
        revalidateTag("categories");
        revalidateTag("brands");
        revalidateTag("banners");
        revalidateTag("posts");
        revalidatePath("/");
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      slug: slug?.current ?? null,
      now: new Date().toISOString(),
    });

  } catch (err) {
    return NextResponse.json(
      { message: "Revalidation failed", error: String(err) },
      { status: 500 }
    );
  }
}