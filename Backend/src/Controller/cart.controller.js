const Cart = require("../models/CartModel");
const ProductVariant = require("../models/ProductVariant");

// helper to compute current unit price
const getVariantUnitPrice = async (variantId) => {
  const variant = await ProductVariant.findById(variantId).populate("product");
  if (!variant || !variant.isActive) return null;

  const unitPrice =
    typeof variant.price === "number" ? variant.price : variant.product.basePrice;

  return { variant, unitPrice };
};

const recalcCart = async (cart) => {
  cart.totalAmount = cart.items.reduce((sum, it) => sum + it.priceAtAdd * it.quantity, 0);
  await cart.save();
  return cart;
};

const getMyCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.variant",
      populate: { path: "product" },
    });

    return res.json({ cart: cart || { user: userId, items: [], totalAmount: 0 } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { variantId, quantity = 1 } = req.body;

    if (!variantId) return res.status(400).json({ message: "variantId is required" });
    const qty = Math.max(1, Number(quantity) || 1);

    const data = await getVariantUnitPrice(variantId);
    if (!data) return res.status(404).json({ message: "Variant not found" });

    const { variant, unitPrice } = data;

    if (variant.stock < qty) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [], totalAmount: 0 });

    const idx = cart.items.findIndex((it) => it.variant.toString() === variantId);

    if (idx >= 0) {
      const newQty = cart.items[idx].quantity + qty;
      if (variant.stock < newQty) return res.status(400).json({ message: "Not enough stock" });

      cart.items[idx].quantity = newQty;
      cart.items[idx].priceAtAdd = unitPrice; // refresh snapshot price
    } else {
      cart.items.push({ variant: variantId, quantity: qty, priceAtAdd: unitPrice });
    }

    cart = await recalcCart(cart);
    return res.json({ cart });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const updateCartItemQty = async (req, res) => {
  try {
    const userId = req.user._id;
    const { variantId, quantity } = req.body;

    if (!variantId) return res.status(400).json({ message: "variantId is required" });

    const qty = Number(quantity);
    if (!Number.isFinite(qty)) return res.status(400).json({ message: "quantity invalid" });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const idx = cart.items.findIndex((it) => it.variant.toString() === variantId);
    if (idx < 0) return res.status(404).json({ message: "Item not found in cart" });

    if (qty <= 0) {
      cart.items.splice(idx, 1);
      await recalcCart(cart);
      return res.json({ cart });
    }

    const data = await getVariantUnitPrice(variantId);
    if (!data) return res.status(404).json({ message: "Variant not found" });

    const { variant, unitPrice } = data;
    if (variant.stock < qty) return res.status(400).json({ message: "Not enough stock" });

    cart.items[idx].quantity = qty;
    cart.items[idx].priceAtAdd = unitPrice;

    await recalcCart(cart);
    return res.json({ cart });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /cart/item/:variantId
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { variantId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((it) => it.variant.toString() !== variantId);
    await recalcCart(cart);

    return res.json({ cart });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// DELETE /cart/clear
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.json({ cart: { user: userId, items: [], totalAmount: 0 } });

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.json({ cart });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMyCart,
  addToCart,
  updateCartItemQty,
  removeCartItem,
  clearCart,
};