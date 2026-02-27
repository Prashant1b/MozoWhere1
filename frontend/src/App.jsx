import { Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import CustomizeListingPage from "./Pages/CustomizeListingPage";
import CustomizerPage from "./Pages/CustomizerPage";
import Home from "./Components/Home";
import MozowhereResponsiveHeader from "./Components/Header/MozowhereResponsiveHeader";
import BulkOrder from "./Pages/Bulkorderpage";
import TrendingCategoriesPage from "./Pages/TrendingPage";
import NotFound from "./Pages/PagenotFound";
import Login from "./Pages/Login";
import Signup from "./Pages/SignupPage";
import Profile from "./Pages/Profile";
import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminOrdersPage from "./Pages/admin/AdminOrdersPage";
import AdminProductsPage from "./Pages/admin/AdminProductsPage";
import AdminCategoriesPage from "./Pages/admin/AdminCategoriesPage";
import AdminCustomizeTemplatesPage from "./Pages/admin/AdminCustomizeTemplatesPage";
import AdminCreateAdminPage from "./Pages/admin/AdminCreateAdminPage";
import AdminVariantsPage from "./Pages/admin/AdminVariantsPage";
import AdminCouponsPage from "./Pages/admin/AdminCouponsPage";
import AdminBulkOrdersPage from "./Pages/admin/AdminBulkOrdersPage";
import ShopNowSections from "./Pages/ShopNowSections";
import ProductDetailMobile from "./Pages/ProductDetailMobile";
import MyOrdersPage from "./Pages/MyOrdersPage";

export default function App() {
  const [shopIn, setShopIn] = useState("Men");
  const { pathname } = useLocation();

  const hideHeaderOn = new Set(["/login", "/signup"]);
  const showHeader = !hideHeaderOn.has(pathname);

  return (
    <>
      {showHeader && (
        <MozowhereResponsiveHeader
          mobileShopIn={shopIn}
          setMobileShopIn={setShopIn}
        />
      )}

      <Routes>
        <Route path="/" element={<Home gender={shopIn} />} />
        <Route path="/custom-tshirts" element={<CustomizeListingPage />} />
        <Route path="/bulk-order" element={<BulkOrder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/customizer" element={<CustomizerPage />} />
        <Route path="/customizer/:slug" element={<CustomizerPage />} />
        <Route path="/trending" element={<TrendingCategoriesPage />} />
        <Route path="/shop" element={<ShopNowSections selectedGender={shopIn} />} />
        <Route path="/product/:slug" element={<ProductDetailMobile />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="customize-templates" element={<AdminCustomizeTemplatesPage />} />
            <Route path="admins/create" element={<AdminCreateAdminPage />} />
            <Route path="variants" element={<AdminVariantsPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
            <Route path="bulk-orders" element={<AdminBulkOrdersPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
