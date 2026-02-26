const express = require("express");
const usermiddleware= require("../middleware/usermiddleware");
const {
  getMyCart,
  addToCart,
  updateCartItemQty,
  removeCartItem,
  clearCart,
} = require("../Controller/cart.controller");
const CustomCustomizer = require("../Controller/cart.custom.controller");

const router = express.Router();

router.get("/", usermiddleware, getMyCart);
router.post("/add", usermiddleware, addToCart);
router.put("/item", usermiddleware, updateCartItemQty);
router.delete("/item/:variantId", usermiddleware, removeCartItem);
router.delete("/clear", usermiddleware, clearCart);
router.post("/add-custom", usermiddleware, CustomCustomizer.addCustomToCart);

module.exports = router;