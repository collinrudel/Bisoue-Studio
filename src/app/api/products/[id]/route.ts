import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, productImages, productVariants } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await db.query.products.findFirst({
      where: eq(products.id, parseInt(id)),
      with: { category: true, images: true, variants: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await request.json();
    const {
      name,
      description,
      price,
      compareAtPrice,
      categoryId,
      isActive,
      isFeatured,
      images,
      variants,
    } = body;

    await db
      .update(products)
      .set({
        ...(name && { name, slug: slugify(name) }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        compareAtPrice: compareAtPrice ?? null,
        ...(categoryId !== undefined && { categoryId: categoryId || null }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(products.id, productId));

    // Replace images if provided
    if (images) {
      await db
        .delete(productImages)
        .where(eq(productImages.productId, productId));
      for (const img of images) {
        await db.insert(productImages).values({
          productId,
          url: img.url,
          altText: img.altText || name || "",
          sortOrder: img.sortOrder || 0,
          isPrimary: img.isPrimary || false,
        });
      }
    }

    // Replace variants if provided
    if (variants) {
      await db
        .delete(productVariants)
        .where(eq(productVariants.productId, productId));
      for (const variant of variants) {
        await db.insert(productVariants).values({
          productId,
          size: variant.size,
          stock: variant.stock || 0,
          sku: variant.sku || null,
        });
      }
    }

    const updated = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: { category: true, images: true, variants: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(products).where(eq(products.id, parseInt(id)));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
