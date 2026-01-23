const express = require("express");
const {
  getAllUsers,
  createUsers,
  updateProfile,
  deleteUser,
  adminUpdateUser
} = require("../../controllers/user/userdata.controller");

const verifyToken = require("../../middleware/verifyToken");
const verifyAdmin = require("../../middleware/verifyAdmin");


const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.post("/create", createUsers);
router.patch("/profile", verifyToken, updateProfile);
router.patch("/admin/:id", verifyToken, verifyAdmin, adminUpdateUser);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);


module.exports = router;
