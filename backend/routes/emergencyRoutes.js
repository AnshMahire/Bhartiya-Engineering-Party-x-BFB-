const express = require("express");
const {
  createEmergency,
  getActiveEmergency,
  acceptEmergency,
  resetEmergency
} = require("../controllers/emergencyController");

const router = express.Router();

router.post("/", createEmergency);
router.get("/active", getActiveEmergency);
router.post("/:id/accept", acceptEmergency);
router.post("/reset", resetEmergency);

module.exports = router;
