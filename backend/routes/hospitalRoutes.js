const express = require("express");
const { getHospitalAlert, confirmHospital } = require("../controllers/hospitalController");

const router = express.Router();

router.get("/hospital-alert", getHospitalAlert);
router.patch("/hospital/confirm", confirmHospital);

module.exports = router;
