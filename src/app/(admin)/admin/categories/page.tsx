"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim() || null,
        sortOrder: categories.length,
      }),
    });

    setName("");
    setDescription("");
    fetchCategories();
  }

  async function handleUpdate(id: number) {
    await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: editName.trim(),
        description: editDescription.trim() || null,
      }),
    });

    setEditingId(null);
    fetchCategories();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this category? Products in this category will become uncategorized.")) return;

    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchCategories();
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-serif mb-8">Categories</h1>

        {/* Create form */}
        <form onSubmit={handleCreate} className="flex gap-3 mb-8 max-w-xl">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="flex-1 px-4 py-2.5 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="flex-1 px-4 py-2.5 rounded-sm border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-accent"
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
        ) : categories.length === 0 ? (
          <p className="text-text-muted">No categories yet. Create one above.</p>
        ) : (
          <div className="border border-border rounded-sm overflow-hidden max-w-xl">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Slug</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      {editingId === cat.id ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2 py-1 border border-border rounded-sm text-sm"
                          />
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Description"
                            className="w-full px-2 py-1 border border-border rounded-sm text-sm"
                          />
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">{cat.name}</p>
                          {cat.description && (
                            <p className="text-xs text-text-muted">{cat.description}</p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-muted">{cat.slug}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        {editingId === cat.id ? (
                          <>
                            <button
                              onClick={() => handleUpdate(cat.id)}
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
                              onClick={() => startEdit(cat)}
                              className="text-accent-dark hover:text-accent text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
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
