import React from "react";

export default function SizePicker({ sizes, selectedSize, setSelectedSize }) {
  return (
    <div id="sizes-section" className="mt-6 border-t border-gray-100 px-4 pt-5">
      <div className="flex items-center justify-between">
        <div className="text-lg font-extrabold text-gray-900">Select Size</div>
        <button className="text-sm font-bold text-blue-600">
          Size guide <span aria-hidden>›</span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {sizes.map((s) => {
          const disabled = !!s.disabled;
          const active = selectedSize === s.label;
          return (
            <button
              key={s.label}
              disabled={disabled}
              onClick={() => setSelectedSize(s.label)}
              className={[
                "h-11 min-w-[52px] px-4 rounded-xl border text-sm font-extrabold",
                disabled
                  ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed"
                  : active
                  ? "border-gray-900 text-gray-900 bg-white"
                  : "border-gray-200 text-gray-900 bg-white hover:border-gray-400",
              ].join(" ")}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Size not available?{" "}
        <button className="font-extrabold text-blue-600 inline-flex items-center gap-1">
          Notify me <span aria-hidden>🔔</span>
        </button>
      </div>
    </div>
  );
}
