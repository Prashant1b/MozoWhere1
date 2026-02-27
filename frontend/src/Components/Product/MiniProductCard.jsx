import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cartApi } from "../../api/cart.api";
import { productApi } from "../../api/product.api";

function getOffPercent(base, disc) {
  if (!disc || !base) return 0;
  const p = Math.round(((base - disc) / base) * 100);
  return Number.isFinite(p) ? p : 0;
}

async function addFirstVariantToBag(slug) {
  const res = await productApi.detail(slug);
  const variants = res.data?.variants || [];
  const first = variants.find((v) => v.isActive !== false && (v.stock ?? 0) > 0);
  if (!first) throw new Error("No size available");
  await cartApi.add({ variantId: first._id, quantity: 1 });
}

export default function MiniProductCard({ p }) {
  const [adding, setAdding] = useState(false);
  const price = p?.discountPrice ?? p?.basePrice;
  const off = getOffPercent(p?.basePrice, p?.discountPrice);
  const img = p?.images?.[0];

  const onAdd = async (e) => {
    e.preventDefault();
    try {
      setAdding(true);
      await addFirstVariantToBag(p.slug);
      alert("Added to bag ✅");
    } catch (err) {
      alert(err?.response?.data?.message || err.message || "Failed");
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/product/${p.slug}`} className="w-[230px] shrink-0">
      <div className="relative overflow-hidden rounded-2xl border bg-white">
        <div className="h-[220px] bg-white">
          {img ? (
            <img src={img} alt={p.title} className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
          )}
        </div>

        <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow">
          ⭐ 4.5
        </div>

        <div className="px-3 pb-3 pt-2">
          <div className="text-xs font-semibold">Mozowhere®</div>
          <div className="line-clamp-1 text-sm text-gray-700">{p.title}</div>

          <div className="mt-2 flex items-center gap-2">
            <div className="font-bold">₹{price}</div>
            {p.discountPrice ? (
              <>
                <div className="text-xs text-gray-400 line-through">₹{p.basePrice}</div>
                <div className="text-xs font-semibold text-emerald-600">{off}% OFF</div>
              </>
            ) : null}
          </div>

          <button
            onClick={onAdd}
            disabled={adding}
            className="mt-3 w-full rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-50 disabled:opacity-60"
          >
            {adding ? "Adding..." : "Add to bag"}
          </button>
        </div>
      </div>
    </Link>
  );
}