const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const { 
  createUserInfo, 
  getAllUserInfo, 
  getUserInfoByEmail, 
  updateUserInfoById, 
  deleteUserInfoById 
} = require("../../controllers/user/userinfo.controller");
const verifyAdmin = require("../../middleware/verifyAdmin");

router.post("/", verifyToken, createUserInfo);

router.get("/", getAllUserInfo);

router.get("/:email", verifyToken, getUserInfoByEmail);

router.patch("/:id", verifyToken, updateUserInfoById);

router.delete("/:id", verifyToken, verifyAdmin, deleteUserInfoById);

module.exports = router;