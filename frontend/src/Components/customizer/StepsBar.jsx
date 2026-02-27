import React from "react";

export default function StepsBar({ step }) {
  const steps = ["Pick Options", "Design", "Preview"];

  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {steps.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;

            return (
              <div
                key={label}
                className={[
                  "flex items-center gap-2 rounded-xl border px-3 py-2 sm:px-4",
                  done
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-500",
                ].join(" ")}
              >
                <div
                  className={[
                    "grid h-6 w-6 place-items-center rounded-full text-xs font-extrabold",
                    done ? "bg-emerald-600 text-white" : active ? "bg-white text-slate-900" : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  {done ? "OK" : n}
                </div>
                <div className="text-xs font-bold uppercase tracking-wide sm:text-sm">{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
