// src/pages/CustomizerPage.jsx
import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import StepsBar from "../Components/customizer/StepsBar";
import PickColorSize from "../Components/customizer/PickColorSize";
import FinaliseDesign from "../Components/customizer/FinaliseDesign";
import PreviewStep from "../Components/customizer/PreviewStep";

import {
  COLORS,
  SIZES,
  MOCKUPS_BY_PRODUCT,
  GALLERY_TABS,
  GALLERY_ITEMS,
} from "../data/customizerData";

export default function CustomizerPage() {
  const location = useLocation();

  // ✅ Receive product from listing page
  const initialProduct = useMemo(() => {
    const p = location.state?.product;
    return p === "cap" ? "cap" : "tshirt";
  }, [location.state]);

  const [step, setStep] = useState(1);
  const [product, setProduct] = useState(initialProduct);

  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(null);

  const [designByProduct, setDesignByProduct] = useState(() => ({
    tshirt: { front: [], back: [] },
    cap: { front: [], back: [] },
  }));

  const canGoStep2 = useMemo(
    () => Boolean(selectedColor) && Boolean(selectedSize?.id),
    [selectedColor, selectedSize]
  );

  const mockups = useMemo(() => {
    return MOCKUPS_BY_PRODUCT?.[product] ?? MOCKUPS_BY_PRODUCT?.tshirt ?? { front: "", back: "" };
  }, [product]);

  const currentDesign = useMemo(() => {
    return designByProduct?.[product] ?? { front: [], back: [] };
  }, [designByProduct, product]);

  const setDesignBySide = (updater) => {
    setDesignByProduct((prev) => {
      const curr = prev?.[product] ?? { front: [], back: [] };
      const nextForProduct = typeof updater === "function" ? updater(curr) : updater;
      return { ...prev, [product]: nextForProduct };
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <StepsBar step={step} />

      {step === 1 && (
        <PickColorSize
          colors={COLORS}
          sizes={SIZES}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          onNext={() => {
            if (!canGoStep2) return;
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <FinaliseDesign
          product={product}
          setProduct={setProduct}
          mockups={mockups}
          galleryTabs={GALLERY_TABS}
          galleryItems={GALLERY_ITEMS}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          designBySide={currentDesign}
          setDesignBySide={setDesignBySide}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <PreviewStep
          mockups={mockups}
          selectedColor={selectedColor}
          designBySide={currentDesign}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}
