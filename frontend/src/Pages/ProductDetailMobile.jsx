import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productApi } from "../api/product.api";
import { cartApi } from "../api/cart.api";
import { wishlistApi } from "../api/wishlist.api";
import SizePill from "../Components/Product/SizePill";
import HScrollRow from "../Components/Product/HScrollRow";
import MiniProductCard from "../Components/Product/MiniProductCard";

function getOffPercent(base, disc) {
  if (!disc || !base) return 0;
  const p = Math.round(((base - disc) / base) * 100);
  return Number.isFinite(p) ? p : 0;
}

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export default function ProductDetailMobile() {
  const { slug } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);

  const [imgIdx, setImgIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [adding, setAdding] = useState(false);

  const [wishLoading, setWishLoading] = useState(false);
  const [isWished, setIsWished] = useState(false);

  const [suggested, setSuggested] = useState([]);
  const [toast, setToast] = useState("");

  const showToast = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2000);
  };

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await productApi.detail(slug);
      const p = res.data?.product;
      const v = res.data?.variants || [];
      setProduct(p || null);
      setVariants(v);
      setImgIdx(0);
      setSelectedVariant(null);

      // wishlist status (if logged in)
      try {
        const wl = await wishlistApi.get();
        const ids = (wl.data?.wishlist?.products || []).map((x) => x._id?.toString?.() || x.toString?.());
        setIsWished(ids.includes(p?._id?.toString?.()));
      } catch {}

      // suggestions (simple): same gender
      if (p?.gender) {
        const sres = await productApi.list({ limit: 20, active: "true", gender: p.gender });
        setSuggested((sres.data?.products || []).filter((x) => x.slug !== slug).slice(0, 16));
      }
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  console.log("Variants:", variants);
}, [variants]);
  useEffect(() => { load(); }, [slug]);

  const images = product?.images?.length ? product.images : [];
  const price = product ? (product.discountPrice ?? product.basePrice) : 0;
  const off = getOffPercent(product?.basePrice, product?.discountPrice);

  const sizeItems = useMemo(() => {
    const map = new Map();
    for (const v of variants) {
      if (v.isActive === false) continue;
      const label = String(v.size || "").trim().toUpperCase();
      if (!label) continue;
      const prev = map.get(label);
      if (!prev || (v.stock ?? 0) > (prev.stock ?? 0)) map.set(label, v);
    }

    let arr = Array.from(map.entries()).map(([label, v]) => ({
      label,
      variant: v,
      inStock: (v.stock ?? 0) > 0,
    }));

    arr.sort((a, b) => {
      const ia = SIZE_ORDER.indexOf(a.label);
      const ib = SIZE_ORDER.indexOf(b.label);
      if (ia === -1 && ib === -1) return a.label.localeCompare(b.label);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    if (!arr.length) arr = SIZE_ORDER.map((s) => ({ label: s, variant: null, inStock: true }));
    return arr;
  }, [variants]);

  const onAddToBag = async () => {
    if (!selectedVariant) return showToast("Please select a size to continue");
    try {
      setAdding(true);
      await cartApi.add({ variantId: selectedVariant._id, quantity: 1 });
      showToast("Added to bag ✅");
    } catch (e) {
      showToast(e?.response?.data?.message || e.message || "Failed to add");
    } finally {
      setAdding(false);
    }
  };

  const onToggleWishlist = async () => {
    if (!product?._id) return;
    try {
      setWishLoading(true);
      await wishlistApi.toggle(product._id);
      setIsWished((x) => !x);
    } catch (e) {
      showToast(e?.response?.data?.message || e.message || "Wishlist failed");
    } finally {
      setWishLoading(false);
    }
  };

  if (loading) return <div className="p-4 text-sm text-gray-600">Loading...</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;
  if (!product) return null;

  return (
    <div className="mx-auto w-full max-w-md pb-24">
      {/* Top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between bg-white px-3 py-3">
        <button onClick={() => nav(-1)} className="text-xl">←</button>
        <div className="flex items-center gap-4 text-xl">
          <button title="share">⤴</button>
          <button onClick={onToggleWishlist} disabled={wishLoading} title="wishlist">
            {isWished ? "❤️" : "🤍"}
          </button>
          <button title="bag">👜</button>
        </div>
      </div>

      {/* Image */}
      <div className="relative bg-white">
        <div className="h-[360px] w-full bg-gray-50">
          {images.length ? (
            <img src={images[imgIdx]} alt={product.title} className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
          )}
        </div>

        {images.length > 1 ? (
          <div className="mt-3 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`h-2 w-2 rounded-full ${i === imgIdx ? "bg-black" : "bg-gray-300"}`}
              />
            ))}
          </div>
        ) : null}

        <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-2 text-sm font-semibold shadow">
          ⭐ 4.5 <span className="text-gray-500 font-normal">446</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 pt-4">
        <div className="text-sm font-semibold">Mozowhere®</div>
        <div className="text-base text-gray-600">{product.title}</div>

        <button
          onClick={onAddToBag}
          disabled={!selectedVariant || adding}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold
            ${selectedVariant ? "bg-[#f6d54a] text-black" : "bg-[#f6d54a]/60 text-gray-700"}
          `}
        >
          👜 {adding ? "ADDING..." : "ADD TO BAG"}
        </button>

        <div className="mt-4 flex items-center gap-3">
          <div className="text-3xl font-bold">₹{price}</div>
          {product.discountPrice ? (
            <>
              <div className="text-lg text-gray-400 line-through">₹{product.basePrice}</div>
              <div className="text-lg font-semibold text-emerald-600">{off}% OFF</div>
            </>
          ) : null}
          <div className="text-xs text-gray-500">Inclusive of all taxes</div>
        </div>

        {/* Sizes */}
        <div className="mt-8 flex items-end justify-between">
          <div className="text-lg font-semibold">Select Size</div>
          <button className="text-sm text-blue-600">Size guide ›</button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {sizeItems.map((s) => (
            <SizePill
              key={s.label}
              label={s.label}
              selected={selectedVariant?._id === s.variant?._id && !!s.variant}
              disabled={!s.inStock || !s.variant}
              onClick={() => s.variant && setSelectedVariant(s.variant)}
            />
          ))}
        </div>

        {!selectedVariant ? (
          <div className="mt-4 text-sm text-gray-500">Please select a size to continue</div>
        ) : null}

        {/* Recommendations */}
        {suggested.length ? (
          <div className="mt-10">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold">Frequently Bought Together</h3>
              <span className="rounded-md bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">NEW</span>
            </div>
            <div className="mt-4">
              <HScrollRow>
                {suggested.slice(0, 8).map((p) => <MiniProductCard key={p._id} p={p} />)}
              </HScrollRow>
            </div>
          </div>
        ) : null}

        {suggested.length ? (
          <div className="mt-10">
            <h3 className="text-lg font-bold">You May Also Like</h3>
            <div className="mt-4">
              <HScrollRow>
                {suggested.slice(8, 16).map((p) => <MiniProductCard key={p._id} p={p} />)}
              </HScrollRow>
            </div>
          </div>
        ) : null}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-md bg-white p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        <button
          onClick={onAddToBag}
          disabled={!selectedVariant || adding}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-semibold
            ${selectedVariant ? "bg-[#e9e9e9] text-black" : "bg-[#e9e9e9] text-gray-500"}
          `}
        >
          👜 {adding ? "ADDING..." : `ADD TO BAG ₹${price}`}
        </button>
      </div>

      {toast ? (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black px-4 py-2 text-sm text-white">
          {toast}
        </div>
      ) : null}
    </div>
  );
}