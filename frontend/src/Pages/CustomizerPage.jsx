import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import StepsBar from "../Components/customizer/StepsBar";
import PickColorSize from "../Components/customizer/PickColorSize";
import FinaliseDesign from "../Components/customizer/FinaliseDesign";
import PreviewStep from "../Components/customizer/PreviewStep";
import { customizeTemplateApi } from "../api/customizeTemplate.api";
import { customizeDesignApi } from "../api/customizeDesign.api";
import { cartApi } from "../api/cart.api";
import { buildPreviewForSide } from "../utils/customPreview";

const COLOR_HEX_MAP = {
  white: "#FFFFFF",
  black: "#111827",
  navy: "#1e3a8a",
  blue: "#2563eb",
  sky: "#7dd3fc",
  lavender: "#c4b5fd",
  mint: "#6ee7b7",
  sand: "#d6b48a",
  red: "#ef4444",
  yellow: "#facc15",
  green: "#22c55e",
  gray: "#9ca3af",
  grey: "#9ca3af",
  maroon: "#7f1d1d",
  beige: "#d6d3c8",
  orange: "#f97316",
  pink: "#ec4899",
  purple: "#8b5cf6",
  brown: "#92400e",
};

const DEFAULT_FABRICS = [
  { _id: "default-cotton", name: "Cotton", extraPrice: 0 },
  { _id: "default-premium", name: "Premium Cotton", extraPrice: 99 },
  { _id: "default-blend", name: "Poly-Cotton Blend", extraPrice: 49 },
];

function colorToHex(name, index) {
  const key = String(name || "").trim().toLowerCase();
  if (COLOR_HEX_MAP[key]) return COLOR_HEX_MAP[key];
  const fallback = ["#e2e8f0", "#cbd5e1", "#94a3b8", "#a3a3a3"];
  return fallback[index % fallback.length];
}

function toObjectIdMaybe(v) {
  const s = String(v || "");
  return /^[a-f\d]{24}$/i.test(s) ? s : null;
}

function mapLayers(designBySide) {
  const out = [];
  const entries = Object.entries(designBySide || {});
  for (const [side, items] of entries) {
    for (const it of items || []) {
      if (it?.type === "text") {
        out.push({
          kind: "text",
          side,
          x: it.x,
          y: it.y,
          w: it.w,
          h: it.h,
          rotate: it.rot || 0,
          text: it.text || "",
          fontSize: it.fontSize || 32,
          color: "#111111",
        });
      } else {
        out.push({
          kind: "image",
          side,
          x: it.x,
          y: it.y,
          w: it.w,
          h: it.h,
          rotate: it.rot || 0,
          imageUrl: it.src || "",
        });
      }
    }
  }
  return out;
}

function getTemplateHeroImage(template) {
  return (
    template?.mockups?.front ||
    template?.mockups?.back ||
    template?.mockups?.left ||
    template?.mockups?.right ||
    ""
  );
}

export default function CustomizerPage() {
  const { slug } = useParams();
  const location = useLocation();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [template, setTemplate] = useState(location.state?.template || null);

  const [step, setStep] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);

  const [designBySide, setDesignBySide] = useState({ front: [], back: [] });
  const [addingCustom, setAddingCustom] = useState(false);
  const [addMessage, setAddMessage] = useState("");
  const isAccessoryType = ["cap", "mug", "pen", "accessory"].includes(
    String(template?.type || "").toLowerCase()
  );

  useEffect(() => {
    const templateSlug = slug || location.state?.template?.slug;

    if (!templateSlug) {
      setLoading(false);
      setErr("Please select a product template from Customize Listing first.");
      return;
    }

    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await customizeTemplateApi.detail(templateSlug);
        setTemplate(res.data?.template || null);
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || "Failed to load template");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, location.state]);

  const colors = useMemo(() => {
    const raw = template?.colors || [];
    return raw.map((name, i) => ({
      id: String(name).toLowerCase().replace(/\s+/g, "-"),
      name,
      hex: colorToHex(name, i),
    }));
  }, [template]);

  const sizes = useMemo(() => {
    const raw = template?.sizes || [];
    return raw.map((size) => ({ id: String(size), stock: null }));
  }, [template]);

  const fabrics = useMemo(() => {
    if (isAccessoryType) return [];
    const fromBackend = template?.fabrics || [];
    return fromBackend.length ? fromBackend : DEFAULT_FABRICS;
  }, [template, isAccessoryType]);

  useEffect(() => {
    if (colors.length && !selectedColor) setSelectedColor(colors[0]);
    if (sizes.length && !selectedSize) setSelectedSize(sizes[0]);
    if (fabrics.length && !selectedFabric) setSelectedFabric(fabrics[0]);
    if (!fabrics.length && selectedFabric) setSelectedFabric(null);
  }, [colors, sizes, fabrics, selectedColor, selectedSize, selectedFabric]);

  const canGoStep2 = useMemo(() => {
    const fabricOk = !fabrics.length || Boolean(selectedFabric);
    const sizeOk = !sizes.length || Boolean(selectedSize?.id);
    return Boolean(selectedColor?.id) && sizeOk && fabricOk;
  }, [selectedColor, selectedSize, selectedFabric, fabrics, sizes]);

  const mockups = useMemo(() => {
    const front = template?.mockups?.front || "";
    const back = template?.mockups?.back || front || "";
    return { front, back };
  }, [template]);

  const galleryTabs = useMemo(
    () => (Array.isArray(template?.galleryTabs) ? template.galleryTabs : []),
    [template]
  );

  const galleryItems = useMemo(
    () => (template?.galleryItems && typeof template.galleryItems === "object" ? template.galleryItems : {}),
    [template]
  );

  const onAddCustomToCart = async () => {
    if (!template?._id) return;
    setAddMessage("");
    setAddingCustom(true);

    try {
      const fabricId = toObjectIdMaybe(selectedFabric?._id || selectedFabric?.id);

      const created = await customizeDesignApi.create({
        templateId: template._id,
        color: selectedColor?.name,
        size: selectedSize?.id,
        ...(fabricId ? { fabricId } : {}),
      });

      const designId = created.data?.design?._id;
      if (!designId) throw new Error("Design create failed");

      const layers = mapLayers(designBySide);
      const previewFront = await buildPreviewForSide({
        mockupSrc: mockups.front || mockups.back || "",
        tintHex: selectedColor?.hex || "#ffffff",
        layers,
        side: "front",
      });
      const previewBack = await buildPreviewForSide({
        mockupSrc: mockups.back || mockups.front || "",
        tintHex: selectedColor?.hex || "#ffffff",
        layers,
        side: "back",
      });

      await customizeDesignApi.update(designId, {
        layers,
        preview: {
          front: previewFront || "",
          back: previewBack || "",
        },
      });
      await customizeDesignApi.setReady(designId);
      await cartApi.addCustom({ designId, quantity: 1 });

      setAddMessage("Customized item added to cart");
      nav("/cart");
    } catch (e) {
      if (e?.response?.status === 401) {
        nav("/login", { state: { from: `/customizer/${template?.slug || slug}` } });
        return;
      }
      setAddMessage(e?.response?.data?.message || e?.message || "Failed to add customized item");
    } finally {
      setAddingCustom(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-slate-600">Loading customization template...</div>;
  }

  if (err) {
    return <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{err}</div>;
  }

  if (!template) {
    return <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-slate-600">Template not found.</div>;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f7fb]">
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Mozowhere Customize Studio</div>
              <h1 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">{template.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Professional 3-step customizer. Pick product options, place design elements exactly where you want, then preview and add to cart.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                Type: <span className="font-bold text-slate-900">{template.type || "Apparel"}</span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                From <span className="font-bold text-slate-900">Rs {Number(template.basePrice || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StepsBar step={step} />

      {step === 1 && (
        <PickColorSize
          previewImage={getTemplateHeroImage(template)}
          productTitle={template.title}
          productType={template.type}
          basePrice={Number(template.basePrice || 0)}
          colors={colors}
          sizes={sizes}
          fabrics={fabrics}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          selectedFabric={selectedFabric}
          setSelectedFabric={setSelectedFabric}
          onNext={() => {
            if (!canGoStep2) return;
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <FinaliseDesign
          mockups={mockups}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          selectedFabric={selectedFabric}
          showFabric={!isAccessoryType}
          designBySide={designBySide}
          setDesignBySide={setDesignBySide}
          galleryTabs={galleryTabs}
          galleryItems={galleryItems}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <PreviewStep
          mockups={mockups}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          selectedFabric={selectedFabric}
          showFabric={!isAccessoryType}
          designBySide={designBySide}
          addingCustom={addingCustom}
          addMessage={addMessage}
          onAddToBag={onAddCustomToCart}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}
