import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const allCategories = await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
    });
    return NextResponse.json(allCategories);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, sortOrder } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const [category] = await db
      .insert(categories)
      .values({
        name,
        slug: slugify(name),
        description: description || null,
        sortOrder: sortOrder || 0,
      })
      .returning();

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, description, sortOrder } = await request.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    await db
      .update(categories)
      .set({
        name,
        slug: slugify(name),
        description: description || null,
        sortOrder: sortOrder ?? 0,
      })
      .where(eq(categories.id, id));

    const updated = await db.query.categories.findFirst({
      where: eq(categories.id, id),
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await db.delete(categories).where(eq(categories.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
