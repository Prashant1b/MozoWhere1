import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../api/admin.api";
import StatusPill from "../../Components/admin/StatusPill";

const allowed = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

function getItemThumb(it) {
  if (!it) return "";
  if (it.type === "custom") {
    const fromPreview = it?.customSnapshot?.preview?.front || it?.customSnapshot?.preview?.back;
    const fromLayer =
      Array.isArray(it?.customSnapshot?.layers)
        ? it.customSnapshot.layers.find((l) => l?.kind === "image" && l?.imageUrl)?.imageUrl
        : "";
    return fromPreview || fromLayer || it?.image || "";
  }
  return it?.image || "";
}

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await adminApi.listOrders();
      setOrders(res.data?.orders || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((o) => {
      const id = String(o?._id || "").toLowerCase();
      const email = String(o?.user?.emailid || o?.user?.email || "").toLowerCase();
      const status = String(o?.orderStatus || "").toLowerCase();
      return id.includes(term) || email.includes(term) || status.includes(term);
    });
  }, [orders, q]);

  const onChangeStatus = async (id, nextStatus) => {
    setErr("");
    setSavingId(id);
    try {
      const res = await adminApi.updateOrderStatus(id, nextStatus);
      const updated = res.data?.order;
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...updated } : o)));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to update status");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Orders</h1>
            <p className="text-sm text-gray-600">View and update order status, including customized orders.</p>
          </div>

          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by order id / email / status"
              className="h-10 w-full rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400 md:w-[360px]"
            />
            <button
              onClick={load}
              className="h-10 rounded-xl bg-black px-4 text-sm font-semibold text-white hover:opacity-90"
            >
              Refresh
            </button>
          </div>
        </div>

        {err && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[1040px] w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr className="text-xs uppercase tracking-wide text-gray-600">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-5 text-sm text-gray-600" colSpan={6}>
                    Loading orders...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-5 text-sm text-gray-600" colSpan={6}>
                    No orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <OrderRow
                    key={o._id}
                    order={o}
                    saving={savingId === o._id}
                    onChangeStatus={onChangeStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order, saving, onChangeStatus }) {
  const [next, setNext] = useState(order?.orderStatus || "pending");

  useEffect(() => {
    setNext(order?.orderStatus || "pending");
  }, [order?.orderStatus]);

  const created = order?.createdAt ? new Date(order.createdAt).toLocaleString() : "-";
  const userEmail = order?.user?.emailid || order?.user?.email || "-";
  const items = Array.isArray(order?.items) ? order.items : [];
  const customCount = items.filter((i) => i?.type === "custom").length;
  const firstThumb = getItemThumb(items[0]);

  return (
    <tr className="text-sm">
      <td className="px-4 py-4">
        <div className="font-semibold text-gray-900">{order?._id}</div>
        <div className="text-xs text-gray-500">Rs {Number(order?.totalAmount || 0)}</div>
      </td>

      <td className="px-4 py-4">
        <div className="text-gray-900">{userEmail}</div>
      </td>

      <td className="px-4 py-4">
        <div className="text-gray-900">{items.length} item(s)</div>
        <div className="text-xs text-gray-500">
          {customCount > 0 ? `${customCount} customized` : "No customized item"}
        </div>
        {firstThumb ? (
          <img
            src={firstThumb}
            alt="order-item"
            className="mt-2 h-10 w-10 rounded-md border border-gray-200 object-cover"
          />
        ) : null}
      </td>

      <td className="px-4 py-4 text-gray-600">{created}</td>

      <td className="px-4 py-4">
        <StatusPill status={order?.orderStatus} />
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <select
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="h-10 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
            disabled={saving}
          >
            {allowed.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => onChangeStatus(order._id, next)}
            disabled={saving || next === order?.orderStatus}
            className="h-10 rounded-xl bg-black px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </td>
    </tr>
  );
}
