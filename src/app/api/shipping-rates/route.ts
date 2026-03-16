import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { shippingRates } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const rates = await db.query.shippingRates.findMany();
    return NextResponse.json(rates);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch shipping rates" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, stripeRateId } = await request.json();
    if (!name || !stripeRateId) {
      return NextResponse.json(
        { error: "Name and Stripe Rate ID are required" },
        { status: 400 }
      );
    }
    const [rate] = await db
      .insert(shippingRates)
      .values({ name, stripeRateId, isActive: true })
      .returning();
    return NextResponse.json(rate, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create shipping rate" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, stripeRateId, isActive } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await db
      .update(shippingRates)
      .set({ name, stripeRateId, isActive })
      .where(eq(shippingRates.id, id));
    const updated = await db.query.shippingRates.findFirst({
      where: eq(shippingRates.id, id),
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update shipping rate" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.delete(shippingRates).where(eq(shippingRates.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete shipping rate" },
      { status: 500 }
    );
  }
}
