import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productApi } from "../../api/product.api";
import { cartApi } from "../../api/cart.api";

function getOffPercent(base, disc) {
  if (!disc || !base) return 0;
  const p = Math.round(((base - disc) / base) * 100);
  return Number.isFinite(p) ? p : 0;
}

export default function ProductCard({ p }) {
  const nav = useNavigate();
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState("");

  const img = p?.images?.[0];
  const price = p?.discountPrice ?? p?.basePrice;
  const off = getOffPercent(p?.basePrice, p?.discountPrice);

  const quickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setAdding(true);
      setMsg("");
      const res = await productApi.detail(p.slug);
      const variants = res.data?.variants || [];
      const v = variants.find((x) => x?.isActive !== false && Number(x?.stock || 0) > 0);
      if (!v?._id) {
        setMsg("This product has no active in-stock variant");
        return;
      }

      await cartApi.add({ variantId: v._id, quantity: 1 });
      setMsg("Added to cart");
      setTimeout(() => setMsg(""), 1500);
    } catch (err) {
      if (err?.response?.status === 401) {
        nav("/login", { state: { from: "/shop" } });
        return;
      }
      setMsg(err?.response?.data?.message || "Add failed");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link
      to={`/product/${p.slug}`}
      className="relative w-[78vw] max-w-[320px] shrink-0 overflow-hidden rounded-md border bg-white sm:w-[320px]"
    >
      <div className="absolute left-0 top-0 z-10 bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
        BUY 2 FOR {price * 2}
      </div>

      <div className="h-[300px] bg-white sm:h-[360px]">
        {img ? (
          <img src={img} alt={p.title} className="h-full w-full object-contain" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
        )}
      </div>

      <div className="border-t px-4 py-3">
        <div className="line-clamp-1 text-sm font-medium">{p.title}</div>
        <div className="mt-2 flex items-center gap-3">
          <div className="text-lg font-bold">Rs {price}</div>
          {p.discountPrice ? (
            <>
              <div className="text-sm text-gray-400 line-through">Rs {p.basePrice}</div>
              <div className="text-sm font-semibold text-emerald-600">{off}% OFF</div>
            </>
          ) : null}
        </div>

        <button
          onClick={quickAdd}
          disabled={adding}
          className="mt-3 h-9 w-full rounded-lg bg-black text-xs font-bold text-white hover:opacity-90 disabled:opacity-60"
        >
          {adding ? "ADDING..." : "ADD TO CART"}
        </button>

        {msg ? <div className="mt-2 text-[11px] text-gray-600">{msg}</div> : null}
      </div>
    </Link>
  );
}
