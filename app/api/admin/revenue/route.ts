import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const requestedRange = Number(searchParams.get("range") ?? "30");
  const days = [7, 30, 90].includes(requestedRange) ? requestedRange : 30;

  try {
    const now = new Date();

    // Use UTC boundaries so order timestamps and chart buckets share a timezone.
    const buckets: { date: string; start: string; end: string }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - i);
      d.setUTCHours(0, 0, 0, 0);
      const e = new Date(d);
      e.setUTCHours(23, 59, 59, 999);
      buckets.push({
        date: d.toISOString().slice(0, 10),
        start: d.toISOString(),
        end: e.toISOString(),
      });
    }

    // Monthly buckets (last 12 months)
    const monthBuckets: { label: string; start: string; end: string }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const e = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      monthBuckets.push({
        label: d.toLocaleDateString("en-NG", { month: "short", year: "2-digit" }),
        start: d.toISOString(),
        end: e.toISOString(),
      });
    }

    // Fetch all paid orders (no-cache)
    const orders = await sanityClient.withConfig({ useCdn: false }).fetch(
      groq`*[_type == "order" && paymentStatus == "paid"] | order(createdAt desc) {
        _id, orderNumber, customerName, customerEmail, total, status,
        paymentMethod, createdAt, paidAt, "itemCount": count(items)
      }`,
      {},
      { cache: "no-store" }
    );

    // Build daily revenue map
    const dailyMap: Record<string, { revenue: number; orders: number }> = {};
    for (const b of buckets) dailyMap[b.date] = { revenue: 0, orders: 0 };

    for (const o of orders) {
      const key = o.createdAt?.slice(0, 10);
      if (key && dailyMap[key]) {
        dailyMap[key].revenue += o.total ?? 0;
        dailyMap[key].orders += 1;
      }
    }

    const dailyData = buckets.map((b) => ({
      date: b.date,
      revenue: dailyMap[b.date]?.revenue ?? 0,
      orders: dailyMap[b.date]?.orders ?? 0,
    }));

    // Build monthly revenue
    const monthlyData = monthBuckets.map((b) => {
      const rev = orders
        .filter((o: { createdAt: string; total: number }) =>
          o.createdAt >= b.start && o.createdAt <= b.end
        )
        .reduce((s: number, o: { total: number }) => s + (o.total ?? 0), 0);
      const cnt = orders.filter((o: { createdAt: string }) =>
        o.createdAt >= b.start && o.createdAt <= b.end
      ).length;
      return { label: b.label, revenue: rev, orders: cnt };
    });

    // Payment method breakdown
    const methodMap: Record<string, { revenue: number; count: number }> = {};
    for (const o of orders) {
      const m = o.paymentMethod ?? "unknown";
      if (!methodMap[m]) methodMap[m] = { revenue: 0, count: 0 };
      methodMap[m].revenue += o.total ?? 0;
      methodMap[m].count += 1;
    }

    // Top customers
    const customerMap: Record<string, { name: string; email: string; revenue: number; orders: number }> = {};
    for (const o of orders) {
      if (!customerMap[o.customerEmail]) {
        customerMap[o.customerEmail] = { name: o.customerName, email: o.customerEmail, revenue: 0, orders: 0 };
      }
      customerMap[o.customerEmail].revenue += o.total ?? 0;
      customerMap[o.customerEmail].orders += 1;
    }
    const topCustomers = Object.values(customerMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Totals
    const totalRevenue = orders.reduce((s: number, o: { total: number }) => s + (o.total ?? 0), 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

    const monthRevenue = orders
      .filter((o: { createdAt: string }) => o.createdAt >= startOfMonth)
      .reduce((s: number, o: { total: number }) => s + (o.total ?? 0), 0);
    const lastMonthRevenue = orders
      .filter((o: { createdAt: string }) =>
        o.createdAt >= startOfLastMonth && o.createdAt <= endOfLastMonth
      )
      .reduce((s: number, o: { total: number }) => s + (o.total ?? 0), 0);

    const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

    return NextResponse.json({
      data: {
        totalRevenue,
        monthRevenue,
        lastMonthRevenue,
        avgOrderValue,
        totalOrders: orders.length,
        dailyData,
        monthlyData,
        paymentMethods: methodMap,
        topCustomers,
        recentOrders: orders.slice(0, 20),
      },
    });
  } catch (error) {
    console.error("Revenue API error:", error);
    return NextResponse.json({ error: "Failed to fetch revenue data" }, { status: 500 });
  }
}
