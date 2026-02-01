const express = require("express");
const { submitPayment, getMyPaymentHistory, getAllPaymentRequests, updatePaymentStatus, getPaymentDetails } = require("../../controllers/PAYMENTS/payment.controller");
const verifyToken = require("../../middleware/verifyToken");
const verifyAdmin = require("../../middleware/verifyAdmin");
const router = express.Router();


router.post("/submit", verifyToken, submitPayment);

router.get("/my-history", verifyToken, getMyPaymentHistory);

router.get("/all-requests", verifyToken, verifyAdmin, getAllPaymentRequests);

router.patch("/update-status", verifyToken, verifyAdmin, updatePaymentStatus);

router.get("/details/:id", verifyToken, getPaymentDetails);

module.exports = router;