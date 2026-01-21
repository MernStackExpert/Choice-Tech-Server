const express = require("express");
const { updateMissionVision, getHomeContent, addFAQ, updateFAQ, deleteFAQ, createMissionVision } = require("../../controllers/Home/homeSection.controller");
const router = express.Router();

router.get("/", getHomeContent);

router.patch("/mission-vision", updateMissionVision);

router.post("/faq", addFAQ);

router.post("/mission-vision", createMissionVision);

router.patch("/faq/:id", updateFAQ);

router.delete("/faq/:id", deleteFAQ);

module.exports = router;