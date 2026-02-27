import React, { useEffect, useMemo, useState } from "react";
import { productApi } from "../api/product.api";
import ProductSection from "../Components/shop/ProductSection";

function groupByCategory(products = []) {
  const map = new Map();
  for (const p of products) {
    const name = p?.category?.name || "Other";
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(p);
  }
  return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
}

export default function ShopNowSections() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [products, setProducts] = useState([]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await productApi.list({ limit: 300, sort: "-createdAt", active: "true" });
      setProducts(res.data?.products || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const sections = useMemo(() => {
    const grouped = groupByCategory(products);
    const order = ["Tshirts", "Hoodie", "Caps", "Accessories"];
    grouped.sort((a, b) => {
      const ia = order.indexOf(a.name);
      const ib = order.indexOf(b.name);
      if (ia === -1 && ib === -1) return a.name.localeCompare(b.name);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return grouped.filter((s) => s.items?.length);
  }, [products]);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div className="rounded-2xl bg-[#0b1220] py-12 text-center">
          <div className="text-4xl font-semibold tracking-[0.35em] text-white">SHOP NOW</div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12">
        {loading ? (
          <div className="py-10 text-sm text-gray-500">Loading...</div>
        ) : err ? (
          <div className="py-10">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{err}</div>
          </div>
        ) : (
          sections.map((sec) => <ProductSection key={sec.name} title={sec.name} items={sec.items} />)
        )}
      </div>
    </div>
  );
}