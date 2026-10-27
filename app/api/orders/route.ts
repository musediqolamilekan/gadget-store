import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/sanity/lib/write-client";
import { sanityClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { revalidateSanityDocument } from "@/app/api/admin/revalidate";

export const dynamic = "force-dynamic";

// ── Generate order number ──────────────────────────────────────
async function generateOrderNumber(): Promise<string> {
  const count = await sanityClient.withConfig({ useCdn: false }).fetch<number>(
    groq`count(*[_type == "order"])`,
    {},
    { cache: "no-store" }
  );
  const padded = String((count ?? 0) + 1).padStart(4, "0");
  return `HLZ-${padded}`;
}

// ── POST: verify Paystack & create order ───────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      reference,
      customerName, customerEmail, customerPhone,
      shippingAddress, items, subtotal, shippingFee, total,
    } = body;

    if (!reference || !customerEmail || !items?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Verify payment with Paystack ───────────────────────────
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status || paystackData.data?.status !== "success") {
      return NextResponse.json(
        { error: "Payment verification failed", details: paystackData.message },
        { status: 402 }
      );
    }

    const txData = paystackData.data;
    const paidAmountKobo = txData.amount; // Paystack amount is in kobo
    const paidAmountNaira = paidAmountKobo / 100;

    // Basic amount sanity check (±5% tolerance for rounding)
    if (Math.abs(paidAmountNaira - total) > total * 0.05) {
      return NextResponse.json(
        { error: "Payment amount mismatch" },
        { status: 402 }
      );
    }

    // ── Check if order with this reference already exists ──────
    const existing = await sanityClient.withConfig({ useCdn: false }).fetch(
      groq`*[_type == "order" && paystackReference == $ref][0]._id`,
      { ref: reference },
      { cache: "no-store" }
    );

    if (existing) {
      return NextResponse.json({ success: true, orderNumber: existing, duplicate: true });
    }

    // ── Create Sanity order document ───────────────────────────
    const orderNumber = await generateOrderNumber();
    const doc = {
      _type: "order",
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items: items.map((item: {
        productId: string; productName: string; productSlug: string;
        brand: string; category: string; imageUrl: string;
        unitPrice: number; quantity: number; lineTotal: number;
      }) => ({
        _key: `${item.productId}-${Date.now()}`,
        _type: "orderItem",
        ...item,
      })),
      subtotal,
      shippingFee: shippingFee ?? 0,
      total,
      paymentMethod: "paystack",
      paymentStatus: "paid",
      paystackReference: reference,
      paystackTransactionId: txData.id?.toString(),
      paidAt: new Date(txData.paid_at || Date.now()).toISOString(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    const created = await writeClient.create(doc);
    revalidateSanityDocument("order");
    return NextResponse.json({ success: true, orderNumber, id: created._id }, { status: 201 });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── GET: list orders (admin) ───────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const status = searchParams.get("status") ?? "";
  const paymentStatus = searchParams.get("paymentStatus") ?? "";
  const offset = (page - 1) * limit;

  try {
    const filter = [
      `_type == "order"`,
      status ? `status == "${status}"` : "",
      paymentStatus ? `paymentStatus == "${paymentStatus}"` : "",
    ].filter(Boolean).join(" && ");

    const [orders, total] = await Promise.all([
      sanityClient.withConfig({ useCdn: false }).fetch(
        groq`*[${filter}] | order(createdAt desc) [${offset}...${offset + limit}] {
          _id, orderNumber, customerName, customerEmail, customerPhone,
          status, paymentStatus, paymentMethod, total, subtotal, shippingFee,
          paystackReference, createdAt, paidAt,
          "itemCount": count(items)
        }`,
        {},
        { cache: "no-store" }
      ),
      sanityClient.withConfig({ useCdn: false }).fetch(
        groq`count(*[${filter}])`,
        {},
        { cache: "no-store" }
      ),
    ]);

    return NextResponse.json({ data: orders, total, page, limit });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// ── PATCH: update order status ────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { _id, ...updates } = await req.json();
    if (!_id) return NextResponse.json({ error: "Missing _id" }, { status: 400 });
    const unsetFields = Object.keys(updates).filter((field) => updates[field] === null);
    const setUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== null)
    );
    let patch = writeClient.patch(_id).set(setUpdates);
    if (unsetFields.length) patch = patch.unset(unsetFields);
    const result = await patch.commit();
    revalidateSanityDocument("order");
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Order PATCH error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
