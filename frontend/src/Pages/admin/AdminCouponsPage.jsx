import React, { useEffect, useState } from "react";
import { couponApi } from "../../api/coupon.api";

function toInputDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function AdminCouponsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [coupons, setCoupons] = useState([]);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percent");
  const [value, setValue] = useState("");
  const [minCartAmount, setMinCartAmount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [allowMultipleUse, setAllowMultipleUse] = useState(false);
  const [perUserLimit, setPerUserLimit] = useState("2");
  const [expiryDate, setExpiryDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await couponApi.list();
      setCoupons(res.data?.coupons || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setCode("");
    setDiscountType("percent");
    setValue("");
    setMinCartAmount("");
    setMaxDiscount("");
    setAllowMultipleUse(false);
    setPerUserLimit("2");
    setExpiryDate("");
    setIsActive(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const payload = {
        code,
        discountType,
        value: Number(value),
        minCartAmount: minCartAmount === "" ? 0 : Number(minCartAmount),
        perUserLimit: allowMultipleUse ? Math.max(2, Number(perUserLimit) || 2) : 1,
        expiryDate,
        isActive,
      };
      if (discountType === "percent" && maxDiscount !== "") {
        payload.maxDiscount = Number(maxDiscount);
      }

      const res = await couponApi.create(payload);
      const created = res.data?.coupon;
      setCoupons((prev) => (created ? [created, ...prev] : prev));
      resetForm();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (coupon) => {
    const ok = window.confirm(`Delete coupon: ${coupon.code}?`);
    if (!ok) return;
    try {
      await couponApi.remove(coupon._id);
      setCoupons((prev) => prev.filter((c) => c._id !== coupon._id));
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-extrabold text-gray-900">Coupons</h1>
        <p className="text-sm text-gray-600">Create and manage discount coupons.</p>

        {err ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Coupon Code (e.g. WELCOME20)"
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
          />

          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
          >
            <option value="percent">Percent</option>
            <option value="flat">Flat</option>
          </select>

          <input
            required
            type="number"
            min="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={discountType === "percent" ? "Discount % (e.g. 15)" : "Flat amount (e.g. 150)"}
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
          />

          <input
            type="number"
            min="0"
            value={minCartAmount}
            onChange={(e) => setMinCartAmount(e.target.value)}
            placeholder="Min cart amount (optional)"
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
          />

          <input
            type="number"
            min="0"
            value={maxDiscount}
            onChange={(e) => setMaxDiscount(e.target.value)}
            placeholder="Max discount (percent only)"
            disabled={discountType !== "percent"}
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400 disabled:bg-gray-100"
          />

          <input
            required
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400"
          />

          <label className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 px-3">
            <input
              type="checkbox"
              checked={allowMultipleUse}
              onChange={(e) => setAllowMultipleUse(e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Allow multiple uses per user</span>
          </label>

          <input
            type="number"
            min="2"
            value={perUserLimit}
            onChange={(e) => setPerUserLimit(e.target.value)}
            disabled={!allowMultipleUse}
            placeholder="Per-user limit (e.g. 3)"
            className="h-11 rounded-xl border border-gray-200 px-3 outline-none focus:border-gray-400 disabled:bg-gray-100"
          />

          <label className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 px-3">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className="text-sm font-medium text-gray-700">Active coupon</span>
          </label>

          <button
            disabled={saving}
            className="h-11 rounded-xl bg-black text-white font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create Coupon"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-xs uppercase text-gray-600">
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Min Cart</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Per User</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td className="px-4 py-5 text-sm text-gray-600" colSpan={8}>
                  Loading coupons...
                </td>
              </tr>
            ) : coupons.length === 0 ? (
              <tr>
                <td className="px-4 py-5 text-sm text-gray-600" colSpan={8}>
                  No coupons found.
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c._id} className="text-sm">
                  <td className="px-4 py-4 font-semibold text-gray-900">{c.code}</td>
                  <td className="px-4 py-4 text-gray-700">{c.discountType}</td>
                  <td className="px-4 py-4 text-gray-700">
                    {c.discountType === "percent" ? `${c.value}%` : `Rs ${c.value}`}
                  </td>
                  <td className="px-4 py-4 text-gray-700">Rs {c.minCartAmount || 0}</td>
                  <td className="px-4 py-4 text-gray-700">{toInputDate(c.expiryDate) || "-"}</td>
                  <td className="px-4 py-4 text-gray-700">
                    {Number(c?.perUserLimit ?? 1) === 0
                      ? "Unlimited"
                      : `${Number(c?.perUserLimit ?? 1)} time(s)`}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        c.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => onDelete(c)}
                      className="h-9 rounded-xl bg-red-600 px-3 text-sm font-semibold text-white hover:opacity-90"
                    >
                      Delete
                    </button>
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
