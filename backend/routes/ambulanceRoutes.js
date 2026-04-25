const express = require("express");
const {
  getAmbulanceRequest,
  acceptAmbulanceRequest,
  pickupPatient
} = require("../controllers/ambulanceController");

const router = express.Router();

router.get("/ambulance-request", getAmbulanceRequest);
router.patch("/ambulance/accept", acceptAmbulanceRequest);
router.patch("/ambulance/pickup", pickupPatient);

module.exports = router;
