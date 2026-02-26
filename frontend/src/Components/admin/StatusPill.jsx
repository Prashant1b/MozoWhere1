import React from "react";

const map = {
  pending: "bg-gray-100 text-gray-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-amber-100 text-amber-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function StatusPill({ status }) {
  const cls = map[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${cls}`}>
      {String(status || "pending").toUpperCase()}
    </span>
  );
}