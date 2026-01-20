const express = require("express");
const {
  getAllPricing,
  addPricing,
  updatePricing,
  deletePricing,
} = require("../../controllers/Home/pricingCard.controller");
const router = express.Router();

router.get("/", getAllPricing);

router.post("/add", addPricing);

router.put("/update/:id", updatePricing);

router.delete("/delete/:id", deletePricing);

module.exports = router;
