const express = require("express");
const usermiddleware = require("../middleware/usermiddleware");
const { applyCoupon } = require("../Controller/coupon.controller");

const router = express.Router();
router.post("/apply", usermiddleware, applyCoupon);

module.exports = router;