import React, { useEffect, useMemo, useRef, useState } from "react";

function ShirtTintOverlay({ hex }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-60"
      style={{ backgroundColor: hex }}
    />
  );
}

export default function PreviewStep({
  mockups,
  selectedColor,
  selectedSize,
  selectedFabric,
  showFabric = true,
  designBySide,
  onBack,
  onAddToBag,
  addingCustom,
  addMessage,
}) {
  const [side, setSide] = useState("front");

  const printW = 280;
  const printH = 330;

  const [scaleToFit, setScaleToFit] = useState(1);
  const boxRef = useRef(null);

  const items = useMemo(() => designBySide?.[side] || [], [designBySide, side]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || printW;
      setScaleToFit(w / printW);
    });

    ro.observe(el);
    setScaleToFit((el.clientWidth || printW) / printW);

    return () => ro.disconnect();
  }, [printW]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Preview Your Design</h2>
            <button
              onClick={() => setSide((s) => (s === "front" ? "back" : "front"))}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View {side === "front" ? "Back" : "Front"}
            </button>
          </div>

          <div className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <div className="relative aspect-[4/5] w-full">
              <img
                src={mockups[side]}
                alt="preview"
                className="absolute inset-0 h-full w-full select-none object-contain"
                draggable={false}
              />

              <ShirtTintOverlay hex={selectedColor?.hex || "#fff"} />

              <div
                className="absolute left-1/2 top-[22%] z-20 -translate-x-1/2 overflow-hidden"
                style={{
                  width: "78%",
                  maxWidth: printW,
                  aspectRatio: "280 / 330",
                }}
              >
                <div
                  ref={boxRef}
                  className="relative"
                  style={{
                    width: printW,
                    height: printH,
                    transform: `scale(${scaleToFit || 1})`,
                    transformOrigin: "top left",
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 border border-dashed border-slate-400/60" />

                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="absolute"
                      style={{ left: it.x, top: it.y, width: it.w, height: it.h }}
                    >
                      <div
                        className="h-full w-full"
                        style={{
                          transform: `rotate(${it.rot || 0}deg)`,
                          transformOrigin: "center",
                        }}
                      >
                        {it.type === "image" ? (
                          <img
                            src={it.src}
                            alt="design"
                            className="pointer-events-none h-full w-full select-none object-contain"
                            draggable={false}
                          />
                        ) : (
                          <div
                            className="flex h-full w-full select-none items-start"
                            style={{
                              fontSize: it.fontSize || 42,
                              fontWeight: 600,
                              color: "#111",
                              lineHeight: 1.05,
                            }}
                          >
                            {it.text}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Order Summary</div>

          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-xs text-slate-500">Color</div>
              <div className="text-sm font-bold text-slate-900">{selectedColor?.name || "-"}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-xs text-slate-500">Size</div>
              <div className="text-sm font-bold text-slate-900">{selectedSize?.id || "N/A"}</div>
            </div>
            {showFabric ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div className="text-xs text-slate-500">Fabric</div>
                <div className="text-sm font-bold text-slate-900">{selectedFabric?.name || "Standard"}</div>
              </div>
            ) : null}
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="text-xs text-slate-500">Design elements</div>
              <div className="text-sm font-bold text-slate-900">{(designBySide?.front?.length || 0) + (designBySide?.back?.length || 0)}</div>
            </div>
          </div>

          <button
            onClick={onAddToBag}
            disabled={addingCustom}
            className="mt-5 h-12 w-full rounded-xl bg-slate-900 text-sm font-extrabold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {addingCustom ? "ADDING..." : "ADD TO CART"}
          </button>

          <button
            onClick={onBack}
            className="mt-3 h-11 w-full rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Back to Edit
          </button>

          {addMessage ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
              {addMessage}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
