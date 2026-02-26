import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";

export default function AdminTopbar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="font-bold text-gray-900">Admin Console</div>
        <div className="text-sm text-gray-600">
          {user?.firstname || user?.emailid || "Admin"}
        </div>
      </div>
    </div>
  );
}