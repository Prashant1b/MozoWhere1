import React, { useMemo } from "react";

export default function PickColorSize({
  colors,
  sizes,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  onNext,
}) {
  const canNext = useMemo(() => {
    return Boolean(selectedColor) && Boolean(selectedSize?.id);
  }, [selectedColor, selectedSize]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10">
        {/* Select Color */}
        <div>
          <h3 className="text-lg font-bold text-gray-900">Select Color</h3>

      <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
  {colors.map((c) => {
    const active = selectedColor?.id === c.id;

    return (
      <button
        key={c.id}
        type="button"
        onClick={() => setSelectedColor(c)}
        className={[
          "relative rounded-2xl",
          // ✅ size control
          "h-[92px] w-full sm:h-[88px] lg:h-[72px] lg:w-[72px]", // desktop fixed
          "ring-1 ring-black/10 shadow-sm transition",
          "focus:outline-none focus:ring-2 focus:ring-teal-500/70",
          active ? "ring-2 ring-[#FFD23D]" : "",
        ].join(" ")}
        style={{ backgroundColor: c.hex }}
      >
        {active && (
          <span className="absolute right-2 top-2 h-7 w-7 rounded-full bg-white grid place-items-center shadow">
            ✓
          </span>
        )}
      </button>
    );
  })}
</div>

        </div>

        {/* Select Size */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Select Size</h3>
            <button className="text-sm font-semibold text-sky-700 hover:underline">
              Size Guide
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-4">
            {sizes.map((s) => {
              const disabled = s.stock === 0;
              const active = selectedSize?.id === s.id;
              return (
                <button
                  key={s.id}
                  disabled={disabled}
                  onClick={() => {
                    if (disabled) return;
                    // ✅ click again => unselect
                    setSelectedSize((prev) =>
                      prev?.id === s.id ? null : s
                    );
                  }}
                  className={[
                    "w-14 rounded-lg border px-3 py-2 text-sm font-bold",
                    disabled
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : active
                      ? "border-red-500 text-gray-900 bg-red-50"
                      : "border-red-400 text-gray-900 hover:bg-red-50",
                  ].join(" ")}
                >
                  {s.id}
                  <div className="mt-2 text-[12px] font-semibold text-red-500">
                    {disabled ? "" : `${s.stock} left`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next */}
        <div className="pt-6">
          <button
            onClick={onNext}
            disabled={!canNext}
            className={[
              "w-full py-6 text-lg font-bold transition",
              canNext
                ? "bg-[#E5E7EB] text-gray-700 hover:bg-[#DDE1E7]"
                : "bg-gray-100 text-gray-300 cursor-not-allowed",
            ].join(" ")}
          >
            NEXT
          </button>

          {!canNext && (
            <div className="mt-2 text-center text-sm text-gray-500">
              Please select a size to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
