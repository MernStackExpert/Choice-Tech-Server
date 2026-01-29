const express = require("express");
const router = express.Router();

const { 
    createOrder, 
    approvePayment, 
    updateOrderProgress, 
    getUserOrders, 
    getAllOrders, 
    getOrderDetails,
    cancelOrder
} = require("../../controllers/ORDER/order.controller");

const verifyToken = require("../../middleware/verifyToken");
const verifyAdmin = require("../../middleware/verifyAdmin");

router.post("/create", verifyToken, createOrder);

router.patch("/approve-payment", verifyToken, verifyAdmin, approvePayment);

router.patch("/update-progress", verifyToken, verifyAdmin, updateOrderProgress);

router.get("/all", verifyToken, verifyAdmin, getAllOrders);

router.get("/user/:userId", verifyToken, getUserOrders);

router.get("/details/:orderId", verifyToken, getOrderDetails);

router.patch("/cancel/:orderId", verifyToken, cancelOrder);

module.exports = router;