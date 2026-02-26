import React, { useEffect, useMemo, useState } from "react";
import { variantApi } from "../../api/variant.api";
import { X } from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-black";
const btnBase =
  "rounded-xl px-3 py-2 text-sm font-semibold transition";
const btn = `${btnBase} bg-black text-white hover:opacity-90`;
const btnGhost = `${btnBase} border border-gray-200 bg-white hover:bg-gray-50`;
const btnDanger = `${btnBase} border border-red-200 bg-red-50 text-red-700 hover:bg-red-100`;

function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="text-base font-bold">{title}</div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default function AdminVariantsPage() {
  // filters
  const [q, setQ] = useState("");
  const [isActive, setIsActive] = useState(""); // "", "true", "false"
  const [productId, setProductId] = useState(""); // optional filter
  const [page, setPage] = useState(1);
  const limit = 20;

  // data
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // modal state
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState(null); // variant object or null
  const [form, setForm] = useState({
    productId: "",
    size: "",
    color: "",
    sku: "",
    price: "",
    stock: "",
    image: "",
    isActive: true,
  });

  const params = useMemo(() => {
    const p = { page, limit };
    if (q.trim()) p.q = q.trim();
    if (isActive !== "") p.isActive = isActive;
    if (productId.trim()) p.productId = productId.trim();
    return p;
  }, [q, isActive, productId, page]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await variantApi.adminListAll(params);
      setRows(res.data?.variants ?? []);
      setPagination(res.data?.pagination ?? { total: 0, pages: 1 });
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to load variants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const resetForm = () => {
    setEditing(null);
    setForm({
      productId: "",
      size: "",
      color: "",
      sku: "",
      price: "",
      stock: "",
      image: "",
      isActive: true,
    });
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (v) => {
    setEditing(v);
    setForm({
      productId: v.product?._id || v.product || "",
      size: v.size || "",
      color: v.color || "",
      sku: v.sku || "",
      price: v.price ?? "",
      stock: v.stock ?? "",
      image: v.image || "",
      isActive: !!v.isActive,
    });
    setOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const pid = form.productId.trim();

    if (!pid) return alert("Product ID is required");
    if (!form.size.trim() || !form.color.trim()) return alert("Size & Color are required");

    const payload = {
      size: form.size.trim(),
      color: form.color.trim(),
      sku: form.sku?.trim() || undefined,
      price: form.price === "" ? undefined : Number(form.price),
      stock: form.stock === "" ? 0 : Number(form.stock),
      image: form.image?.trim() || undefined,
      isActive: form.isActive,
    };

    setSaving(true);
    try {
      if (editing?._id) {
        await variantApi.update(editing._id, payload);
      } else {
        await variantApi.create(pid, payload);
      }
      setOpen(false);
      resetForm();
      load();
    } catch (e2) {
      alert(e2?.response?.data?.message || e2.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    const ok = window.confirm("Delete this variant?");
    if (!ok) return;
    try {
      await variantApi.remove(id);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Delete failed");
    }
  };

  const onToggle = async (id) => {
    try {
      await variantApi.toggleActive(id);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Toggle failed");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Variants</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create / update variants (size, color, stock, price).
          </p>
        </div>

        <button onClick={openCreate} className={btn}>
          + Add Variant
        </button>
      </div>

      {/* Filters */}
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-4">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search sku / size / color..."
          className={inputCls}
        />
        <input
          value={productId}
          onChange={(e) => {
            setProductId(e.target.value);
            setPage(1);
          }}
          placeholder="Filter by Product ID (optional)"
          className={inputCls}
        />
        <select
          value={isActive}
          onChange={(e) => {
            setIsActive(e.target.value);
            setPage(1);
          }}
          className={inputCls}
        >
          <option value="">All</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <div className="flex gap-2">
          <button onClick={load} className={btnGhost}>
            Refresh
          </button>
          <button
            onClick={() => {
              setQ("");
              setProductId("");
              setIsActive("");
              setPage(1);
            }}
            className={btnGhost}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Color</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={8}>
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={8}>
                    No variants found.
                  </td>
                </tr>
              ) : (
                rows.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-semibold">
                        {v.product?.title || v.product?.name || "—"}
                      </div>
                      <div className="text-xs text-gray-500">{v.product?._id || "—"}</div>
                    </td>
                    <td className="px-4 py-3">{v.size}</td>
                    <td className="px-4 py-3">{v.color}</td>
                    <td className="px-4 py-3">{v.sku || "—"}</td>
                    <td className="px-4 py-3">{v.price ?? "—"}</td>
                    <td className="px-4 py-3">{v.stock ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={[
                          "rounded-full px-2 py-1 text-xs font-semibold",
                          v.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700",
                        ].join(" ")}
                      >
                        {v.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onToggle(v._id)} className={btnGhost}>
                          {v.isActive ? "Disable" : "Enable"}
                        </button>
                        <button onClick={() => openEdit(v)} className={btnGhost}>
                          Edit
                        </button>
                        <button onClick={() => onDelete(v._id)} className={btnDanger}>
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

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm">
          <div className="text-gray-600">
            Total: <span className="font-semibold text-black">{pagination.total}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`${btnGhost} disabled:opacity-50`}
            >
              Prev
            </button>

            <span className="text-gray-600">
              Page <b className="text-black">{page}</b> /{" "}
              <b className="text-black">{pagination.pages || 1}</b>
            </span>

            <button
              disabled={page >= (pagination.pages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className={`${btnGhost} disabled:opacity-50`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={open}
        title={editing ? "Update Variant" : "Create Variant"}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <form onSubmit={submit} className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-600">Product ID</label>
            <input
              value={form.productId}
              onChange={(e) => setForm((s) => ({ ...s, productId: e.target.value }))}
              placeholder="Enter productId"
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Size</label>
            <input
              value={form.size}
              onChange={(e) => setForm((s) => ({ ...s, size: e.target.value }))}
              placeholder="M / L / XL"
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Color</label>
            <input
              value={form.color}
              onChange={(e) => setForm((s) => ({ ...s, color: e.target.value }))}
              placeholder="Black / White"
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">SKU (optional)</label>
            <input
              value={form.sku}
              onChange={(e) => setForm((s) => ({ ...s, sku: e.target.value }))}
              placeholder="SKU"
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
              placeholder="499"
              className={inputCls}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm((s) => ({ ...s, stock: e.target.value }))}
              placeholder="20"
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-600">Image URL (optional)</label>
            <input
              value={form.image}
              onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))}
              placeholder="https://..."
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((s) => ({ ...s, isActive: e.target.checked }))}
            />
            <span className="text-sm text-gray-700">Active</span>
          </div>

          <div className="md:col-span-2 flex gap-2 pt-2">
            <button type="submit" disabled={saving} className={`${btn} w-full disabled:opacity-60`}>
              {saving ? "Saving..." : editing ? "Update Variant" : "Create Variant"}
            </button>
            <button
              type="button"
              className={`${btnGhost} w-full`}
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}