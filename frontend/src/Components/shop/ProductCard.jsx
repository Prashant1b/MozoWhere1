import React from "react";
import { Link } from "react-router-dom";

function getOffPercent(base, disc) {
  if (!disc || !base) return 0;
  const p = Math.round(((base - disc) / base) * 100);
  return Number.isFinite(p) ? p : 0;
}

export default function ProductCard({ p }) {
  const img = p?.images?.[0];
  const price = p?.discountPrice ?? p?.basePrice;
  const off = getOffPercent(p?.basePrice, p?.discountPrice);

  return (
    <Link to={`/product/${p.slug}`} className="relative w-[320px] shrink-0 overflow-hidden rounded-md border bg-white">
      <div className="absolute left-0 top-0 z-10 bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
        BUY 2 FOR {price * 2}
      </div>

      <div className="h-[360px] bg-white">
        {img ? (
          <img src={img} alt={p.title} className="h-full w-full object-contain" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
        )}
      </div>

      <div className="border-t px-4 py-3">
        <div className="line-clamp-1 text-sm font-medium">{p.title}</div>
        <div className="mt-2 flex items-center gap-3">
          <div className="text-lg font-bold">₹{price}</div>
          {p.discountPrice ? (
            <>
              <div className="text-sm text-gray-400 line-through">₹{p.basePrice}</div>
              <div className="text-sm font-semibold text-emerald-600">{off}% OFF</div>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}