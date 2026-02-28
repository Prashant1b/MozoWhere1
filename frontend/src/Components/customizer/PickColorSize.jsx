import React, { useMemo } from "react";

export default function PickColorSize({
  previewImage,
  productTitle,
  productType,
  basePrice,
  colors,
  sizes,
  fabrics,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  selectedFabric,
  setSelectedFabric,
  onNext,
}) {
  const canNext = useMemo(() => {
    const fabricOk = !fabrics?.length || Boolean(selectedFabric?._id || selectedFabric?.id || selectedFabric?.name);
    const sizeOk = !sizes?.length || Boolean(selectedSize?.id);
    return Boolean(selectedColor) && sizeOk && fabricOk;
  }, [selectedColor, selectedSize, sizes, fabrics, selectedFabric]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Live Preview</div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="relative aspect-[4/5] w-full">
              {previewImage ? (
                <img src={previewImage} alt={productTitle || "Template"} className="h-full w-full object-contain p-4" />
              ) : (
                <div className="grid h-full place-items-center text-sm text-slate-500">No preview image</div>
              )}
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-4 text-white">
            <div className="text-sm font-semibold text-slate-200">{productType || "Custom Product"}</div>
            <div className="mt-1 text-lg font-extrabold">{productTitle || "Product Template"}</div>
            <div className="mt-3 text-sm text-slate-300">Base price</div>
            <div className="text-2xl font-black">Rs {Number(basePrice || 0)}</div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-2xl font-black text-slate-900">Choose Your Product Options</h2>
          <p className="mt-1 text-sm text-slate-600">Select color, size and fabric before opening design studio.</p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">Color</h3>
              <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
                {colors.map((c) => {
                  const active = selectedColor?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={[
                        "relative h-[72px] rounded-xl border transition",
                        active ? "border-slate-900 ring-2 ring-slate-300" : "border-slate-200 hover:border-slate-400",
                      ].join(" ")}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">Size</h3>
              {!sizes?.length ? (
                <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  Size is not required for this product.
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((s) => {
                    const disabled = Number.isFinite(s.stock) && s.stock <= 0;
                    const active = selectedSize?.id === s.id;
                    return (
                      <button
                        key={s.id}
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) return;
                          setSelectedSize((prev) => (prev?.id === s.id ? null : s));
                        }}
                        className={[
                          "min-w-14 rounded-lg border px-4 py-2 text-sm font-bold",
                          disabled
                            ? "cursor-not-allowed border-slate-200 text-slate-300"
                            : active
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 text-slate-800 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {s.id}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {!!fabrics?.length && (
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-700">Fabric</h3>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {fabrics.map((f) => {
                    const key = f?._id || f?.id || f?.name;
                    const active = (selectedFabric?._id || selectedFabric?.id || selectedFabric?.name) === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedFabric(f)}
                        className={[
                          "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition",
                          active
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div>{f?.name || "Fabric"}</div>
                        <div className={active ? "text-slate-300" : "text-slate-500"}>
                          {Number(f?.extraPrice || 0) > 0 ? `+ Rs ${Number(f.extraPrice)}` : "No extra charge"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="text-sm text-slate-600">Selected</div>
            <div className="text-sm font-bold text-slate-900">
              {selectedColor?.name || "-"} | {selectedSize?.id || "N/A"} | {selectedFabric?.name || "-"}
            </div>
          </div>

          <button
            onClick={onNext}
            disabled={!canNext}
            className={[
              "mt-4 h-12 w-full rounded-xl text-sm font-extrabold transition",
              canNext ? "bg-slate-900 text-white hover:bg-slate-800" : "cursor-not-allowed bg-slate-200 text-slate-500",
            ].join(" ")}
          >
            Continue to Design Studio
          </button>
        </section>
      </div>
    </div>
  );
}
