  // src/components/customizer/FinaliseDesign.jsx
  import React, { useEffect, useMemo, useRef, useState } from "react";
  import BottomActions from "./BottomActions";
  import GalleryModal from "./GalleryModal";

  /* ================== HELPERS ================== */
  function uid() {
    return Math.random().toString(16).slice(2);
  }
  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  /**
   * ✅ Correct clamp:
   * - If item smaller than area: x ∈ [0 .. areaW-w]
   * - If item larger than area: x ∈ [areaW-w .. 0]
   * Same for y.
   */
  function clampItemInside(item, areaW, areaH) {
    const w = item.w ?? 0;
    const h = item.h ?? 0;

    const aX = areaW - w;
    const aY = areaH - h;

    const minX = Math.min(aX, 0);
    const maxX = Math.max(aX, 0);
    const minY = Math.min(aY, 0);
    const maxY = Math.max(aY, 0);

    const x = clamp(item.x, minX, maxX);
    const y = clamp(item.y, minY, maxY);

    return { ...item, x, y };
  }

  function getLocalPoint(e, boxEl) {
    const r = boxEl.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function degFromPoints(cx, cy, px, py) {
    const rad = Math.atan2(py - cy, px - cx);
    return (rad * 180) / Math.PI;
  }

  function ShirtTintOverlay({ hex }) {
    return (
      <div
        className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-60"
        style={{ backgroundColor: hex }}
      />
    );
  }

  /* ================== RESIZE HANDLE ================== */
  function ResizeHandle({ pos, onDown }) {
    const base =
      "absolute h-5 w-5 sm:h-4 sm:w-4 rounded bg-white border border-gray-400 pointer-events-auto";
    const map = {
      tl: "left-[-10px] top-[-10px] cursor-nwse-resize",
      tr: "right-[-10px] top-[-10px] cursor-nesw-resize",
      bl: "left-[-10px] bottom-[-10px] cursor-nesw-resize",
      br: "right-[-10px] bottom-[-10px] cursor-nwse-resize",
      t: "left-1/2 top-[-10px] -translate-x-1/2 cursor-ns-resize",
      b: "left-1/2 bottom-[-10px] -translate-x-1/2 cursor-ns-resize",
      l: "left-[-10px] top-1/2 -translate-y-1/2 cursor-ew-resize",
      r: "right-[-10px] top-1/2 -translate-y-1/2 cursor-ew-resize",
    };
    return (
      <div
        className={[base, map[pos]].join(" ")}
        onPointerDown={onDown}
        role="button"
        aria-label={`Resize ${pos}`}
      />
    );
  }

  /* ================== MAIN ================== */
export default function FinaliseDesign({
  product,
  setProduct,
  mockups,
  galleryTabs,
  galleryItems,
  selectedColor,
  selectedSize,
  designBySide,
  setDesignBySide,
  onNext,
}) {
    const [side, setSide] = useState("front");
    const [openGallery, setOpenGallery] = useState(false);
    const [activeId, setActiveId] = useState(null);

    const fileRef = useRef(null);
    const boxRef = useRef(null);
    const sessionRef = useRef(null);

    // ✅ Base coordinate system (DO NOT change)
    const printW = 280;
    const printH = 330;

    // ✅ scale of the visible print area container vs base printW
    const [scaleToFit, setScaleToFit] = useState(1);

    const items = useMemo(() => designBySide[side] || [], [designBySide, side]);
    const activeItem = useMemo(
      () => items.find((it) => it.id === activeId) || null,
      [items, activeId]
    );

    /* ------------ keep scaleToFit updated as container width changes ------------ */
    useEffect(() => {
      const el = boxRef.current;
      if (!el) return;

      const ro = new ResizeObserver(() => {
        const w = el.clientWidth || printW;
        setScaleToFit(w / printW);
      });

      ro.observe(el);
      // set initial
      setScaleToFit((el.clientWidth || printW) / printW);

      return () => ro.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [printW]);

    /* ------------ state helpers ------------ */
    function setItems(updater) {
      setDesignBySide((prev) => {
        const next = { ...prev };
        const curr = next[side] || [];
        next[side] = typeof updater === "function" ? updater(curr) : updater;
        return next;
      });
    }

    function updateItem(id, patch) {
      setItems((curr) =>
        curr.map((it) => {
          if (it.id !== id) return it;
          const merged = { ...it, ...patch };
          return clampItemInside(merged, printW, printH);
        })
      );
    }

    /* ------------ layer controls ------------ */
    function bringToFront() {
      if (!activeId) return;
      setItems((curr) => {
        const idx = curr.findIndex((x) => x.id === activeId);
        if (idx < 0) return curr;
        const copy = curr.slice();
        const [it] = copy.splice(idx, 1);
        copy.push(it);
        return copy;
      });
    }
    function sendToBack() {
      if (!activeId) return;
      setItems((curr) => {
        const idx = curr.findIndex((x) => x.id === activeId);
        if (idx < 0) return curr;
        const copy = curr.slice();
        const [it] = copy.splice(idx, 1);
        copy.unshift(it);
        return copy;
      });
    }

    /* ------------ actions ------------ */
    function addText() {
      const text = prompt("Enter text");
      if (!text) return;

      const it = clampItemInside(
        {
          id: uid(),
          type: "text",
          text,
          x: 40,
          y: 40,
          w: 200,
          h: 80,
          fontSize: 42,
          rot: 0,
        },
        printW,
        printH
      );

      setItems((c) => [...c, it]);
      setActiveId(it.id);
    }

    function editActiveText() {
      if (!activeItem || activeItem.type !== "text") return;
      const nextText = prompt("Update text", activeItem.text);
      if (nextText === null) return;
      updateItem(activeItem.id, { text: nextText });
    }

    function removeActive() {
      if (!activeId) return;
      setItems((c) => c.filter((x) => x.id !== activeId));
      setActiveId(null);
    }

    function onUploadClick() {
      fileRef.current?.click();
    }

    function onUploadFile(e) {
      const file = e.target.files?.[0];
      if (!file) return;

      const url = URL.createObjectURL(file);

      const it = clampItemInside(
        {
          id: uid(),
          type: "image",
          src: url,
          x: 40,
          y: 50,
          w: 170,
          h: 170,
          rot: 0,
        },
        printW,
        printH
      );

      setItems((c) => [...c, it]);
      setActiveId(it.id);
      e.target.value = "";
    }

    function pickGalleryItem(it) {
      const newItem = clampItemInside(
        {
          id: uid(),
          type: "image",
          src: it.src,
          x: 40,
          y: 50,
          w: 170,
          h: 170,
          rot: 0,
        },
        printW,
        printH
      );

      setItems((c) => [...c, newItem]);
      setActiveId(newItem.id);
      setOpenGallery(false);
    }

    /* ------------ pointer sessions (move/resize/rotate) ------------ */
    function lockPageScroll(lock) {
      document.documentElement.style.overflow = lock ? "hidden" : "";
      document.body.style.overflow = lock ? "hidden" : "";
    }

    function beginSession(e, id, mode, handle = null) {
      e.preventDefault();
      e.stopPropagation();

      const box = boxRef.current;
      if (!box) return;

      const it = items.find((x) => x.id === id);
      if (!it) return;

      setActiveId(id);

      const p = getLocalPoint(e, box);
      sessionRef.current = {
        id,
        mode, // "move" | "resize" | "rotate"
        handle,
        startPointer: p,
        startItem: { ...it },
      };

      lockPageScroll(true);
      window.addEventListener("pointermove", onPointerMove, { passive: false });
      window.addEventListener("pointerup", endSession, { passive: false });
    }

    function onPointerMove(e) {
      if (!sessionRef.current) return;
      e.preventDefault();

      const box = boxRef.current;
      if (!box) return;

      const s = sessionRef.current;
      const p = getLocalPoint(e, box);

      // ✅ IMPORTANT: unscale dx/dy so both move + resize feel correct
      const dx = (p.x - s.startPointer.x) / (scaleToFit || 1);
      const dy = (p.y - s.startPointer.y) / (scaleToFit || 1);

      const it0 = s.startItem;

      if (s.mode === "move") {
        updateItem(s.id, { x: it0.x + dx, y: it0.y + dy });
        return;
      }

      if (s.mode === "rotate") {
        // For rotate, use unscaled center but pointer converted to base coords
        const basePx = it0.x + it0.w / 2;
        const basePy = it0.y + it0.h / 2;

        const pointerBaseX = it0.x + it0.w / 2 + dx;
        const pointerBaseY = it0.y + it0.h / 2 + dy;

        const angle = degFromPoints(basePx, basePy, pointerBaseX, pointerBaseY);
        updateItem(s.id, { rot: angle });
        return;
      }

      // resize
      const minSize = 40;
      const maxSize = 5000;

      let x = it0.x;
      let y = it0.y;
      let w = it0.w;
      let h = it0.h;

      const handle = s.handle;

      // horizontal
      if (handle === "l" || handle === "tl" || handle === "bl") {
        x = it0.x + dx;
        w = it0.w - dx;
      }
      if (handle === "r" || handle === "tr" || handle === "br") {
        w = it0.w + dx;
      }

      // vertical
      if (handle === "t" || handle === "tl" || handle === "tr") {
        y = it0.y + dy;
        h = it0.h - dy;
      }
      if (handle === "b" || handle === "bl" || handle === "br") {
        h = it0.h + dy;
      }

      w = clamp(w, minSize, maxSize);
      h = clamp(h, minSize, maxSize);

      // anchored after clamp
      if (handle === "l" || handle === "tl" || handle === "bl") x = it0.x + (it0.w - w);
      if (handle === "t" || handle === "tl" || handle === "tr") y = it0.y + (it0.h - h);

      if (it0.type === "text") {
        const nextFont = clamp((it0.fontSize || 42) + dy * 0.15, 14, 160);
        updateItem(s.id, { x, y, w, h, fontSize: nextFont });
      } else {
        updateItem(s.id, { x, y, w, h });
      }
    }

    function endSession() {
      sessionRef.current = null;
      lockPageScroll(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endSession);
    }

    /* ------------ keyboard nudge ------------ */
    useEffect(() => {
      function onKey(e) {
        if (!activeId) return;
        const it = items.find((x) => x.id === activeId);
        if (!it) return;

        const step = e.shiftKey ? 10 : 2;

        if (e.key === "ArrowLeft") updateItem(activeId, { x: it.x - step });
        if (e.key === "ArrowRight") updateItem(activeId, { x: it.x + step });
        if (e.key === "ArrowUp") updateItem(activeId, { y: it.y - step });
        if (e.key === "ArrowDown") updateItem(activeId, { y: it.y + step });
        if (e.key === "Delete" || e.key === "Backspace") removeActive();
      }

      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeId, items]);

    return (
      <div className="mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-sm text-gray-600">
          Color: <span className="font-semibold">{selectedColor?.name || "—"}</span> •
          Size: <span className="font-semibold">{selectedSize?.id || "—"}</span>
        </div>

        {/* ✅ CANVAS wrapper responsive */}
        <div className="mt-4 sm:mt-6 mx-auto w-full max-w-[560px]">
          {/* Fixed aspect keeps mobile same */}
          <div className="relative w-full aspect-[4/5] bg-[#f6f6f6] border border-gray-200 overflow-hidden">
            {/* Shirt */}
            <img
              src={mockups[side]}
              alt="Tshirt"
              className="absolute inset-0 h-full w-full object-contain select-none"
              draggable={false}
            />

            {/* Tint */}
            <ShirtTintOverlay hex={selectedColor?.hex || "#fff"} />
             {/* Product Switch */}
<div className="absolute left-2 top-2 sm:left-4 sm:top-4 z-30 flex gap-2">
  <button
    onClick={() => {
      setActiveId(null);
      setProduct("tshirt");
    }}
    className={`bg-white/95 border border-gray-200 px-2.5 py-2 text-xs sm:text-sm font-semibold hover:bg-white shadow-sm ${
      product === "tshirt" ? "ring-2 ring-teal-500" : ""
    }`}
  >
    👕 <span className="hidden sm:inline">Tshirt</span>
  </button>

  <button
    onClick={() => {
      setActiveId(null);
      setProduct("cap");
    }}
    className={`bg-white/95 border border-gray-200 px-2.5 py-2 text-xs sm:text-sm font-semibold hover:bg-white shadow-sm ${
      product === "cap" ? "ring-2 ring-teal-500" : ""
    }`}
  >
    🧢 <span className="hidden sm:inline">Cap</span>
  </button>
</div>

            {/* Flip */}
            <button
              onClick={() => {
                setActiveId(null);
                setSide((s) => (s === "front" ? "back" : "front"));
              }}
              className="absolute right-2 top-2 sm:right-4 sm:top-4 z-30 bg-white/95 border border-gray-200 px-2.5 py-2 text-xs sm:text-sm font-semibold hover:bg-white shadow-sm"
            >
              🔁 <span className="hidden sm:inline">Flip</span>
              <div className="sm:hidden text-[10px] leading-none mt-0.5">Flip</div>
            </button>

            {/* ✅ PRINT AREA CONTAINER (responsive) */}
            <div
              className="absolute left-1/2 top-[22%] -translate-x-1/2 overflow-hidden touch-none z-20"
              style={{
                width: "78%",
                maxWidth: printW,
                aspectRatio: "280 / 330",
              }}
              onPointerDown={() => setActiveId(null)}
            >
              {/* ✅ This is the element we use for pointer coords */}
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
                <div className="absolute inset-0 border border-dashed border-gray-400/60 pointer-events-none" />

                {items.map((it) => {
                  const active = it.id === activeId;

                  return (
                    <div
                      key={it.id}
                      className="absolute"
                      style={{ left: it.x, top: it.y, width: it.w, height: it.h }}
                      onPointerDown={(e) => beginSession(e, it.id, "move")}
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
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setActiveId(it.id);
                              setTimeout(editActiveText, 0);
                            }}
                          >
                            {it.text}
                          </div>
                        )}
                      </div>

                      {active && (
                        <div className="absolute inset-0 border-2 border-teal-600/60">
                          {/* delete */}
                          <button
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              removeActive();
                            }}
                            className="absolute -right-3 -top-3 h-7 w-7 rounded bg-black text-white text-sm font-bold z-40"
                            title="Delete"
                          >
                            ×
                          </button>

                          {/* rotate */}
                          <button
                            onPointerDown={(e) => beginSession(e, it.id, "rotate")}
                            className="absolute left-1/2 -top-10 -translate-x-1/2 h-8 w-8 rounded-full bg-white border border-gray-300 shadow cursor-grab active:cursor-grabbing z-40"
                            title="Rotate"
                          >
                            ⟳
                          </button>
                          <div className="absolute left-1/2 -top-2 -translate-x-1/2 h-2 w-[2px] bg-gray-400 z-40" />

                          {/* resize handles */}
                          <ResizeHandle pos="tl" onDown={(e) => beginSession(e, it.id, "resize", "tl")} />
                          <ResizeHandle pos="tr" onDown={(e) => beginSession(e, it.id, "resize", "tr")} />
                          <ResizeHandle pos="bl" onDown={(e) => beginSession(e, it.id, "resize", "bl")} />
                          <ResizeHandle pos="br" onDown={(e) => beginSession(e, it.id, "resize", "br")} />
                          <ResizeHandle pos="t" onDown={(e) => beginSession(e, it.id, "resize", "t")} />
                          <ResizeHandle pos="b" onDown={(e) => beginSession(e, it.id, "resize", "b")} />
                          <ResizeHandle pos="l" onDown={(e) => beginSession(e, it.id, "resize", "l")} />
                          <ResizeHandle pos="r" onDown={(e) => beginSession(e, it.id, "resize", "r")} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUploadFile}
          />

          {/* ✅ Actions clickable on mobile */}
          <div className="relative z-50">
            <BottomActions
              mode="edit"
              onAddText={addText}
              onUpload={onUploadClick}
              onOpenGallery={() => setOpenGallery(true)}
              onSave={() => alert("Saved (demo).")}
              onNext={onNext}
            />
          </div>

          {/* quick controls */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm">
            <button
              onClick={editActiveText}
              disabled={!activeItem || activeItem.type !== "text"}
              className="rounded-lg border border-gray-200 px-4 py-2 font-semibold disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Edit Text
            </button>

            <button
              onClick={removeActive}
              disabled={!activeItem}
              className="rounded-lg border border-gray-200 px-4 py-2 font-semibold disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Delete Selected
            </button>

            <button
              onClick={bringToFront}
              disabled={!activeItem}
              className="rounded-lg border border-gray-200 px-4 py-2 font-semibold disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Bring Front
            </button>

            <button
              onClick={sendToBack}
              disabled={!activeItem}
              className="rounded-lg border border-gray-200 px-4 py-2 font-semibold disabled:text-gray-300 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Send Back
            </button>

            <div className="text-gray-500">
              Tip: Arrow keys move • Shift+Arrow fast • Delete removes
            </div>
          </div>
        </div>

        <GalleryModal
          open={openGallery}
          onClose={() => setOpenGallery(false)}
          tabs={galleryTabs}
          itemsByTab={galleryItems}
          onPick={pickGalleryItem}
        />
      </div>
    );
  }
