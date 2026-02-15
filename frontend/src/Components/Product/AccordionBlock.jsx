import React from "react";
import { ChevronDown } from "lucide-react";

function Accordion({ title, subtitle, open, onToggle, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white mb-3 overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 flex items-center justify-between">
        <div className="text-left">
          <div className="text-sm font-extrabold text-gray-900">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
        <ChevronDown className={["h-5 w-5 transition", open ? "rotate-180" : ""].join(" ")} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function MiniIconCard({ title }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 text-center text-[11px] text-gray-600">
      <div className="h-8 w-8 mx-auto rounded-full bg-gray-100" />
      <div className="mt-2 font-semibold">{title}</div>
    </div>
  );
}

export default function Accordions({
  description,
  openDesc,
  setOpenDesc,
  openReturns,
  setOpenReturns,
}) {
  return (
    <div className="mt-6 border-t border-gray-100 px-4 pt-5">
      <Accordion
        title="Product Description"
        subtitle="Manufacture, Care and Fit"
        open={openDesc}
        onToggle={() => setOpenDesc((v) => !v)}
      >
        <div className="text-sm text-gray-600 leading-relaxed">{description}</div>
      </Accordion>

      <Accordion
        title="15 Days Returns & Exchange"
        subtitle="Know about return & exchange policy"
        open={openReturns}
        onToggle={() => setOpenReturns((v) => !v)}
      >
        <div className="text-sm text-gray-600 leading-relaxed">
          Easy returns & exchanges within 15 days. Product must be unused with tags intact.
        </div>
      </Accordion>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <MiniIconCard title="100% Genuine Product" />
        <MiniIconCard title="100% Secure Payment" />
        <MiniIconCard title="Easy Returns & Instant Refunds" />
      </div>
    </div>
  );
}
