import { db } from "@/lib/db";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import DeleteProductButton from "./DeleteProductButton";

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    with: { category: true, images: true, variants: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-serif">Products</h1>
          <Link
            href="/admin/products/new"
            className="bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Add Product
          </Link>
        </div>

        <div className="border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Product</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.map((product) => {
                const totalStock = product.variants.reduce(
                  (sum, v) => sum + v.stock,
                  0
                );
                return (
                  <tr key={product.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.isFeatured && (
                          <span className="text-xs text-accent-dark">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {product.category?.name || "—"}
                    </td>
                    <td className="px-4 py-3">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={totalStock <= 3 && totalStock > 0 ? "text-accent-dark font-medium" : totalStock === 0 ? "text-red-500 font-medium" : ""}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs px-2 py-0.5 rounded ${product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {product.isActive ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-accent-dark hover:text-accent text-sm"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
