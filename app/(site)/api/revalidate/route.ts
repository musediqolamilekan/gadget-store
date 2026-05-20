import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Sanity Webhook → Next.js On-Demand Revalidation
 *
 * Set up in Sanity:
 *  Dashboard → API → Webhooks → Create
 *  URL:      https://horlarzgadgets.com/api/revalidate
 *  Trigger:  Create, Update, Delete
 *  Filter:   _type in ["product", "brand", "category", "banner"]
 *  Secret:   <paste SANITY_WEBHOOK_SECRET here>
 */

export async function POST(req: NextRequest) {
  // ── Verify secret ────────────────────────────────────────
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { _type, slug } = body as { _type: string; slug?: { current: string } };

    switch (_type) {
      case "product":
        revalidateTag("products");
        revalidateTag("featured");
        revalidateTag("bestsellers");
        if (slug?.current) {
          revalidateTag(`product-${slug.current}`);
        }
        break;

      case "brand":
        revalidateTag("brands");
        revalidateTag("products"); // brand name shown on cards
        break;

      case "category":
        revalidateTag("categories");
        revalidateTag("products"); // products carry category data
        if (slug?.current) {
          revalidateTag(`category-${slug.current}`);
        }
        break;

      case "banner":
        revalidateTag("banners");
        break;

      default:
        revalidateTag("products");
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      now: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 }
    );
  }
}