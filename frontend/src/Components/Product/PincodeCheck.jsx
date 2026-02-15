import React from "react";
import { Truck } from "lucide-react";

export default function PincodeCheck({ pincode, setPincode }) {
  return (
    <div className="mt-6 border-t border-gray-100 px-4 pt-5">
      <div className="text-lg font-extrabold text-gray-900">Check for Delivery Details</div>

      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-gray-200 px-3 py-2">
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="Enter Pincode"
          className="flex-1 outline-none text-sm"
        />
        <button className="text-sm font-extrabold text-blue-600">Check</button>
      </div>

      <div className="mt-3 rounded-xl bg-sky-100 px-3 py-2 text-sky-900 text-sm font-semibold flex items-center gap-2">
        <Truck className="h-5 w-5" />
        This product is eligible for <span className="font-extrabold">FREE SHIPPING</span>
      </div>
    </div>
  );
}
