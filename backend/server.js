const express = require("express");
const cors = require("cors");

const emergencyRoutes = require("./routes/emergencyRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/emergency", emergencyRoutes);
app.use("/ambulances", ambulanceRoutes);
app.use("/hospitals", hospitalRoutes);

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "AI Smart Emergency Response API running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
