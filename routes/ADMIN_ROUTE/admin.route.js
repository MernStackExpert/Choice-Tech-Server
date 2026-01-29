const express = require("express");
const verifyToken = require("../../middleware/verifyToken");
const verifyAdmin = require("../../middleware/verifyAdmin");
const { getAdminStats } = require("../../controllers/ADMIN/admin.controller");
const router = express.Router();

// Admin Overview Stats API
router.get("/stats", verifyToken, verifyAdmin, getAdminStats);

module.exports = router;