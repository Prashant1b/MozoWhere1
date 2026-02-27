import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, Folder, Shirt, UserPlus, Layers, BadgePercent, ClipboardList } from "lucide-react";

const linkBase =
    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold";
const active = "bg-black text-white";
const inactive = "text-gray-700 hover:bg-gray-100";

export default function AdminSidebar() {
    return (
        <aside className="hidden md:block w-64 shrink-0 border-r border-gray-200 bg-white p-4">
            <div className="text-xl font-black tracking-tight">
                Admin <span className="text-gray-400">Panel</span>
            </div>

            <nav className="mt-6 space-y-2">
                <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                        `${linkBase} ${isActive ? active : inactive}`
                    }
                >
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/admin/orders"
                    className={({ isActive }) =>
                        `${linkBase} ${isActive ? active : inactive}`
                    }
                >
                    <Package className="h-5 w-5" />
                    Orders
                </NavLink>

                <NavLink
                    to="/admin/products"
                    className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
                >
                    <ShoppingBag className="h-5 w-5" />
                    Products
                </NavLink>

                <NavLink
                    to="/admin/categories"
                    className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
                >
                    <Folder className="h-5 w-5" />
                    Categories
                </NavLink>

                <NavLink
                    to="/admin/customize-templates"
                    className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
                >
                    <Shirt className="h-5 w-5" />
                    Customize Templates
                </NavLink>

                <NavLink
  to="/admin/admins/create"
  className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
>
  <UserPlus className="h-5 w-5" />
  Create Admin
</NavLink>

<NavLink
  to="/admin/variants"
  className={({ isActive }) =>
    `${linkBase} ${isActive ? active : inactive}`
  }
>
  <Layers className="h-5 w-5" />
  Variants
</NavLink>

<NavLink
  to="/admin/coupons"
  className={({ isActive }) =>
    `${linkBase} ${isActive ? active : inactive}`
  }
>
  <BadgePercent className="h-5 w-5" />
  Coupons
</NavLink>

<NavLink
  to="/admin/bulk-orders"
  className={({ isActive }) =>
    `${linkBase} ${isActive ? active : inactive}`
  }
>
  <ClipboardList className="h-5 w-5" />
  Bulk Orders
</NavLink>
            </nav>
        </aside>
    );
}
