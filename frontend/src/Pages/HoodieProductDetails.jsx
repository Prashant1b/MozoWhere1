import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../Components/Product/TopBar";
import ImageCarousel from "../Components/Product/ImageCarousel";
import PriceBlock from "../Components/Product/PriceBlock";
import SizePicker from "../Components/Product/SizePicker";
import OffersRail from "../Components/Product/OffersRail";
import PincodeCheck from "../Components/Product/PincodeCheck";
import Highlights from "../Components/Product/Highlights";
import Accordions from "../Components/Product/AccordionBlock";
import Reviews from "../Components/Product/Reviews";
import MiniProductRail from "../Components/Product/MiniProductRail";
import StickyAddToBag from "../Components/Product/StickyAddToBag";
import { Hoodie } from "../data/hoodie";
import { normalizeProduct } from "../utils/normalize";

export default function HoodieProductDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const productRaw = useMemo(
    () => Hoodie.find((p) => String(p.id) === String(id)),
    [id]
  );

  const product = useMemo(
    () => normalizeProduct(productRaw, Hoodie),
    [productRaw]
  );

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [pincode, setPincode] = useState("");

  const [openDesc, setOpenDesc] = useState(false);
  const [openReturns, setOpenReturns] = useState(false);
  const [showTop, setShowTop] = useState(false);

  // ✅ Reset active image when product changes
  React.useEffect(() => {
    setActiveImg(0);
    setSelectedSize("");
  }, [id]);

  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!productRaw) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="text-center">
          <div className="text-xl font-bold">Product not found</div>
          <button
            onClick={() => nav(-1)}
            className="mt-3 rounded-lg border px-4 py-2"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const canAddToBag = Boolean(selectedSize);

  function scrollToSizes() {
    document
      .getElementById("sizes-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function handleAddToBag() {
    if (!selectedSize) {
      scrollToSizes();
      return;
    }
    alert(`Added to bag: ${product.title} (${selectedSize})`);
  }

  // ✅ Fallback: images nahi ho toh listing img use karo
  const carouselImages =
    product?.images?.length ? product.images : [product.img];

  return (
    <div className="bg-white min-h-screen">
      <TopBar onBack={() => nav(-1)} />

      <div className="mx-auto max-w-[560px]">
        <ImageCarousel
          images={carouselImages}
          title={product.title}
          tag={product.tag}
          rating={product.rating}
          ratingCount={product.ratingCount}
          activeImg={activeImg}
          setActiveImg={setActiveImg}
        />

        <PriceBlock
          brand={product.brand}
          title={product.title}
          price={product.price}
          mrp={product.mrp}
          off={product.off}
          lowAs={product.lowAs}
          boughtRecently={product.boughtRecently}
          fabricTag={product.fabricTag}
          onAddToBagTop={handleAddToBag}
        />

        <SizePicker
          sizes={product.sizes}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />

        <OffersRail offers={product.offers} />
        <PincodeCheck pincode={pincode} setPincode={setPincode} />
        <Highlights highlights={product.highlights} />

        <Accordions
          description={product.description}
          openDesc={openDesc}
          setOpenDesc={setOpenDesc}
          openReturns={openReturns}
          setOpenReturns={setOpenReturns}
        />

        <Reviews
          rating={product.rating}
          ratingCount={product.ratingCount}
          ratingBars={product.ratingBars}
          reviews={product.reviews}
        />

        <div className="px-4">
          <MiniProductRail title="Frequently Bought Together" tag="NEW" items={product.fbt} />
          <MiniProductRail title="You May Also Like" items={product.related} />
          <div className="h-24" />
        </div>
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-4 bottom-24 z-40 rounded-xl bg-gray-700 text-white px-3 py-2 text-xs font-extrabold shadow"
        >
          ↑ TOP
        </button>
      )}

      <StickyAddToBag
        price={product.price}
        canAddToBag={canAddToBag}
        onAddToBag={handleAddToBag}
        showHint={!canAddToBag}
      />
    </div>
  );
}
