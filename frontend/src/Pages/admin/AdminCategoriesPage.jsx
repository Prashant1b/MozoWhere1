import React, { useEffect, useState } from "react";
import { categoryApi } from "../../api/category.api";

export default function AdminCategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [isTrending, setIsTrending] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
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
    setImage("");
    setIsTrending(true);
    setSortOrder(0);
    setEditing(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");

    const payload = {
      name,
      slug,
      image,
      isTrending,
      sortOrder: Number(sortOrder || 0),
    };

    try {
      if (editing) {
        const res = await categoryApi.update(editing._id, payload);
        const updated = res.data?.category;
        setCategories((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      } else {
        const res = await categoryApi.create(payload);
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
    setName(cat.name || "");
    setSlug(cat.slug || "");
    setImage(cat.image || "");
    setIsTrending(cat.isTrending !== false);
    setSortOrder(Number(cat.sortOrder || 0));
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
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-extrabold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-600">Manage categories used in products and trending section.</p>

        {err && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}

        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
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

          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL for trending card"
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
          />

          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            placeholder="Sort Order"
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
          />

          <label className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 px-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
            />
            Show in Trending
          </label>

          <button
            disabled={saving}
            className="h-11 rounded-xl bg-black text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : editing ? "Update Category" : "Create Category"}
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr className="text-xs uppercase text-gray-600">
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Trending</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td className="px-4 py-5 text-sm text-gray-600" colSpan={6}>
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td className="px-4 py-5 text-sm text-gray-600" colSpan={6}>
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="text-sm">
                  <td className="px-4 py-4">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="h-12 w-12 rounded-md object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-gray-100" />
                    )}
                  </td>

                  <td className="px-4 py-4 font-semibold text-gray-900">{cat.name}</td>

                  <td className="px-4 py-4 text-gray-600">{cat.slug}</td>

                  <td className="px-4 py-4 text-gray-600">{cat.isTrending !== false ? "Yes" : "No"}</td>

                  <td className="px-4 py-4 text-gray-600">{Number(cat.sortOrder || 0)}</td>

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