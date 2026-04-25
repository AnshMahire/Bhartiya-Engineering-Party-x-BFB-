const express = require("express");
const hospitals = require("../data/hospitals");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    hospitals
  });
});

module.exports = router;
