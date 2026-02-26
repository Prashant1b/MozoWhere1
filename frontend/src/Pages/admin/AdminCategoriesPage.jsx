import React, { useEffect, useState } from "react";
import { categoryApi } from "../../api/category.api";

export default function AdminCategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await categoryApi.list();
      setCategories(res.data?.categories || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setName("");
    setSlug("");
    setEditing(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");

    try {
      if (editing) {
        const res = await categoryApi.update(editing._id, { name, slug });
        const updated = res.data?.category;
        setCategories((prev) =>
          prev.map((c) => (c._id === updated._id ? updated : c))
        );
      } else {
        const res = await categoryApi.create({ name, slug });
        const created = res.data?.category;
        setCategories((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (e) {
      setErr(e?.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (cat) => {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
  };

  const onDelete = async (cat) => {
    const ok = window.confirm(`Delete category: ${cat.name}?`);
    if (!ok) return;

    try {
      await categoryApi.remove(cat._id);
      setCategories((prev) => prev.filter((c) => c._id !== cat._id));
    } catch (e) {
      setErr(e?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-extrabold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-600">
          Manage product categories.
        </p>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category Name"
            required
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
          />

          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug (optional)"
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
          />

          <button
            disabled={saving}
            className="h-11 rounded-xl bg-black text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editing
              ? "Update Category"
              : "Create Category"}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs uppercase text-gray-600">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td className="px-4 py-5 text-sm text-gray-600" colSpan={3}>
                  Loading categories…
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td className="px-4 py-5 text-sm text-gray-600" colSpan={3}>
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="text-sm">
                  <td className="px-4 py-4 font-semibold text-gray-900">
                    {cat.name}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {cat.slug}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(cat)}
                        className="h-9 rounded-xl border border-gray-200 px-3 text-sm font-semibold hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onDelete(cat)}
                        className="h-9 rounded-xl bg-red-600 px-3 text-sm font-semibold text-white hover:opacity-90"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}