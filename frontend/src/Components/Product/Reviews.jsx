import React from "react";
import { Star } from "lucide-react";

export default function Reviews({ rating, ratingCount, ratingBars, reviews }) {
  return (
    <div className="mt-6 border-t border-gray-100 px-4 pt-5">
      <div className="flex gap-2">
        <button className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-extrabold">
          Product Reviews
        </button>
        <button className="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-extrabold text-gray-500">
          Brand Reviews
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-4xl font-extrabold text-gray-900">{Number(rating).toFixed(1)}</div>
            <div className="mt-1 text-sm text-gray-500">{ratingCount} ratings</div>
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={[
                    "h-5 w-5",
                    i < Math.round(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          <button className="h-11 px-6 rounded-xl border border-blue-200 text-blue-600 font-extrabold">
            RATE
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {ratingBars.map((r) => (
            <div key={r.star} className="flex items-center gap-3 text-sm">
              <div className="w-4 text-gray-700 font-bold">{r.star}</div>
              <div className="flex-1 h-2 rounded bg-gray-200 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${r.pct}%` }} />
              </div>
              <div className="w-12 text-right text-gray-500">({r.count})</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <div className="text-lg font-extrabold text-gray-900">
          Hear what our customers say ({reviews.length})
        </div>

        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {["Most Helpful", "Most Recent", "Product Quality"].map((t, i) => (
            <button
              key={t}
              className={[
                "shrink-0 rounded-xl px-4 py-2 text-sm font-extrabold border",
                i === 0 ? "border-[#FFD23D] bg-[#FFF3BF]" : "border-gray-200 bg-white",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-4">
          {reviews.slice(0, 2).map((rv, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={[
                        "h-4 w-4",
                        i < rv.stars ? "fill-gray-900 text-gray-900" : "text-gray-300",
                      ].join(" ")}
                    />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-emerald-600">✓ Verified Buyer</span>
              </div>

              <div className="mt-2 text-sm text-gray-800">{rv.text}</div>
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <div>{rv.name}</div>
                <div>{rv.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
