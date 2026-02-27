import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartApi } from "../api/cart.api";
import { couponApi } from "../api/coupon.api";

const COLOR_HEX_MAP = {
  white: "#FFFFFF",
  black: "#111827",
  navy: "#1e3a8a",
  blue: "#2563eb",
  sky: "#7dd3fc",
  lavender: "#c4b5fd",
  mint: "#6ee7b7",
  sand: "#d6b48a",
  red: "#ef4444",
  yellow: "#facc15",
  green: "#22c55e",
  gray: "#9ca3af",
  grey: "#9ca3af",
  maroon: "#7f1d1d",
  beige: "#d6d3c8",
  orange: "#f97316",
  pink: "#ec4899",
  purple: "#8b5cf6",
  brown: "#92400e",
};

function colorToHex(name) {
  const key = String(name || "").trim().toLowerCase();
  return COLOR_HEX_MAP[key] || "#e5e7eb";
}

function itemTitle(it) {
  if (it?.type === "custom") {
    return it?.customDesign?.template?.title || "Customized Product";
  }
  return it?.variant?.product?.title || "Product";
}

function itemImage(it) {
  if (it?.type === "custom") {
    return it?.customDesign?.template?.mockups?.front || it?.customDesign?.template?.mockups?.back || "";
  }
  return it?.variant?.product?.images?.[0] || "";
}

function itemMeta(it) {
  if (it?.type === "custom") {
    const d = it?.customDesign;
    return [d?.selected?.color, d?.selected?.size, d?.selected?.fabric?.name].filter(Boolean).join(" | ");
  }
  const v = it?.variant;
  return [v?.size, v?.color].filter(Boolean).join(" | ");
}

function CustomCartPreview({ design }) {
  const countBySide = (s) => (design?.layers || []).filter((l) => l?.side === s).length;
  const side = countBySide("front") >= countBySide("back") ? "front" : "back";
  const image = design?.template?.mockups?.[side] || design?.template?.mockups?.back || "";
  const layers = (design?.layers || []).filter((l) => l?.side === side);
  const tint = colorToHex(design?.selected?.color);
  const printW = 280;
  const printH = 330;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md bg-gray-100">
      {image ? (
        <img src={image} alt="Custom preview" className="absolute inset-0 h-full w-full object-contain p-1" />
      ) : null}
      <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" style={{ backgroundColor: tint }} />

      <div
        className="absolute left-1/2 top-[18%] -translate-x-1/2 overflow-hidden rounded-[2px]"
        style={{ width: "84%", maxWidth: printW, aspectRatio: "280 / 330" }}
      >
        <div className="relative h-full w-full border border-dashed border-black/20">
          {layers.map((it, idx) => {
            const left = ((Number(it?.x || 0) / printW) * 100).toFixed(2);
            const top = ((Number(it?.y || 0) / printH) * 100).toFixed(2);
            const width = ((Number(it?.w || 0) / printW) * 100).toFixed(2);
            const height = ((Number(it?.h || 0) / printH) * 100).toFixed(2);
            return (
              <div
                key={idx}
                className="absolute"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                  transform: `rotate(${Number(it?.rotate || 0)}deg)`,
                  transformOrigin: "center",
                }}
              >
                {it?.kind === "image" ? (
                  <img src={it?.imageUrl} alt="Layer" className="h-full w-full object-contain" />
                ) : (
                  <div
                    className="line-clamp-2 w-full font-semibold text-black"
                    style={{ fontSize: `${Math.max(9, Math.round(Number(it?.fontSize || 32) * 0.22))}px`, lineHeight: 1.05 }}
                  >
                    {it?.text || ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [busy, setBusy] = useState(false);

  const [code, setCode] = useState("");
  const [couponResult, setCouponResult] = useState(null);
  const [couponMsg, setCouponMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await cartApi.getMyCart();
      setCart(res.data?.cart || { items: [], totalAmount: 0 });
    } catch (e) {
      if (e?.response?.status === 401) {
        nav("/login", { state: { from: "/cart" } });
        return;
      }
      setErr(e?.response?.data?.message || e?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const subtotal = useMemo(() => Number(cart?.totalAmount || 0), [cart]);
  const payable = couponResult?.payable ?? subtotal;

  const applyCoupon = async () => {
    if (!code.trim()) {
      setCouponMsg("Enter coupon code");
      return;
    }
    setCouponMsg("");
    try {
      const res = await couponApi.apply(code.trim());
      setCouponResult(res.data || null);
      setCouponMsg(`Coupon applied: ${res.data?.coupon}`);
    } catch (e) {
      setCouponResult(null);
      setCouponMsg(e?.response?.data?.message || e?.message || "Coupon apply failed");
    }
  };

  const updateQty = async (it, qty) => {
    if (it?.type !== "product" || !it?.variant?._id) return;
    try {
      setBusy(true);
      const res = await cartApi.updateQty({ variantId: it.variant._id, quantity: qty });
      setCart(res.data?.cart || cart);
      setCouponResult(null);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update qty");
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (it) => {
    if (it?.type !== "product" || !it?.variant?._id) {
      alert("Remove for customized item is not available yet. Use Clear Cart.");
      return;
    }
    try {
      setBusy(true);
      const res = await cartApi.removeItem(it.variant._id);
      setCart(res.data?.cart || cart);
      setCouponResult(null);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to remove item");
    } finally {
      setBusy(false);
    }
  };

  const clearCart = async () => {
    try {
      setBusy(true);
      const res = await cartApi.clear();
      setCart(res.data?.cart || { items: [], totalAmount: 0 });
      setCouponResult(null);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to clear cart");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-600">Loading cart...</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">My Cart</h1>
        <button onClick={clearCart} disabled={busy} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60">
          Clear Cart
        </button>
      </div>

      {err && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      {!cart?.items?.length ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
          Cart is empty. <Link to="/shop" className="font-semibold underline">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {cart.items.map((it) => (
              <div key={it._id} className="flex gap-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className={`${it.type === "custom" ? "h-32 w-32" : "h-24 w-24"} shrink-0 overflow-hidden rounded-md bg-gray-100`}>
                  {it.type === "custom" ? (
                    <CustomCartPreview design={it?.customDesign} />
                  ) : itemImage(it) ? (
                    <img src={itemImage(it)} alt={itemTitle(it)} className="h-full w-full object-cover" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-gray-900">{itemTitle(it)}</div>
                  <div className="mt-1 text-xs text-gray-500">{itemMeta(it) || "-"}</div>
                  {it.type === "custom" ? (
                    <div className="mt-1 text-xs text-emerald-700">
                      Design layers: {it?.customDesign?.layers?.length || 0}
                    </div>
                  ) : null}
                  <div className="mt-2 text-sm font-bold">Rs {it.priceAtAdd} x {it.quantity}</div>

                  <div className="mt-3 flex items-center gap-2">
                    {it.type === "product" ? (
                      <>
                        <button onClick={() => updateQty(it, Math.max(1, it.quantity - 1))} className="h-8 w-8 rounded border border-gray-200">-</button>
                        <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                        <button onClick={() => updateQty(it, it.quantity + 1)} className="h-8 w-8 rounded border border-gray-200">+</button>
                      </>
                    ) : (
                      <span className="text-xs text-emerald-700">Customized item</span>
                    )}

                    <button onClick={() => removeItem(it)} className="ml-auto rounded border border-gray-200 px-2 py-1 text-xs font-semibold hover:bg-gray-50">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs {subtotal}</span></div>
              {couponResult ? <div className="flex justify-between text-emerald-700"><span>Discount ({couponResult.coupon})</span><span>- Rs {couponResult.discount}</span></div> : null}
              <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Payable</span><span>Rs {payable}</span></div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-semibold text-gray-700">Coupon Code</label>
              <div className="mt-2 flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter code"
                  className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
                />
                <button onClick={applyCoupon} className="h-10 rounded-lg bg-black px-4 text-sm font-semibold text-white">Apply</button>
              </div>
              {couponMsg ? <div className="mt-2 text-xs text-gray-600">{couponMsg}</div> : null}
            </div>

            <button
              onClick={() => nav("/checkout", { state: { subtotal, payable } })}
              className="mt-5 h-11 w-full rounded-lg bg-[#3BA3A3] text-sm font-bold text-white hover:opacity-95"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
