const Coupon = require("../models/CouponModel");
const Cart = require("../models/CartModel");

const applyCoupon = async (req, res) => {
  try {
    const userId = req.user._id;
    const { code } = req.body;

    if (!code?.trim()) return res.status(400).json({ message: "Coupon code required" });

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: "Invalid coupon" });

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart empty" });

    if (cart.totalAmount < coupon.minCartAmount) {
      return res.status(400).json({ message: `Minimum cart amount: ${coupon.minCartAmount}` });
    }

    let discount = 0;

    if (coupon.discountType === "flat") {
      discount = coupon.value;
    } else {
      discount = Math.round((cart.totalAmount * coupon.value) / 100);
      if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
    }

    discount = Math.max(0, Math.min(discount, cart.totalAmount));
    const payable = cart.totalAmount - discount;

    return res.json({ coupon: coupon.code, discount, payable });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { applyCoupon };