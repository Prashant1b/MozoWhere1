import React from "react";
import { Star } from "lucide-react";
import { inr, percentOff } from "../../utils/helpers";

function MiniProductCard({ p }) {
  const off = p.off ?? percentOff(p.mrp, p.price);
  return (
    <div className="shrink-0 w-[160px]">
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4]">
        {p.tag && (
          <div className="absolute left-2 top-2 bg-white/90 text-[10px] font-extrabold px-2 py-1 rounded-lg">
            {p.tag}
          </div>
        )}
        {typeof p.rating === "number" && (
          <div className="absolute left-2 bottom-2 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-extrabold">{p.rating.toFixed(1)}</span>
          </div>
        )}
        <img src={p.img} alt={p.title} className="h-full w-full object-cover" />
      </div>

      <div className="mt-2">
        <div className="text-xs font-extrabold text-gray-900">{p.brand}</div>
        <div className="text-xs text-gray-600 truncate">{p.title}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <div className="text-sm font-extrabold">{inr(p.price)}</div>
          {p.mrp ? <div className="text-xs text-gray-400 line-through">{inr(p.mrp)}</div> : null}
        </div>
        {off ? <div className="text-xs font-extrabold text-emerald-600">{off}% OFF</div> : null}

        <button className="mt-2 w-full rounded-xl border border-gray-200 bg-white py-2 text-xs font-extrabold">
          Add to bag
        </button>
      </div>
    </div>
  );
}

export default function MiniProductRail({ title, tag, items }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <div className="text-lg font-extrabold text-gray-900">{title}</div>
        {tag ? (
          <span className="text-[11px] font-extrabold px-2 py-1 rounded bg-orange-100 text-orange-700">
            {tag}
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {items.map((p) => (
          <MiniProductCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  );
}
