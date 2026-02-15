import React from "react";
import { ShoppingBag } from "lucide-react";
import { inr } from "../../utils/helpers";

export default function StickyAddToBag({ price, canAddToBag, onAddToBag, showHint }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div className="mx-auto max-w-[560px] px-4 py-3">
        <button
          onClick={onAddToBag}
          className={[
            "w-full rounded-xl py-3 font-extrabold flex items-center justify-center gap-2",
            canAddToBag ? "bg-[#FFD23D] text-gray-900" : "bg-gray-200 text-gray-600",
          ].join(" ")}
        >
          <ShoppingBag className="h-5 w-5" />
          ADD TO BAG {inr(price)}
        </button>

        {showHint && (
          <div className="mt-2 text-xs text-gray-500 text-center">
            Please select a size to continue
          </div>
        )}
      </div>
    </div>
  );
}
