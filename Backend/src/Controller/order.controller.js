const mongoose = require("mongoose");
const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");
const ProductVariant = require("../models/ProductVariant");
const CustomDesign = require("../models/CustomDesignModel");
const Coupon = require("../models/CouponModel");

const createOrderFromCart = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod, couponCode } = req.body;
    const normalizedPaymentMethod = paymentMethod === "cod" ? "cod" : "online";
    const phone = String(shippingAddress?.phone || "").trim();
    const pincode = String(shippingAddress?.pincode || "").trim();
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ message: "Valid 10-digit mobile number is required" });
    }
    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({ message: "Valid 6-digit pincode is required" });
    }

    session.startTransaction();

    const cart = await Cart.findOne({ user: userId }).session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart is empty" });
    }

    const productItems = cart.items.filter((it) => it.type !== "custom");
    const customItems = cart.items.filter((it) => it.type === "custom");

    const variantIds = productItems.map((it) => it.variant).filter(Boolean);
    const variants = await ProductVariant.find({ _id: { $in: variantIds } })
      .populate("product")
      .session(session);
    const vmap = new Map(variants.map((v) => [v._id.toString(), v]));

    const customDesignIds = customItems.map((it) => it.customDesign).filter(Boolean);
    const customDesigns = await CustomDesign.find({
      _id: { $in: customDesignIds },
      user: userId,
    })
      .populate("template")
      .populate("selected.fabric")
      .session(session);
    const dmap = new Map(customDesigns.map((d) => [d._id.toString(), d]));

    const orderItems = [];
    let subtotalAmount = 0;

    for (const item of cart.items) {
      const qty = Math.max(1, Number(item.quantity) || 1);

      if (item.type === "custom") {
        const design = dmap.get(String(item.customDesign));
        if (!design) {
          await session.abortTransaction();
          return res.status(400).json({ message: "Some custom design is not available" });
        }

        const firstDesignImage =
          (Array.isArray(design.layers)
            ? design.layers.find((l) => l?.kind === "image" && l?.imageUrl)?.imageUrl
            : "") || "";

        const previewSnapshot = {
          front: design.preview?.front || design.template?.mockups?.front || "",
          back: design.preview?.back || design.template?.mockups?.back || "",
          left: design.preview?.left || design.template?.mockups?.left || "",
          right: design.preview?.right || design.template?.mockups?.right || "",
        };

        const unitPrice = Number(item.priceAtAdd || design.priceSnapshot?.total || design.template?.basePrice || 0);
        const lineTotal = unitPrice * qty;
        subtotalAmount += lineTotal;

        orderItems.push({
          type: "custom",
          customDesignId: design._id,
          title: design.template?.title || "Customized Product",
          image:
            previewSnapshot.front ||
            previewSnapshot.back ||
            firstDesignImage ||
            "",
          size: design.selected?.size || "",
          color: design.selected?.color || "",
          fabric: design.selected?.fabric?.name || "",
          customSnapshot: {
            selected: {
              color: design.selected?.color || "",
              size: design.selected?.size || "",
              fabric: design.selected?.fabric?.name || "",
            },
            layers: design.layers || [],
            preview: previewSnapshot,
          },
          unitPrice,
          quantity: qty,
          lineTotal,
        });
        continue;
      }

      const v = vmap.get(String(item.variant));
      if (!v || !v.isActive) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Some item is no longer available" });
      }

      if (v.stock < qty) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Not enough stock for ${v.sku || v._id}` });
      }

      const unitPrice = Number(item.priceAtAdd);
      const lineTotal = unitPrice * qty;
      subtotalAmount += lineTotal;

      orderItems.push({
        type: "product",
        variantId: v._id,
        productId: v.product._id,
        title: v.product.title,
        image: v.image || (v.product.images && v.product.images[0]) || "",
        size: v.size,
        color: v.color,
        unitPrice,
        quantity: qty,
        lineTotal,
      });
    }

    for (const item of productItems) {
      const updated = await ProductVariant.updateOne(
        { _id: item.variant, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session }
      );

      if (updated.modifiedCount !== 1) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Stock update failed (try again)" });
      }
    }

    if (customDesignIds.length) {
      await CustomDesign.updateMany(
        { _id: { $in: customDesignIds }, user: userId },
        { $set: { status: "ordered" } },
        { session }
      );
    }

    let appliedCouponCode = "";
    let discountAmount = 0;
    if (couponCode && String(couponCode).trim()) {
      const normalizedCode = String(couponCode).trim().toUpperCase();
      const coupon = await Coupon.findOne({ code: normalizedCode, isActive: true }).session(session);
      if (!coupon) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Invalid coupon" });
      }
      if (coupon.expiryDate < new Date()) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Coupon expired" });
      }
      if (subtotalAmount < Number(coupon.minCartAmount || 0)) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Minimum cart amount: ${coupon.minCartAmount}` });
      }

      const idx = (coupon.usageByUser || []).findIndex((u) => String(u?.user) === String(userId));
      const usedCount = idx >= 0 ? Number(coupon.usageByUser[idx]?.count || 0) : 0;
      const userLimit = coupon.perUserLimit == null ? 1 : Math.max(0, Number(coupon.perUserLimit || 0));
      if (userLimit > 0 && usedCount >= userLimit) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Coupon usage limit reached for this user" });
      }

      if (coupon.discountType === "flat") {
        discountAmount = Number(coupon.value || 0);
      } else {
        discountAmount = Math.round((subtotalAmount * Number(coupon.value || 0)) / 100);
        if (coupon.maxDiscount != null) {
          discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount || 0));
        }
      }
      discountAmount = Math.max(0, Math.min(discountAmount, subtotalAmount));
      appliedCouponCode = coupon.code;

      if (idx >= 0) {
        coupon.usageByUser[idx].count = usedCount + 1;
        coupon.usageByUser[idx].lastUsedAt = new Date();
      } else {
        coupon.usageByUser.push({ user: userId, count: 1, lastUsedAt: new Date() });
      }
      await coupon.save({ session });
    }

    const totalAmount = Math.max(0, subtotalAmount - discountAmount);

    const order = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          subtotalAmount,
          discountAmount,
          couponCode: appliedCouponCode,
          totalAmount,
          shippingAddress: shippingAddress || {},
          orderStatus: "pending",
          paymentStatus: "pending",
          paymentMethod: normalizedPaymentMethod,
        },
      ],
      { session }
    );

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save({ session });

    await session.commitTransaction();
    return res.status(201).json({ order: order[0] });
  } catch (err) {
    await session.abortTransaction();
    return res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json({ order });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const cancelMyOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (["cancelled", "delivered"].includes(order.orderStatus)) {
      return res.status(400).json({ message: `Order cannot be cancelled (status: ${order.orderStatus})` });
    }

    order.orderStatus = "cancelled";
    await order.save();

    for (const item of order.items) {
      if (item.type === "custom" || !item.variantId) continue;
      await ProductVariant.updateOne({ _id: item.variantId }, { $inc: { stock: item.quantity } });
    }

    return res.json({ message: "Order cancelled and stock restored", order });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const trackOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId }).select("orderStatus paymentStatus createdAt updatedAt");
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json({ tracking: order });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const confirmCodOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentStatus === "paid") {
      return res.status(400).json({ message: "Order is already paid" });
    }
    if (order.orderStatus === "cancelled") {
      return res.status(400).json({ message: "Cancelled order cannot be confirmed" });
    }

    order.paymentStatus = "pending";
    order.paymentMethod = "cod";
    order.orderStatus = "confirmed";
    await order.save();

    return res.json({ order, message: "COD order confirmed" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrderFromCart, getMyOrders, getOrderById, cancelMyOrder, trackOrder, confirmCodOrder };
