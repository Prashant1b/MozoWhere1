import React from "react";
import { Copy } from "lucide-react";

export default function OffersRail({ offers }) {
  return (
    <div className="mt-6 border-t border-gray-100 px-4 pt-5">
      <div className="text-lg font-extrabold text-gray-900">Save extra with these offers</div>

      <div className="mt-3 overflow-x-auto flex gap-3 pb-2">
        {offers.map((o) => (
          <div
            key={o.code}
            className="min-w-[280px] rounded-2xl border border-purple-200 bg-white p-3 shadow-sm"
          >
            <div className="text-sm font-bold text-gray-900">{o.title}</div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs font-extrabold text-gray-700">{o.code}</div>
              <button
                onClick={() => navigator.clipboard?.writeText(o.code)}
                className="text-sm font-extrabold text-emerald-600 inline-flex items-center gap-1"
              >
                Copy code <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
