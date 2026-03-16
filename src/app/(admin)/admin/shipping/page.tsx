"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface ShippingRate {
  id: number;
  name: string;
  stripeRateId: string;
  isActive: boolean;
}

export default function ShippingRatesPage() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [stripeRateId, setStripeRateId] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editStripeRateId, setEditStripeRateId] = useState("");

  async function fetchRates() {
    const res = await fetch("/api/shipping-rates");
    const data = await res.json();
    setRates(data);
    setLoading(false);
  }

  useEffect(() => { fetchRates(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !stripeRateId.trim()) return;
    await fetch("/api/shipping-rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), stripeRateId: stripeRateId.trim() }),
    });
    setName("");
    setStripeRateId("");
    fetchRates();
  }

  async function handleUpdate(id: number, isActive: boolean) {
    await fetch("/api/shipping-rates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: editName.trim(), stripeRateId: editStripeRateId.trim(), isActive }),
    });
    setEditingId(null);
    fetchRates();
  }

  async function handleToggle(rate: ShippingRate) {
    await fetch("/api/shipping-rates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rate, isActive: !rate.isActive }),
    });
    fetchRates();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this shipping rate?")) return;
    await fetch("/api/shipping-rates", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchRates();
  }

  function startEdit(rate: ShippingRate) {
    setEditingId(rate.id);
    setEditName(rate.name);
    setEditStripeRateId(rate.stripeRateId);
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-serif mb-2">Shipping Rates</h1>
        <p className="text-text-muted text-sm mb-8">
          Manage Stripe shipping rate IDs. When Stripe requires you to archive and recreate a rate, update the ID here.
        </p>

        <form onSubmit={handleCreate} className="flex gap-3 mb-8 max-w-2xl">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (e.g. Standard Shipping)"
            className="flex-1 px-4 py-2.5 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            type="text"
            value={stripeRateId}
            onChange={(e) => setStripeRateId(e.target.value)}
            placeholder="Stripe Rate ID (shr_...)"
            className="flex-1 px-4 py-2.5 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors shrink-0"
          >
            Add
          </button>
        </form>

        {loading ? (
          <p className="text-text-muted">Loading...</p>
        ) : rates.length === 0 ? (
          <p className="text-text-muted">No shipping rates yet. Add one above.</p>
        ) : (
          <div className="border border-border rounded-sm overflow-hidden max-w-2xl">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Stripe Rate ID</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr key={rate.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      {editingId === rate.id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full px-2 py-1 border border-border rounded-sm text-sm"
                        />
                      ) : (
                        <span className="font-medium">{rate.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-text-muted">
                      {editingId === rate.id ? (
                        <input
                          type="text"
                          value={editStripeRateId}
                          onChange={(e) => setEditStripeRateId(e.target.value)}
                          className="w-full px-2 py-1 border border-border rounded-sm text-sm font-mono"
                        />
                      ) : (
                        rate.stripeRateId
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggle(rate)}>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded ${rate.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {rate.isActive ? "Active" : "Inactive"}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        {editingId === rate.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(rate.id, rate.isActive)}
                              className="text-green-600 hover:text-green-700 text-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-text-muted hover:text-foreground text-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(rate)}
                              className="text-accent-dark hover:text-accent text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(rate.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
