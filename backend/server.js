const express = require("express");
const cors = require("cors");

const emergencyRoutes = require("./routes/emergencyRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const { startTrackingSimulation } = require("./controllers/trackingController");
const { resetEmergencyState } = require("./utils/emergencyStateStore");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use(emergencyRoutes);
app.use(ambulanceRoutes);
app.use(hospitalRoutes);
app.use(trackingRoutes);

app.get("/ambulances", (_req, res) => {
  const ambulances = require("./data/ambulances");
  res.json({ status: "ok", ambulances });
});

app.get("/hospitals", (_req, res) => {
  const hospitals = require("./data/hospitals");
  res.json({ status: "ok", hospitals });
});

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    message: "Smart Emergency Coordination API running"
  });
});

resetEmergencyState();
startTrackingSimulation();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
