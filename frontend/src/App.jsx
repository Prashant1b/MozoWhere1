import { Routes, Route } from "react-router-dom";
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
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./Pages/admin/AdminLayout";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminOrdersPage from "./Pages/admin/AdminOrdersPage";
import AdminProductsPage from "./Pages/admin/AdminProductsPage";
import AdminCategoriesPage from "./Pages/admin/AdminCategoriesPage";
import AdminCustomizeTemplatesPage from "./Pages/admin/AdminCustomizeTemplatesPage";
import AdminCreateAdminPage from "./Pages/admin/AdminCreateAdminPage";
import AdminVariantsPage from "./Pages/admin/AdminVariantsPage";
import ShopNowSections from "./Pages/ShopNowSections";
import ProductDetailMobile from "./Pages/ProductDetailMobile";

export default function App() {
  const [shopIn, setShopIn] = useState("Men"); // ✅ Men/Women state in App

  return (
    <>
    <MozowhereResponsiveHeader
        mobileShopIn={shopIn}
        setMobileShopIn={setShopIn}
      />
      <Routes>
        <Route path="/" element={<Home gender={shopIn} />} />
        <Route path="/custom-tshirts" element={<CustomizeListingPage />} />
        <Route path="/bulk-order" element={<BulkOrder />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/customizer" element={<CustomizerPage />} />
        <Route path="/trending" element={<TrendingCategoriesPage />} />
        <Route path="/shop" element={<ShopNowSections />} />
      <Route path="/product/:slug" element={<ProductDetailMobile />} />

<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="orders" element={<AdminOrdersPage />} />
  <Route path="products" element={<AdminProductsPage/>} />
  <Route path="categories" element={<AdminCategoriesPage />} />
  <Route path="customize-templates" element={<AdminCustomizeTemplatesPage />} />
  <Route path="admins/create" element={<AdminCreateAdminPage />} />
  <Route path="/admin/variants" element={<AdminVariantsPage/>} />
</Route>
       <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
  );
}
