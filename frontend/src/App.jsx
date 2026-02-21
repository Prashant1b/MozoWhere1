import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import CustomizeListingPage from "./Pages/CustomizeListingPage";
import CustomizerPage from "./Pages/CustomizerPage";
import Home from "./Components/Home";
import MozowhereResponsiveHeader from "./Components/Header/MozowhereResponsiveHeader";
import BulkOrder from "./Pages/Bulkorderpage";
import ProductDetails from "./Pages/ProductDetails";
import HoodieProductDetails from "./Pages/HoodieProductDetails";
import ShoppingPage from "./Pages/ShoppingPage";
import Product from "./Pages/TshirtProduct";
import ProductCard from "./Pages/HoodieProduct"
import TrendingCategoriesPage from "./Pages/TrendingPage";
import CategoryListing from "./Pages/CategoryListing";
import NotFound from "./Pages/PagenotFound";

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
        <Route path="/customizer" element={<CustomizerPage />} />
        <Route path="/tshirt" element={<Product gender={shopIn}/>}/>
        <Route path="/hoodie" element={<ProductCard gender={shopIn}/>}/>
        <Route path="/tshirt/:id" element={<ProductDetails />} />
        <Route path="/hoodie/:id" element={<HoodieProductDetails />} />
        <Route path="/shop" element={<ShoppingPage gender={shopIn} />} />
        <Route path="/trending" element={<TrendingCategoriesPage />} />
       <Route path="/category/:slug" element={<CategoryListing gender={shopIn}/>} />
       <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
  );
}
