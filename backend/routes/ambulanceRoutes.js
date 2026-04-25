const express = require("express");
const ambulances = require("../data/ambulances");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    ambulances
  });
});

module.exports = router;
