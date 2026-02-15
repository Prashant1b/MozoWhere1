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
        <Route path="/tshirt/:id" element={<ProductDetails />} />
        <Route path="/hoodie/:id" element={<HoodieProductDetails />} />
        <Route path="/shop" element={<ShoppingPage gender={shopIn} />} />
      </Routes>
    </>
  );
}
