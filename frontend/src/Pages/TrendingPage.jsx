import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categoryApi } from "../api/category.api";

function CategoryCard({ title, slug, image }) {
  return (
    <Link
      to={`/shop?category=${encodeURIComponent(slug)}`}
      className="group relative min-h-[240px] overflow-hidden rounded-3xl bg-slate-200 shadow-[0_12px_28px_rgba(2,6,23,0.08)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(2,6,23,0.14)]"
      aria-label={title}
    >
      {image ? (
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 px-6 text-center text-2xl font-black text-slate-700">
          {title}
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/80">Trending</p>
          <h3 className="mt-1 text-2xl font-black text-white">{title}</h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900">
          View <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function TrendingCategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await categoryApi.list({ trending: true });
        if (!mounted) return;
        setCategories(res.data?.categories || []);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.response?.data?.message || e?.message || "Failed to load categories");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const visible = useMemo(
    () => categories.filter((c) => c?.name && c?.slug),
    [categories]
  );

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">Trending Categories</h2>
            <p className="mt-1 text-sm text-slate-600">Most loved categories selected by your shoppers.</p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Explore all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[240px] animate-pulse rounded-3xl bg-slate-100" />
            ))}
          </div>
        ) : err ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{err}</div>
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            No trending categories available. Add categories from admin with image and Trending enabled.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((c) => (
              <CategoryCard key={c._id || c.slug} title={c.name} slug={c.slug} image={c.image} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}