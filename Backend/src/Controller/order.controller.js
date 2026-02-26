const mongoose = require("mongoose");
const Cart = require("../models/CartModel");
const Order = require("../models/OrderModel");
const ProductVariant = require("../models/ProductVariant");

const createOrderFromCart = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const userId = req.user._id;
    const { shippingAddress } = req.body;

    session.startTransaction();

    const cart = await Cart.findOne({ user: userId }).session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart is empty" });
    }

    // fetch all variants with product
    const variantIds = cart.items.map((it) => it.variant);
    const variants = await ProductVariant.find({ _id: { $in: variantIds } })
      .populate("product")
      .session(session);

    // map for fast lookup
    const vmap = new Map(variants.map((v) => [v._id.toString(), v]));

    // build items + stock check
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const v = vmap.get(item.variant.toString());
      if (!v || !v.isActive) {
        await session.abortTransaction();
        return res.status(400).json({ message: "Some item is no longer available" });
      }

      if (v.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Not enough stock for ${v.sku || v._id}` });
      }

      const unitPrice = item.priceAtAdd; 
      const lineTotal = unitPrice * item.quantity;
      totalAmount += lineTotal;

      orderItems.push({
        variantId: v._id,
        productId: v.product._id,
        title: v.product.title,
        image: v.image || (v.product.images && v.product.images[0]) || "",
        size: v.size,
        color: v.color,
        unitPrice,
        quantity: item.quantity,
        lineTotal,
      });
    }

    // ✅ stock decrease (atomic within transaction)
    for (const item of cart.items) {
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

    const order = await Order.create(
      [
        {
          user: userId,
          items: orderItems,
          totalAmount,
          shippingAddress: shippingAddress || {},
          orderStatus: "pending",
          paymentStatus: "pending",
        },
      ],
      { session }
    );

    // clear cart
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

    // if already paid -> you may want refund flow, but still allow cancel (policy-based)
    order.orderStatus = "cancelled";
    await order.save();

    // ✅ restore stock
    for (const item of order.items) {
      await ProductVariant.updateOne(
        { _id: item.variantId },
        { $inc: { stock: item.quantity } }
      );
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

module.exports = { createOrderFromCart, getMyOrders, getOrderById,
    cancelMyOrder,trackOrder  };