import React from "react";

export default function Highlights({ highlights }) {
  return (
    <div className="mt-6 border-t border-gray-100 px-4 pt-5">
      <div className="text-lg font-extrabold text-gray-900">Key Highlights</div>

      <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-2 gap-5 text-sm">
          {highlights.map((h) => (
            <div key={h.label}>
              <div className="text-gray-400">{h.label}</div>
              <div className="mt-1 font-extrabold text-gray-900">{h.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
