import React, { useEffect, useMemo, useRef, useState } from "react";
import { HERO_SLIDES } from "../data/scrollcategory";
import { Link } from "react-router-dom";

function usePerView() {
  const [perView, setPerView] = useState(() =>
    typeof window === "undefined" ? 2 : window.innerWidth < 768 ? 1 : 2
  );

  useEffect(() => {
    const onResize = () => setPerView(window.innerWidth < 768 ? 1 : 2);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return perView;
}

export default function HomeHeroCarousel({
  speedPxPerSec = 90, // ✅ smooth speed (change as you want)
  pauseOnHover = true,
}) {
  const perView = usePerView();
  const slides = HERO_SLIDES;

  // ✅ clone for infinite loop: [last..] + real + [first..]
  const loopSlides = useMemo(() => {
    const headClones = slides.slice(-perView);
    const tailClones = slides.slice(0, perView);
    return [...headClones, ...slides, ...tailClones];
  }, [slides, perView]);

  const cloneOffset = perView;

  // We control movement using pixel translate, not index-steps
  const [containerW, setContainerW] = useState(0);
  const viewportRef = useRef(null);

  // pxTranslate starts at cloneOffset * cardWidth
  const [pxTranslate, setPxTranslate] = useState(0);

  const hoverRef = useRef(false);
  const rafRef = useRef(null);
  const lastTsRef = useRef(0);

  // Measure viewport width
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      setContainerW(el.getBoundingClientRect().width);
    });
    ro.observe(el);
    setContainerW(el.getBoundingClientRect().width);

    return () => ro.disconnect();
  }, []);

  // Derived widths
  const cardW = containerW ? containerW / perView : 0;
  const oneSlideShift = cardW; // moving by one slide = card width
  const startPx = cloneOffset * oneSlideShift; // first real slide position
  const endPx = (cloneOffset + slides.length) * oneSlideShift; // end boundary after last real

  // Reset when responsive changes / container changes
  useEffect(() => {
    if (!cardW) return;
    setPxTranslate(startPx);
    lastTsRef.current = 0;
  }, [cardW, startPx]);

  // ✅ Continuous auto-scroll loop (requestAnimationFrame)
  useEffect(() => {
    if (!cardW) return;

    const tick = (ts) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000; // seconds
      lastTsRef.current = ts;

      const paused = pauseOnHover && hoverRef.current;
      if (!paused) {
        setPxTranslate((prev) => {
          const next = prev + speedPxPerSec * dt;

          // ✅ if we crossed end boundary -> jump back by slides.length * cardW
          if (next >= endPx) {
            return next - slides.length * oneSlideShift;
          }
          return next;
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cardW, endPx, oneSlideShift, slides.length, speedPxPerSec, pauseOnHover]);

  // Translate in %
  const translatePct = cardW ? (pxTranslate / containerW) * 100 : 0;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* viewport */}
        <div
          ref={viewportRef}
          className="relative overflow-hidden"
          onMouseEnter={() => {
            hoverRef.current = true;
          }}
          onMouseLeave={() => {
            hoverRef.current = false;
          }}
        >
          {/* track */}
          <div
            className="flex gap-6 will-change-transform"
            style={{
              transform: `translateX(-${translatePct}%)`,
            }}
          >
            {loopSlides.map((s, i) => (
              <SlideCard key={`${s.id}-${i}`} slide={s} perView={perView} />
            ))}
          </div>
        </div>

        {/* dots (optional: shows approx position) */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: Math.ceil(slides.length / perView) }).map(
            (_, p) => (
              <span
                key={p}
                className="h-2.5 w-2.5 rounded-full bg-slate-300"
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

function SlideCard({ slide, perView }) {
  const GAP_PX = 24; // gap-6 = 24px

  const cardBasis =
    perView === 1
      ? "100%"
      : `calc((100% - ${GAP_PX * (perView - 1)}px) / ${perView})`;

  const fit = slide.fit || "cover"; // default cover for banners

  return (
    <Link
       to={`http://localhost:5173/${slide.link}`}
      className={[
        "relative shrink-0 overflow-hidden rounded-3xl",
        "bg-[#efefef] shadow-[0_14px_40px_rgba(15,23,42,0.12)]",
      ].join(" ")}
      style={{
        flexBasis: cardBasis,
        minWidth: cardBasis,
      }}
    >
      {/* ✅ Image wrapper: fills full area */}
      <div className="h-[320px] md:h-[420px] w-full bg-[#efefef]">
        <img
          src={slide.image}
          alt={slide.title || slide.scriptTitle || "Promo"}
          className={[
            "h-full w-full",
            fit === "contain" ? "object-contain p-4" : "object-cover",
          ].join(" ")}
          loading="lazy"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-white/10" />

      {slide.variant === "leftOverlay" ? (
        <>
          <div className="absolute left-8 top-8 flex items-center gap-2 text-slate-800">
            <span className="text-sm tracking-[0.22em] opacity-80">
              {slide.topTag?.split(" ")[0] || "ALL"}
            </span>
            <span className="text-sm font-semibold tracking-[0.22em]">
              {slide.topTag?.split(" ")[1] || "NEW"}
            </span>
          </div>

          <div className="absolute bottom-8 left-8">
            <div className="text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
              <div className="font-[cursive] text-5xl leading-none md:text-6xl">
                {slide.scriptTitle}
              </div>
              <div className="mt-2 text-sm tracking-[0.5em]">
                {slide.subTitle}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="absolute bottom-8 left-0 right-0 px-6 text-center">
          <div className="text-slate-800">
            <div className="text-3xl font-semibold md:text-4xl">
              {slide.title}
            </div>
            <div className="mt-1 text-lg font-extrabold tracking-wide">
              {slide.subtitle}
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}

