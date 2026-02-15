import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.id, parseInt(id)),
    with: { category: true, images: true, variants: true },
  });

  if (!product) {
    notFound();
  }

  const categories = await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-serif mb-8">Edit: {product.name}</h1>
        <ProductForm product={product} categories={categories} />
      </main>
    </div>
  );
}
