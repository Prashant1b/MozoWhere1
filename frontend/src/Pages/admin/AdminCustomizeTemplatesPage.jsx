import React, { useEffect, useMemo, useState } from "react";
import { customizeTemplateApi } from "../../api/customizeTemplate.api";
import CustomizeTemplateFormModal from "./CustomizeTemplateFormModal";

export default function AdminCustomizeTemplatesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  const [q, setQ] = useState("");
  const [type, setType] = useState(""); // filter

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await customizeTemplateApi.list({
        q: q || undefined,
        type: type || undefined,
      });
      setItems(res.data?.templates || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term && !type) return items;
    return items.filter((t) => {
      const okType = !type || String(t?.type || "") === type;
      const okQ =
        !term ||
        String(t?.title || "").toLowerCase().includes(term) ||
        String(t?.slug || "").toLowerCase().includes(term);
      return okType && okQ;
    });
  }, [items, q, type]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setModalOpen(true);
  };

  const onSubmit = async (payload) => {
    setErr("");
    setSaving(true);
    try {
      if (editing?._id) {
        const res = await customizeTemplateApi.update(editing._id, payload);
        const updated = res.data?.template;
        setItems((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      } else {
        const res = await customizeTemplateApi.create(payload);
        const created = res.data?.template;
        setItems((prev) => [created, ...prev]);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (e) {
      setErr(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (t) => {
    const ok = window.confirm(`Delete template: ${t?.title}?`);
    if (!ok) return;

    setErr("");
    setSaving(true);
    try {
      await customizeTemplateApi.remove(t._id);
      setItems((prev) => prev.filter((x) => x._id !== t._id));
    } catch (e) {
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
            <h1 className="text-xl font-extrabold text-gray-900">Customize Templates</h1>
            <p className="text-sm text-gray-600">
              Manage templates for Customize T-Shirts / Accessories etc.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
            >
              <option value="">All Types</option>
              <option value="tshirt">tshirt</option>
              <option value="hoodie">hoodie</option>
              <option value="sweatshirt">sweatshirt</option>
              <option value="accessory">accessory</option>
            </select>

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title / slug"
              className="h-10 w-full md:w-[280px] rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
            />

            <button
              onClick={load}
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
          <table className="min-w-[980px] w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-xs uppercase tracking-wide text-gray-600">
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Base Price</th>
                <th className="px-4 py-3">Colors</th>
                <th className="px-4 py-3">Sizes</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-5 text-sm text-gray-600" colSpan={6}>
                    Loading templates…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-sm text-gray-600" colSpan={6}>
                    No templates found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t._id} className="text-sm">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">{t.title}</div>
                      <div className="text-xs text-gray-500">{t.slug}</div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{t.type || "-"}</td>
                    <td className="px-4 py-4 text-gray-700">₹{t.basePrice ?? "-"}</td>
                    <td className="px-4 py-4 text-gray-600">
                      {Array.isArray(t.colors) ? t.colors.join(", ") : "-"}
                    </td>
                    <td className="px-4 py-4 text-gray-600">
                      {Array.isArray(t.sizes) ? t.sizes.join(", ") : "-"}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(t)}
                          className="h-9 rounded-xl border border-gray-200 px-3 text-sm font-semibold hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(t)}
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

      <CustomizeTemplateFormModal
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