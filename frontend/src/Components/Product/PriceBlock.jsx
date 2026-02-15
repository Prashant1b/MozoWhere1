import React from "react";
import { ShoppingBag } from "lucide-react";
import { inr } from "../../utils/helpers";

export default function PriceBlock({
  brand,
  title,
  price,
  mrp,
  off,
  lowAs,
  boughtRecently,
  fabricTag,
  onAddToBagTop,
}) {
  return (
    <div className="px-4">
      <div className="mt-1 text-sm font-bold text-gray-900">{brand}</div>
      <div className="mt-1 text-[15px] text-gray-600">{title}</div>

      <button
        className="mt-4 w-full rounded-xl bg-[#FFD23D] py-3 font-extrabold text-gray-900 flex items-center justify-center gap-2"
        onClick={onAddToBagTop}
      >
        <ShoppingBag className="h-5 w-5" />
        ADD TO BAG
      </button>

      <div className="mt-4 flex items-baseline gap-2 flex-wrap">
        <div className="text-2xl font-extrabold text-gray-900">{inr(price)}</div>
        {mrp ? <div className="text-sm text-gray-400 line-through">{inr(mrp)}</div> : null}
        {off ? <div className="text-sm font-extrabold text-emerald-600">{off}% OFF</div> : null}
        <div className="text-xs text-gray-500">Inclusive of all taxes</div>
      </div>

      {lowAs ? (
        <div className="mt-3 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-purple-700 font-bold">
          Get it for as low as <span className="text-purple-800">{inr(lowAs)}</span>
          <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-purple-300 text-xs font-black">
            i
          </span>
        </div>
      ) : null}

      {boughtRecently ? (
        <div className="mt-3 rounded-xl bg-sky-100 px-3 py-2 text-sky-900 font-semibold text-sm">
          {boughtRecently} people bought this in the last 7 days
        </div>
      ) : null}

      {fabricTag ? (
        <div className="mt-3 inline-flex rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 font-semibold">
          {fabricTag}
        </div>
      ) : null}
    </div>
  );
}
