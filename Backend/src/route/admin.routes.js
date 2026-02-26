const express = require("express");
const adminmiddleware = require("../middleware/adminmiddleware");
const { updateOrderStatus, listAllOrders } = require("../Controller/admin.controller");

const router = express.Router();

router.get("/orders", adminmiddleware, listAllOrders);
router.put("/orders/:id/status", adminmiddleware, updateOrderStatus);

module.exports = router;