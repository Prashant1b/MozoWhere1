// src/components/customizer/PreviewStep.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

function ShirtTintOverlay({ hex }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60"
      style={{ backgroundColor: hex }}
    />
  );
}

export default function PreviewStep({
  mockups,
  selectedColor,
  selectedSize,
  designBySide,
  onBack,
}) {
  const [side, setSide] = useState("front");

  // ✅ Base coordinate system (same as FinaliseDesign)
  const printW = 280;
  const printH = 330;

  // ✅ Scale of visible print area vs base printW
  const [scaleToFit, setScaleToFit] = useState(1);
  const boxRef = useRef(null);

  const items = useMemo(() => designBySide?.[side] || [], [designBySide, side]);

  // ✅ keep scaleToFit updated as container resizes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printW]);

  return (
    <div className="mx-auto max-w-5xl px-3 sm:px-4 py-6 sm:py-8">
      <div className="mx-auto w-full max-w-[700px] bg-white border border-gray-200">
        <div className="p-3 sm:p-6">
          {/* header small line */}
          <div className="text-sm text-gray-600 mb-3">
            Color:{" "}
            <span className="font-semibold">{selectedColor?.name || "—"}</span> •
            Size: <span className="font-semibold">{selectedSize?.id || "—"}</span>
          </div>

          {/* ✅ Same preview box layout on mobile + desktop */}
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="relative w-full aspect-[4/5] bg-[#f6f6f6] border border-gray-200 overflow-hidden">
              {/* Shirt */}
              <img
                src={mockups[side]}
                alt="preview tshirt"
                className="absolute inset-0 h-full w-full object-contain select-none"
                draggable={false}
              />

              {/* Tint */}
              <ShirtTintOverlay hex={selectedColor?.hex || "#fff"} />

              {/* Flip */}
              <button
                onClick={() => setSide((s) => (s === "front" ? "back" : "front"))}
                className="absolute right-2 top-2 sm:right-4 sm:top-4 z-30 bg-white/95 border border-gray-200 px-2.5 py-2 text-xs sm:text-sm font-semibold hover:bg-white shadow-sm"
              >
                🔁 <span className="hidden sm:inline">Flip</span>
                <div className="sm:hidden text-[10px] leading-none mt-0.5">
                  Flip
                </div>
              </button>

              {/* ✅ PRINT AREA CONTAINER (responsive) */}
              <div
                className="absolute left-1/2 top-[22%] -translate-x-1/2 overflow-hidden z-20"
                style={{
                  width: "78%",
                  maxWidth: printW,
                  aspectRatio: "280 / 330",
                }}
              >
                {/* ✅ inner base coordinate box scaled to container */}
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
                  {/* boundary (same as editor) */}
                  <div className="absolute inset-0 border border-dashed border-gray-400/60 pointer-events-none" />

                  {/* render items */}
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
                            className="h-full w-full object-contain select-none pointer-events-none"
                            draggable={false}
                          />
                        ) : (
                          <div
                            className="h-full w-full select-none flex items-start"
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

          {/* ✅ Below preview (same layout) */}
          <div className="mt-3 sm:mt-4 border border-gray-200">
            <div className="grid grid-cols-2">
              <button className="py-4 sm:py-5 text-base sm:text-lg font-semibold hover:bg-gray-50 border-r border-gray-200">
                Terms &amp; Conditions
              </button>
              <button className="py-4 sm:py-5 text-base sm:text-lg font-semibold hover:bg-gray-50">
                About This Product
              </button>
            </div>

            <button className="w-full bg-[#3BA3A3] hover:opacity-95 text-white font-extrabold text-lg sm:text-xl py-5 sm:py-6 tracking-wide">
              ADD TO BAG
            </button>
          </div>

          <div className="mt-4 sm:mt-5">
            <button
              onClick={onBack}
              className="w-full rounded-lg border border-gray-200 py-3.5 font-bold hover:bg-gray-50"
            >
              Back to Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
