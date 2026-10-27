import { NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
    const last30days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const stats = await sanityClient.withConfig({ useCdn: false }).fetch(
      groq`{
        "totalProducts": count(*[_type == "product"]),
        "totalBrands": count(*[_type == "brand"]),
        "totalCategories": count(*[_type == "category"]),
        "totalBanners": count(*[_type == "banner"]),
        "totalPosts": count(*[_type == "post"]),
        "featuredProducts": count(*[_type == "product" && isFeatured == true]),
        "newArrivals": count(*[_type == "product" && isNew == true]),
        "bestsellers": count(*[_type == "product" && isBestseller == true]),
        "activeBanners": count(*[_type == "banner" && isActive == true]),
        "outOfStock": count(*[_type == "product" && stockCount == 0]),
        "lowStock": count(*[_type == "product" && stockCount > 0 && stockCount <= 5]),
        "avgRating": math::avg(*[_type == "product"].rating),
        "totalStock": math::sum(*[_type == "product"].stockCount),
        "totalReviews": math::sum(*[_type == "product"].reviewCount),
        "totalOrders": count(*[_type == "order"]),
        "pendingOrders": count(*[_type == "order" && status == "pending"]),
        "confirmedOrders": count(*[_type == "order" && status == "confirmed"]),
        "processingOrders": count(*[_type == "order" && status == "processing"]),
        "shippedOrders": count(*[_type == "order" && status == "shipped"]),
        "deliveredOrders": count(*[_type == "order" && status == "delivered"]),
        "cancelledOrders": count(*[_type == "order" && status == "cancelled"]),
        "paidOrders": count(*[_type == "order" && paymentStatus == "paid"]),
        "totalRevenue": math::sum(*[_type == "order" && paymentStatus == "paid"].total),
        "monthRevenue": math::sum(*[_type == "order" && paymentStatus == "paid" && createdAt >= $startOfMonth].total),
        "lastMonthRevenue": math::sum(*[_type == "order" && paymentStatus == "paid" && createdAt >= $startOfLastMonth && createdAt <= $endOfLastMonth].total),
        "last30Revenue": math::sum(*[_type == "order" && paymentStatus == "paid" && createdAt >= $last30days].total),
        "avgOrderValue": math::avg(*[_type == "order" && paymentStatus == "paid"].total),
        "recentOrders": *[_type == "order"] | order(createdAt desc)[0...5] {
          _id, orderNumber, customerName, total, status, paymentStatus, createdAt,
          "itemCount": count(items)
        },
        "recentProducts": *[_type == "product"] | order(_createdAt desc)[0...5] {
          _id, name, price, stockCount,
          "image": images[isPrimary == true][0].image.asset->url,
          "category": category->title,
          isFeatured, isNew
        },
        "categoryBreakdown": *[_type == "category"] | order(order asc) {
          title,
          "count": count(*[_type == "product" && references(^._id)])
        },
        "recentPosts": *[_type == "post"] | order(publishedAt desc)[0...3] {
          _id, title, category, publishedAt,
          "coverUrl": coverImage.asset->url
        }
      }`,
      { startOfMonth, startOfLastMonth, endOfLastMonth, last30days },
      { cache: "no-store" }
    );

    return NextResponse.json({ data: stats });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
