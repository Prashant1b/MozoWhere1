const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: String,
    image: String,

    size: String,
    color: String,

    unitPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: { type: [orderItemSchema], default: [] },
    totalAmount: { type: Number, required: true },

    shippingAddress: {
      name: String,
      phone: String,
      pincode: String,
      addressLine: String,
      city: String,
      state: String,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);