import React from "react";
import { ArrowLeft, Share2, Heart, ShoppingBag } from "lucide-react";

export default function TopBar({ onBack }) {
  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-[560px] px-3">
        <div className="h-12 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Share">
              <Share2 className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Wishlist">
              <Heart className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Cart">
              <ShoppingBag className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
