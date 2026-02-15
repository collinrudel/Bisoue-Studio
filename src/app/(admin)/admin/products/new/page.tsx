import { db } from "@/lib/db";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await db.query.categories.findMany({
    orderBy: (categories, { asc }) => [asc(categories.sortOrder)],
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-serif mb-8">Add New Product</h1>
        <ProductForm categories={categories} />
      </main>
    </div>
  );
}
