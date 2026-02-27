import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/admin.api";

export default function AdminBulkOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rows, setRows] = useState([]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await adminApi.listBulkOrders();
      setRows(res.data?.bulkOrders || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load bulk orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Bulk Order Requests</h1>
            <p className="text-sm text-gray-600">Customer bulk enquiries with uploaded design images.</p>
          </div>
          <button onClick={load} className="h-10 rounded-xl border border-gray-200 px-4 text-sm font-semibold hover:bg-gray-50">
            Refresh
          </button>
        </div>
        {err ? <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{err}</div> : null}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">No requests found.</div>
        ) : (
          rows.map((r) => (
            <div key={r._id} className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-bold text-gray-900">{r.name} ({r.email})</div>
                <div className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div className="mt-1 text-sm text-gray-700">
                Product: <b>{r.product}</b> | Cloth: <b>{r.clothOption}</b> | Qty: <b>{r.quantity}</b> | Total: <b>Rs {Number(r?.pricing?.totalPrice || 0)}</b>
              </div>
              {r.company ? <div className="mt-1 text-xs text-gray-600">Company: {r.company}</div> : null}
              {r.notes ? <div className="mt-1 text-xs text-gray-600">Notes: {r.notes}</div> : null}

              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {(r.images || []).map((im, idx) => (
                  <a key={idx} href={im.dataUrl} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-lg border border-gray-200">
                    <img src={im.dataUrl} alt={im.name || "design"} className="h-24 w-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

