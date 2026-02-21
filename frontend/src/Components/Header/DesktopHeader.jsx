import React from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag, Smartphone, User } from "lucide-react";

export default function DesktopHeader({ menuLinks, mobileShopIn, setMobileShopIn }) {
  return (
    <div className="hidden md:block">
      {/* Top Utility Bar */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-9 items-center justify-between text-[12px] text-gray-600">
            <div className="flex items-center gap-5 whitespace-nowrap">
              <a href="#" className="hover:text-black">Offers</a>
              <a href="#" className="hover:text-black">Fanbook</a>
              <a href="#" className="inline-flex items-center hover:text-black"></a>
              <a href="#" className="hover:text-black">Find a store near me</a>
            </div>

            <div className="flex items-center gap-5 whitespace-nowrap">
              <a href="#" className="hover:text-black">Contact Us</a>
              <a href="#" className="hover:text-black">Track Order</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center gap-6">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <div className="text-2xl font-black tracking-tight text-black">
                {/* Put your logo text/image here */}
                MOZOWHERE <span className="align-super text-[10px] font-bold">®</span>
              </div>
            </Link>

            {/* Primary Nav */}
            <nav className="flex items-center gap-6 text-[14px] font-semibold tracking-wide text-gray-900 whitespace-nowrap">
              <Link to="/shop" className="hover:text-black">MEN</Link>
              <Link to="/shop" className="hover:text-black">WOMEN</Link>
              <Link to="/custom-tshirts" className="hover:text-black">CUSTOMIZE</Link>
            </nav>

            <div className="flex-1" />

            {/* Search */}
            <div className="w-full max-w-xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by products"
                  className="h-10 w-full rounded-md bg-gray-100 pl-10 pr-3 text-[14px] text-gray-900 placeholder:text-gray-500 outline-none ring-1 ring-transparent focus:bg-white focus:ring-gray-200"
                />
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-3 text-gray-900 whitespace-nowrap">
              <div className="h-6 w-px bg-gray-200" />
              <button className="p-2 hover:bg-gray-100 rounded-md" aria-label="Account">
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-md" aria-label="Cart">
                <ShoppingBag className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Row */}
      <div className="flex-1 overflow-x-auto">
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-16 items-center gap-4 p-1">

              {/* MEN/WOMEN pill */}
              <div className="grid grid-cols-2 shrink-0">
                <button
                  onClick={() => setMobileShopIn("Men")}
                  className={[
                    "rounded-full py-3 px-8 text-[15px] font-bold transition whitespace-nowrap",
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
                    "rounded-full py-3 px-8 text-[15px] font-bold transition whitespace-nowrap",
                    mobileShopIn === "Women"
                      ? "bg-[#FFD23D] text-gray-900 shadow"
                      : "bg-transparent text-gray-700",
                  ].join(" ")}
                >
                  WOMEN
                </button>
              </div>

              {/* Scrollable menu */}
              <nav className="flex items-center gap-10 text-[16px] font-semibold text-gray-900 whitespace-nowrap min-w-max">
                {menuLinks.map((item) => (
                  <Link key={item.label} to={item.to} className="hover:text-black">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
