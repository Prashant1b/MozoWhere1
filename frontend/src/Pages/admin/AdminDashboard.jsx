import React from "react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="flex gap-6">
      
      <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage orders and operations from here.
        </p>
        <div className="mt-6">
          <Link
            to="/admin/orders"
            className="inline-flex rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Go to Orders
          </Link>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Product</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage Product from here.
        </p>
        <div className="mt-6">
          <Link
            to="/admin/products"
            className="inline-flex rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Go to Products
          </Link>
        </div>
      </div>

      <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Category</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage Categories from here.
        </p>
        <div className="mt-6">
          <Link
            to="/admin/categories"
            className="inline-flex rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Go to Categories
          </Link>
        </div>
      </div>

    </div>
  );
}