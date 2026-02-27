const BulkOrder = require("../models/BulkOrderModel");

const createBulkOrder = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      notes,
      product,
      clothOption = "standard",
      quantity,
      pricing = {},
      images = [],
    } = req.body;

    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    if (!email?.trim()) return res.status(400).json({ message: "Email is required" });
    if (!["tshirt", "hoodie", "cap"].includes(product)) {
      return res.status(400).json({ message: "Invalid product" });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "At least one design image is required" });
    }

    const normalizedImages = images
      .filter((x) => x?.dataUrl)
      .slice(0, 8)
      .map((x) => ({
        name: x.name || "design",
        mimeType: x.mimeType || "",
        size: Number(x.size || 0),
        dataUrl: x.dataUrl,
      }));

    if (!normalizedImages.length) {
      return res.status(400).json({ message: "Valid design images are required" });
    }

    const bulkOrder = await BulkOrder.create({
      name: name.trim(),
      company: company?.trim() || "",
      email: email.trim().toLowerCase(),
      notes: notes?.trim() || "",
      product,
      clothOption: String(clothOption || "standard"),
      quantity: qty,
      pricing: {
        basePrice: Number(pricing?.basePrice || 0),
        discountPercent: Number(pricing?.discountPercent || 0),
        unitPrice: Number(pricing?.unitPrice || 0),
        totalPrice: Number(pricing?.totalPrice || 0),
      },
      images: normalizedImages,
    });

    return res.status(201).json({ bulkOrder });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const listBulkOrders = async (req, res) => {
  try {
    const bulkOrders = await BulkOrder.find().sort({ createdAt: -1 });
    return res.json({ bulkOrders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createBulkOrder, listBulkOrders };

