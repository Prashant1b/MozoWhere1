import React from "react";
import { Search, Heart, ShoppingBag, Menu } from "lucide-react";
import MobileDrawer from "./MobileDrawer";
import { Link } from "react-router-dom";

export default function MobileHeader({
  mobileMenuOpen,
  setMobileMenuOpen,
  mobileShopIn,
  setMobileShopIn,
  userName,
}) {
  return (
    <div className="md:hidden">
      {/* Yellow top bar */}
      <div className="bg-[#FFD23D]">
        <div className="mx-auto max-w-7xl px-3">
          <div className="flex h-14 items-center justify-between">
            {/* left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md active:scale-[0.98]"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-black" />
              </button>

              {/* logo dots like screenshot */}
               <div className="flex items-center gap-2 font-extrabold">
            <Link to="/" className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-amber-300 to-orange-400 text-[#1b1207] shadow-[0_10px_25px_rgba(255,184,77,.12)]">
              M
            </Link>
            </div>
            </div>

            {/* right icons */}
            <div className="flex items-center gap-1">
              <button className="p-2 rounded-md" aria-label="Search">
                <Search className="h-6 w-6 text-black" />
              </button>
              <button className="p-2 rounded-md" aria-label="Wishlist">
                <Heart className="h-6 w-6 text-black" />
              </button>
              <button className="p-2 rounded-md" aria-label="Cart">
                <ShoppingBag className="h-6 w-6 text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Men/Women pill row */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-3 pt-3 pb-2">
          <div className="rounded-full bg-gray-100 p-1 shadow-sm">
            <div className="grid grid-cols-2">
              <button
                onClick={() => setMobileShopIn("Men")}
                className={[
                  "rounded-full py-3 text-[15px] font-bold transition",
                  mobileShopIn === "Men"
                    ? "bg-[#FFD23D] text-gray-900 shadow"
                    : "bg-transparent text-gray-700",
                ].join(" ")}
              >
                MEN
              </button>
              <button
                onClick={() => setMobileShopIn("Women")}
                className={[
                  "rounded-full py-3 text-[15px] font-bold transition",
                  mobileShopIn === "Women"
                    ? "bg-[#FFD23D] text-gray-900 shadow"
                    : "bg-transparent text-gray-700",
                ].join(" ")}
              >
                WOMEN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        userName={userName}
      />
    </div>
  );
}
