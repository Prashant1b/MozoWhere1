import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import AdminTopbar from "../../Components/admin/AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-w-0">
          <AdminTopbar />
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}