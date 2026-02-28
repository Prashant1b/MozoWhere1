import React, { useEffect, useMemo, useState } from "react";
import { productApi } from "../api/product.api";
import ProductSection from "./shop/ProductSection";

function groupByCategory(products = []) {
  const map = new Map();
  for (const p of products) {
    const name = p?.category?.name || "Other";
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(p);
  }
  return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
}

function toApiGender(value) {
  const v = String(value || "").trim().toLowerCase();
  if (v === "men" || v === "male") return "Male";
  if (v === "women" || v === "female") return "Female";
  return "";
}

export default function HomeProductShowcase({ selectedGender }) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [products, setProducts] = useState([]);

  const apiGender = useMemo(() => toApiGender(selectedGender), [selectedGender]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await productApi.list({
        limit: 300,
        sort: "-createdAt",
        active: "true",
        ...(apiGender ? { gender: apiGender } : {}),
      });
      setProducts(res.data?.products || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [apiGender]);

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
    <section className="w-full overflow-x-hidden bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 md:pt-10">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">Shop By Category</h2>
            <p className="mt-1 text-sm text-slate-600">
              Premium picks curated for your selected collection.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-sm text-slate-500">Loading products...</div>
        ) : err ? (
          <div className="py-10">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{err}</div>
          </div>
        ) : (
          sections.map((sec) => (
            <ProductSection key={sec.name} title={sec.name} items={sec.items} />
          ))
        )}
      </div>
    </section>
  );
}
