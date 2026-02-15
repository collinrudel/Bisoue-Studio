import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products, productImages, productVariants } from "@/lib/db/schema";
import { eq, desc, asc, like } from "drizzle-orm";
import { slugify } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    let allProducts = await db.query.products.findMany({
      with: {
        category: true,
        images: true,
        variants: true,
      },
      where: eq(products.isActive, true),
    });

    // Filter by category slug
    if (category) {
      allProducts = allProducts.filter(
        (p) => p.category?.slug === category
      );
    }

    // Filter featured
    if (featured === "true") {
      allProducts = allProducts.filter((p) => p.isFeatured);
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      allProducts = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case "price-asc":
        allProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        allProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        allProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        allProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return NextResponse.json(allProducts);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    if (!name || !description || price == null) {
      return NextResponse.json(
        { error: "Name, description, and price are required" },
        { status: 400 }
      );
    }

    const slug = slugify(name);

    const [product] = await db
      .insert(products)
      .values({
        name,
        slug,
        description,
        price,
        compareAtPrice: compareAtPrice || null,
        categoryId: categoryId || null,
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
      })
      .returning();

    // Insert images
    if (images && images.length > 0) {
      for (const img of images) {
        await db.insert(productImages).values({
          productId: product.id,
          url: img.url,
          altText: img.altText || name,
          sortOrder: img.sortOrder || 0,
          isPrimary: img.isPrimary || false,
        });
      }
    }

    // Insert variants
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await db.insert(productVariants).values({
          productId: product.id,
          size: variant.size,
          stock: variant.stock || 0,
          sku: variant.sku || null,
        });
      }
    }

    const fullProduct = await db.query.products.findFirst({
      where: eq(products.id, product.id),
      with: { category: true, images: true, variants: true },
    });

    return NextResponse.json(fullProduct, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
