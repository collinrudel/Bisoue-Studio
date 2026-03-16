export const dynamic = 'force-dynamic';

import { db } from "@/lib/db";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { formatPrice } from "@/lib/utils";
import { orders } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function AdminOrdersPage() {
  const allOrders = await db.query.orders.findMany({
    with: { items: true },
    orderBy: [desc(orders.createdAt)],
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-serif mb-8">Orders</h1>

        {allOrders.length === 0 ? (
          <p className="text-text-muted">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {allOrders.map((order) => (
              <div key={order.id} className="border border-border rounded-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-sm">{order.customerEmail}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatPrice(order.totalAmount)}</p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded bg-green-100 text-green-700 mt-0.5">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="border-t border-border pt-3 space-y-1">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-text-muted">
                        {item.productName} — Size {item.size} × {item.quantity}
                      </span>
                      <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-3">
                  Stripe: {order.stripeSessionId}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
