const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/verifyToken");
const { 
  createUserInfo, 
  getAllUserInfo, 
  updateUserInfoById, 
  deleteUserInfoById, 
  getUserInfoByUid
} = require("../../controllers/user/userinfo.controller");
const verifyAdmin = require("../../middleware/verifyAdmin");

router.post("/", verifyToken, createUserInfo);

router.get("/", verifyToken, verifyAdmin, getAllUserInfo);

router.get("/:uid",  getUserInfoByUid);

router.patch("/:id", verifyToken, updateUserInfoById);

router.delete("/:id", verifyToken, verifyAdmin, deleteUserInfoById);

module.exports = router;