const express = require("express");
const usermiddleware = require("../middleware/usermiddleware");
const {
  createDesign,
  getMyDesign,
  updateDesign,
  setReady,
} = require("../Controller/customize.design.controller");

const router = express.Router();

router.post("/", usermiddleware, createDesign);           
router.get("/:id", usermiddleware, getMyDesign);         
router.put("/:id", usermiddleware, updateDesign);         
router.post("/:id/ready", usermiddleware, setReady);      

module.exports = router;