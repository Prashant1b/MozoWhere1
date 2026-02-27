import React, { useRef } from "react";
import ProductCard from "./ProductCard";

export default function ProductSection({ title, items = [] }) {
  const rowRef = useRef(null);

  const scrollBy = (dx) => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dx, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="mt-12 overflow-x-hidden">
      <div className="rounded-md bg-[#f2e6e6] py-4 text-center">
        <div className="text-lg tracking-[0.18em] text-gray-900 sm:text-xl sm:tracking-[0.35em]">
          {title}
        </div>
      </div>

      <div className="relative mt-6">
        <button
          onClick={() => scrollBy(-900)}
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-2xl shadow hover:bg-white md:block"
        >
          {"<"}
        </button>

        <div ref={rowRef} className="hide-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-2 pb-2 sm:gap-6 sm:px-10">
          {items.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>

        <button
          onClick={() => scrollBy(900)}
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-2xl shadow hover:bg-white md:block"
        >
          {">"}
        </button>
      </div>
    </section>
  );
}
