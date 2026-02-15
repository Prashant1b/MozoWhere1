// src/pages/CustomizeListingPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FILTERS, PRODUCTS, SORT_OPTIONS } from "../data/catalog";
import ListingHeader from "../Components/customizerlisting/ListingHeader";
import FilterSidebar from "../Components/customizerlisting/FilterSidebar";
import SortDropdown from "../Components/customizerlisting/SortDropdown";
import BulkBanner from "../Components/customizerlisting/BulkBanner";
import ProductGrid from "../Components/customizerlisting/ProductGrid";

function ratingPass(productRating, rule) {
  if (rule.startsWith("4")) return productRating >= 4;
  if (rule.startsWith("3")) return productRating >= 3;
  if (rule.startsWith("2")) return productRating >= 2;
  return true;
}

export default function CustomizeListingPage() {
  const navigate = useNavigate();
  const [sort, setSort] = useState("popularity");

  const [selected, setSelected] = useState(() => ({
    gender: new Set(),
    category: new Set(),
    sizes: new Set(),
    fit: new Set(),
    sleeve: new Set(),
    type: new Set(),
    ratings: new Set(),
  }));

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const s = selected;

    const out = PRODUCTS.filter((p) => {
      const passSet = (setLike, valueOrChecker) => {
        if (!setLike || setLike.size === 0) return true;
        if (typeof valueOrChecker === "function") {
          for (const v of setLike) if (valueOrChecker(v)) return true;
          return false;
        }
        return setLike.has(valueOrChecker);
      };

      const genderOk = passSet(s.gender, p.gender);
      const categoryOk = passSet(s.category, p.category);
      const typeOk = passSet(s.type, p.type);
      const fitOk = passSet(s.fit, p.fit);
      const sleeveOk = passSet(s.sleeve, p.sleeve);

      const sizeOk = s.sizes.size === 0 || p.sizes.some((size) => s.sizes.has(size));

      const ratingsOk =
        s.ratings.size === 0 || [...s.ratings].some((rule) => ratingPass(p.rating, rule));

      return genderOk && categoryOk && typeOk && fitOk && sleeveOk && sizeOk && ratingsOk;
    });

    const sorted = [...out];
    sorted.sort((a, b) => {
      if (sort === "popularity") return b.popularity - a.popularity;
      if (sort === "priceLow") return a.price - b.price;
      if (sort === "priceHigh") return b.price - a.price;
      if (sort === "discountHigh") {
        const da = (a.mrp - a.price) / a.mrp;
        const db = (b.mrp - b.price) / b.mrp;
        return db - da;
      }
      return 0;
    });

    return sorted;
  }, [selected, sort]);

  function clearAll() {
    setSelected({
      gender: new Set(),
      category: new Set(),
      sizes: new Set(),
      fit: new Set(),
      sleeve: new Set(),
      type: new Set(),
      ratings: new Set(),
    });
  }

  // ✅ IMPORTANT: map product.type -> "tshirt" | "cap"
  function toCustomizerProduct(type) {
    // Adjust mapping if your catalog uses different strings
    // Example: "Caps" / "Hat" etc.
    if (!type) return "tshirt";
    const t = String(type).toLowerCase();
    if (t === "cap" || t === "caps" || t === "hat") return "cap";
    return "tshirt";
  }

  function handleProductClick(product) {
    const productKey = toCustomizerProduct(product.type);

    // ✅ Send selected product to CustomizerPage
    navigate("/customizer", {
      state: { product: productKey, productId: product.id },
    });
  }

  return (
    <div className="bg-white">
      <div className="bg-sky-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-2 text-center text-sm font-bold">
          🚚 FREE SHIPPING on all orders above ₹399
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          <aside className="hidden lg:block">
            <FilterSidebar
              filtersConfig={FILTERS}
              selected={selected}
              setSelected={setSelected}
              onClear={clearAll}
            />
          </aside>

          <main>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <ListingHeader total={filtered.length} onOpenFilters={() => setMobileFiltersOpen(true)} />
                <SortDropdown sort={sort} setSort={setSort} options={SORT_OPTIONS} />
              </div>

              <BulkBanner />

              {/* ✅ Pass click handler */}
              <ProductGrid products={filtered} onProductClick={handleProductClick} />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <div
        className={[
          "fixed inset-0 z-40 lg:hidden transition",
          mobileFiltersOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        <div
          className={[
            "absolute inset-0 bg-black/40 transition-opacity",
            mobileFiltersOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setMobileFiltersOpen(false)}
        />

        <div
          className={[
            "absolute left-0 top-0 h-full w-[92%] max-w-[360px] bg-white p-4 shadow-2xl transition-transform",
            mobileFiltersOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between">
            <div className="text-lg font-extrabold">Filters</div>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-bold"
            >
              Close
            </button>
          </div>

          <div className="mt-4">
            <FilterSidebar
              filtersConfig={FILTERS}
              selected={selected}
              setSelected={setSelected}
              onClear={clearAll}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
