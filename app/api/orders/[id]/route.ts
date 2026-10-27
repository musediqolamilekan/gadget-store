import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// GET single order with full details
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const order = await sanityClient.withConfig({ useCdn: false }).fetch(
      groq`*[_type == "order" && _id == $id][0] {
        _id, orderNumber, customerName, customerEmail, customerPhone,
        shippingAddress, items, subtotal, shippingFee, total,
        paymentMethod, paymentStatus, paystackReference, paystackTransactionId,
        paidAt, status, trackingNumber, deliveryNote, createdAt, _updatedAt
      }`,
      { id },
      { cache: "no-store" }
    );
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ data: order });
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
