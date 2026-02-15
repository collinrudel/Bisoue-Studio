import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface CartItem {
  productId: number;
  size: string;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const { items } = (await request.json()) as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const lineItems = [];

    for (const item of items) {
      // Validate product exists and get real price
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
        with: { images: true, variants: true },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      // Check stock
      const variant = product.variants.find((v) => v.size === item.size);
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name} (${item.size})`,
          },
          { status: 400 }
        );
      }

      const primaryImage = product.images.find((i) => i.isPrimary);

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: `Size: ${item.size}`,
            ...(primaryImage && {
              images: [
                `${process.env.BASE_URL || "http://localhost:3000"}${primaryImage.url}`,
              ],
            }),
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.BASE_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL || "http://localhost:3000"}/cart`,
      metadata: {
        cart: JSON.stringify(items),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
