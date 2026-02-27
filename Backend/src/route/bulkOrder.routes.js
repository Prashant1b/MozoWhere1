const express = require("express");
const adminmiddleware = require("../middleware/adminmiddleware");
const { createBulkOrder, listBulkOrders } = require("../Controller/bulkOrder.controller");

const router = express.Router();

router.post("/", createBulkOrder);
router.get("/", adminmiddleware, listBulkOrders);

module.exports = router;

