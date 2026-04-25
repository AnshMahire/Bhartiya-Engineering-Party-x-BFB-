const express = require("express");
const { createEmergency, resetEmergency } = require("../controllers/emergencyController");

const router = express.Router();

router.post("/emergency", createEmergency);
router.post("/emergency/reset", resetEmergency);

module.exports = router;
