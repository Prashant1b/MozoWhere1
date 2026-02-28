import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { productApi } from "../../api/product.api";
import { cartApi } from "../../api/cart.api";
import { wishlistApi } from "../../api/wishlist.api";

function getOffPercent(base, disc) {
  if (!disc || !base) return 0;
  const p = Math.round(((base - disc) / base) * 100);
  return Number.isFinite(p) ? p : 0;
}

export default function ProductCard({ p, isWished = false, onToggleWishlist }) {
  const nav = useNavigate();
  const [adding, setAdding] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const img = p?.images?.[0];
  const price = Number(p?.discountPrice ?? p?.basePrice ?? 0);
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
      if (v?._id) {
        await cartApi.add({ variantId: v._id, quantity: 1 });
      } else if (p?._id) {
        // fallback for accessories / one-size items
        await cartApi.addProduct({ productId: p._id, quantity: 1 });
      } else {
        setMsg("This product has no active in-stock variant");
        return;
      }
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

  const quickWish = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setWishBusy(true);
      await wishlistApi.toggle(p._id);
      onToggleWishlist?.(p._id, !isWished);
      setMsg(isWished ? "Removed from wishlist" : "Added to wishlist");
      setTimeout(() => setMsg(""), 1400);
    } catch (err) {
      if (err?.response?.status === 401) {
        nav("/login", { state: { from: "/shop" } });
        return;
      }
      setMsg(err?.response?.data?.message || "Wishlist failed");
    } finally {
      setWishBusy(false);
    }
  };

  return (
    <Link
      to={`/product/${p.slug}`}
      className="group relative w-[82vw] max-w-[292px] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(2,6,23,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(2,6,23,0.12)] sm:w-[286px] lg:w-[300px]"
    >
      <button
        onClick={quickWish}
        disabled={wishBusy}
        className={[
          "absolute right-2 top-2 z-20 rounded-full border p-2 shadow-sm",
          isWished ? "border-red-200 bg-red-50 text-red-700" : "border-gray-200 bg-white text-gray-700",
        ].join(" ")}
        aria-label="Toggle wishlist"
      >
        <Heart className="h-4 w-4" fill={isWished ? "currentColor" : "none"} />
      </button>

      <div className="h-[290px] bg-white p-2 sm:h-[330px]">
        {img ? (
          <img
            src={img}
            alt={p.title}
            className="h-full w-full rounded-xl object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
        )}
      </div>

      <div className="border-t border-slate-200 px-4 py-3">
        <div className="line-clamp-1 text-[15px] font-semibold text-slate-900">{p.title}</div>
        <div className="mt-2 flex items-center gap-2">
          <div className="text-lg font-black text-slate-900">Rs {price}</div>
          {p.discountPrice ? (
            <>
              <div className="text-sm text-gray-400 line-through">Rs {Number(p.basePrice || 0)}</div>
              <div className="text-sm font-semibold text-emerald-600">{off}% OFF</div>
            </>
          ) : null}
        </div>

        <button
          onClick={quickAdd}
          disabled={adding}
          className="mt-3 h-10 w-full rounded-xl bg-slate-900 text-xs font-bold tracking-wide text-white transition hover:bg-black disabled:opacity-60"
        >
          {adding ? "ADDING..." : "ADD TO CART"}
        </button>

        {msg ? <div className="mt-2 text-[11px] text-slate-600">{msg}</div> : null}
      </div>
    </Link>
  );
}
