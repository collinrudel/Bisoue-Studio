import { db } from "@/lib/db";
import { products, productVariants, orders } from "@/lib/db/schema";
import { eq, lt, sql } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";

export default async function AdminDashboard() {
  const allProducts = await db.query.products.findMany({
    with: { variants: true },
  });

  const totalProducts = allProducts.length;
  const activeProducts = allProducts.filter((p) => p.isActive).length;

  const lowStockItems = allProducts.flatMap((p) =>
    p.variants.filter((v) => v.stock > 0 && v.stock <= 3).map((v) => ({
      productName: p.name,
      size: v.size,
      stock: v.stock,
      productId: p.id,
    }))
  );

  const outOfStockCount = allProducts.flatMap((p) =>
    p.variants.filter((v) => v.stock === 0)
  ).length;

  const allOrders = await db.query.orders.findMany({
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    limit: 5,
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-serif mb-8">Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-background border border-border rounded-sm p-6">
            <p className="text-sm text-text-muted">Total Products</p>
            <p className="text-3xl font-serif mt-1">{totalProducts}</p>
          </div>
          <div className="bg-background border border-border rounded-sm p-6">
            <p className="text-sm text-text-muted">Active Products</p>
            <p className="text-3xl font-serif mt-1">{activeProducts}</p>
          </div>
          <div className="bg-background border border-border rounded-sm p-6">
            <p className="text-sm text-text-muted">Low Stock Alerts</p>
            <p className="text-3xl font-serif mt-1 text-accent-dark">{lowStockItems.length}</p>
          </div>
          <div className="bg-background border border-border rounded-sm p-6">
            <p className="text-sm text-text-muted">Out of Stock</p>
            <p className="text-3xl font-serif mt-1">{outOfStockCount}</p>
          </div>
        </div>

        {/* Low Stock */}
        {lowStockItems.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-serif mb-4">Low Stock Alerts</h2>
            <div className="border border-border rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Product</th>
                    <th className="text-left px-4 py-3 font-medium">Size</th>
                    <th className="text-left px-4 py-3 font-medium">Stock</th>
                    <th className="text-left px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-4 py-3">{item.productName}</td>
                      <td className="px-4 py-3">{item.size}</td>
                      <td className="px-4 py-3 text-accent-dark font-medium">{item.stock}</td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/products/${item.productId}/edit`} className="text-accent-dark hover:text-accent text-sm">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Orders */}
        <div>
          <h2 className="text-xl font-serif mb-4">Recent Orders</h2>
          {allOrders.length === 0 ? (
            <p className="text-text-muted text-sm">No orders yet.</p>
          ) : (
            <div className="border border-border rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Order ID</th>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Total</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <tr key={order.id} className="border-t border-border">
                      <td className="px-4 py-3">#{order.id}</td>
                      <td className="px-4 py-3">{order.customerEmail}</td>
                      <td className="px-4 py-3">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
