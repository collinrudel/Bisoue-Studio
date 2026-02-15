import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { orders, orderItems, productVariants, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 }
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Idempotency check
      const existingOrder = await db.query.orders.findFirst({
        where: eq(orders.stripeSessionId, session.id),
      });

      if (existingOrder) {
        return NextResponse.json({ received: true });
      }

      const cart = JSON.parse(session.metadata?.cart || "[]") as Array<{
        productId: number;
        size: string;
        quantity: number;
      }>;

      // Create order
      const [order] = await db
        .insert(orders)
        .values({
          stripeSessionId: session.id,
          customerEmail: session.customer_details?.email || "unknown",
          totalAmount: (session.amount_total || 0) / 100,
          status: "completed",
        })
        .returning();

      // Create order items and decrement stock
      for (const item of cart) {
        const product = await db.query.products.findFirst({
          where: eq(products.id, item.productId),
        });

        if (product) {
          await db.insert(orderItems).values({
            orderId: order.id,
            productId: item.productId,
            productName: product.name,
            size: item.size,
            quantity: item.quantity,
            unitPrice: product.price,
          });

          // Decrement stock
          const variant = await db.query.productVariants.findFirst({
            where: and(
              eq(productVariants.productId, item.productId),
              eq(productVariants.size, item.size)
            ),
          });

          if (variant) {
            await db
              .update(productVariants)
              .set({ stock: Math.max(0, variant.stock - item.quantity) })
              .where(eq(productVariants.id, variant.id));
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
