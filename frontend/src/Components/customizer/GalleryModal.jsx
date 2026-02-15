import React, { useMemo, useState } from "react";

export default function GalleryModal({ open, onClose, tabs, itemsByTab, onPick }) {
  const [tab, setTab] = useState(tabs?.[0]?.id || "worldcup");

  const items = useMemo(() => itemsByTab?.[tab] || [], [itemsByTab, tab]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl border">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 h-10 w-10 rounded-md border border-gray-200 hover:bg-gray-50 text-xl"
        >
          ×
        </button>

        <div className="p-8">
          <h3 className="text-xl font-semibold text-center text-gray-900">
            Pick from These Trendy Images
          </h3>

          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={[
                  "rounded-full border px-5 py-2 text-sm font-semibold",
                  tab === t.id
                    ? "border-gray-900 text-gray-900"
                    : "border-gray-300 text-gray-700",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => onPick(it)}
                className="border border-dashed border-gray-300 p-3 hover:bg-gray-50"
                title={it.title}
              >
                <img src={it.src} alt={it.title} className="h-20 w-full object-contain" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
