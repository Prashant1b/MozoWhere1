const mongoose = require("mongoose");

const bulkImageSchema = new mongoose.Schema(
  {
    name: String,
    mimeType: String,
    size: Number,
    dataUrl: String,
  },
  { _id: false }
);

const bulkOrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    notes: { type: String, trim: true },

    product: { type: String, enum: ["tshirt", "hoodie", "cap"], required: true },
    clothOption: { type: String, default: "standard" },
    quantity: { type: Number, required: true, min: 1 },

    pricing: {
      basePrice: Number,
      discountPercent: Number,
      unitPrice: Number,
      totalPrice: Number,
    },

    images: { type: [bulkImageSchema], default: [] },
    status: {
      type: String,
      enum: ["new", "contacted", "quoted", "processing", "closed"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BulkOrder", bulkOrderSchema);

