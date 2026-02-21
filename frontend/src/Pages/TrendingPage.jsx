import React from "react";
import { Link } from "react-router-dom";
import CATEGORIES from "../data/TrendingCategory";
function CategoryCard({ title, slug, image }) {
  return (
    <Link
      to={`/category/${slug}`}
      className="
        group relative shrink-0 overflow-hidden bg-neutral-200 outline-none
        h-[210px] w-[260px]
        sm:h-[240px] sm:w-[300px]
        lg:h-[260px] lg:w-[340px]
      "
      aria-label={title}
    >
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      <div className="absolute bottom-3 left-4">
        <div className="text-[22px] sm:text-[26px] font-semibold text-white drop-shadow">
          {title}
        </div>
      </div>

      <div className="absolute inset-0 ring-0 ring-white/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-white/25" />
    </Link>
  );
}

export default function TrendingCategoriesPage() {
  return (
    <div className="w-full bg-white">
      {/* Heading */}
      <div className="mx-auto max-w-7xl px-4 pt-10">
        <h2 className="text-center text-[28px] font-medium tracking-[0.18em] text-black">
          Trending Categories
        </h2>
      </div>

      {/* Slider Row */}
      <div className="mx-auto mt-8 max-w-[1400px] px-2">
        <div
          className="
            flex gap-0 overflow-x-auto scroll-smooth
            [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.25)_transparent]
          "
          style={{
            scrollbarGutter: "stable",
          }}
        >
         <div className="mx-auto mt-6 w-full px-0">
  <div className="flex overflow-x-auto scroll-smooth">
    <div className="flex">
      {CATEGORIES.map((c) => (
        <CategoryCard key={c.slug} {...c} />
      ))}
    </div>
  </div>
</div>
</div>

        {/* Optional small hint on mobile */}
        <div className="mt-3 text-center text-xs text-neutral-500 sm:hidden">
          Swipe to see more →
        </div>
      </div>

      {/* Optional next section spacing (like screenshot showing next row below) */}
      <div className="h-10" />
    </div>
  );
}