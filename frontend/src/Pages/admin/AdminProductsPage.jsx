import React, { useEffect, useMemo, useState } from "react";
import { productApi } from "../../api/product.api";
import ProductFormModal from "./ProductFormModal";

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const load = async (query = q) => {
    setErr("");
    setLoading(true);
    try {
      const res = await productApi.list({
        q: query,
        limit: 50,
        sort: "-createdAt",
      });
      setItems(res.data?.products || []);
    } catch (e) {
      console.log("LIST ERROR:", e?.response?.data || e?.message);
      setErr(e?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
  }, []);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;

    return items.filter((p) => {
      const t = String(p?.title || "").toLowerCase();
      const s = String(p?.slug || "").toLowerCase();
      const c = String(p?.category?.name || p?.category?.slug || "").toLowerCase();
      const g = String(p?.gender || "").toLowerCase();
      return t.includes(term) || s.includes(term) || c.includes(term) || g.includes(term);
    });
  }, [items, q]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setModalOpen(true);
  };

  const onSubmit = async (payload) => {
    setErr("");
    setSaving(true);
    try {
      if (editing?._id) {
        const res = await productApi.update(editing._id, payload);
        const updated = res.data?.product;
        setItems((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      } else {
        const res = await productApi.create(payload);
        const created = res.data?.product;
        setItems((prev) => [created, ...prev]);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      console.log("SAVE ERROR:", e?.response?.data || e?.message);
      setErr(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (p) => {
    const ok = window.confirm(`Delete product: ${p?.title}?`);
    if (!ok) return;

    setErr("");
    setSaving(true);
    try {
      await productApi.remove(p._id);
      setItems((prev) => prev.filter((x) => x._id !== p._id));
    } catch (e) {
      console.log("DELETE ERROR:", e?.response?.data || e?.message);
      setErr(e?.response?.data?.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Products</h1>
            <p className="text-sm text-gray-600">Create, edit and delete products.</p>
          </div>

          <div className="flex gap-2 flex-col md:flex-row w-full md:w-auto">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title / slug / category / gender"
              className="h-10 w-full md:w-[320px] rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
            />
            <button
              onClick={() => load(q)}
              className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-semibold hover:bg-gray-50"
            >
              Search
            </button>
            <button
              onClick={openCreate}
              className="h-10 rounded-xl bg-black px-4 text-sm font-semibold text-white hover:opacity-90"
            >
              + New
            </button>
          </div>
        </div>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-xs uppercase tracking-wide text-gray-600">
                 <th className="px-4 py-3">Product id</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-5 text-sm text-gray-600" colSpan={6}>
                    Loading products…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-sm text-gray-600" colSpan={6}>
                    No products found.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="text-sm">
                     <td className="px-4 py-4 text-gray-700">
                      {p?._id|| p?._id || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">{p.title}</div>
                      <div className="text-xs text-gray-500">{p.slug}</div>
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {p?.category?.name || p?.category?.slug || "-"}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-800">
                        {p?.gender || "-"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-gray-700">
                      {p.discountPrice != null ? (
                        <div>
                          <div className="font-semibold">₹{p.discountPrice}</div>
                          <div className="text-xs text-gray-500 line-through">₹{p.basePrice}</div>
                        </div>
                      ) : (
                        <div className="font-semibold">₹{p.basePrice}</div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                          p.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800",
                        ].join(" ")}
                      >
                        {p.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="h-9 rounded-xl border border-gray-200 px-3 text-sm font-semibold hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(p)}
                          disabled={saving}
                          className="h-9 rounded-xl bg-red-600 px-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
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

      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={onSubmit}
        saving={saving}
        initial={editing}
      />
    </div>
  );
}