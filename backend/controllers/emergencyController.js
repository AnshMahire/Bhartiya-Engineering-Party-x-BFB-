const ambulances = require("../data/ambulances");
const hospitals = require("../data/hospitals");
const traffic = require("../data/traffic");
const { assignEmergency } = require("./decisionEngine");
const {
  getNextRequestId,
  readEmergencyState,
  writeEmergencyState,
  resetEmergencyState
} = require("../utils/emergencyStateStore");

function toNumber(value) {
  return Number(Number(value).toFixed(6));
}

function findAmbulanceById(id) {
  return ambulances.find((item) => item.id === id);
}

function createEmergency(req, res) {
  const { patientName, lat, lng } = req.body || {};

  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({
      status: "error",
      message: "lat and lng are required numbers"
    });
  }

  const existing = readEmergencyState();
  if (existing.requestId && existing.emergencyStatus !== "completed" && existing.emergencyStatus !== "idle") {
    return res.status(409).json({
      status: "error",
      message: "An emergency is already active",
      emergency: existing
    });
  }

  const patientLocation = { lat: toNumber(lat), lng: toNumber(lng) };

  const assignment = assignEmergency({
    patientLocation,
    ambulances,
    hospitals,
    trafficZones: traffic
  });

  if (!assignment.success) {
    return res.status(503).json({
      status: "error",
      message: assignment.reason
    });
  }

  const selectedAmbulance = findAmbulanceById(assignment.ambulance.id);
  selectedAmbulance.available = false;

  const requestId = getNextRequestId();

  const nextState = {
    requestId,
    emergencyStatus: "ambulance_assigned",
    phase: "to_patient",
    patient: {
      name: patientName || "Unknown Patient",
      lat: patientLocation.lat,
      lng: patientLocation.lng,
      status: "waiting"
    },
    ambulance: {
      id: assignment.ambulance.id,
      driverName: assignment.ambulance.driverName,
      lat: assignment.ambulance.lat,
      lng: assignment.ambulance.lng,
      status: "assigned",
      acceptedAt: null,
      pickedUpAt: null
    },
    hospital: {
      id: assignment.hospital.id,
      name: assignment.hospital.name,
      lat: assignment.hospital.lat,
      lng: assignment.hospital.lng,
      beds: assignment.hospital.beds,
      icu: assignment.hospital.icu,
      status: "alerted",
      confirmed: false
    },
    eta: assignment.totalEta,
    route: {
      ambulanceStart: {
        lat: assignment.ambulance.lat,
        lng: assignment.ambulance.lng
      },
      patient: {
        lat: patientLocation.lat,
        lng: patientLocation.lng
      },
      hospital: {
        lat: assignment.hospital.lat,
        lng: assignment.hospital.lng
      }
    },
    routes: {
      shortestRoute: assignment.routes?.shortestRoute || null,
      fastestRoute: assignment.routes?.fastestRoute || null,
      recommendedRoute: assignment.routes?.recommendedRoute || null,
      estimatedTimeSavedMinutes: assignment.routes?.estimatedTimeSavedMinutes || 0
    }
  };

  const written = writeEmergencyState(nextState);

  return res.status(201).json({
    status: "assigned",
    emergency: written
  });
}

function resetEmergency(req, res) {
  const current = readEmergencyState();

  if (current.ambulance?.id) {
    const selectedAmbulance = findAmbulanceById(current.ambulance.id);
    if (selectedAmbulance) {
      selectedAmbulance.available = true;
      if (current.route?.ambulanceStart?.lat !== null && current.route?.ambulanceStart?.lng !== null) {
        selectedAmbulance.lat = current.route.ambulanceStart.lat;
        selectedAmbulance.lng = current.route.ambulanceStart.lng;
      }
    }
  }

  const reset = resetEmergencyState();
  return res.json({
    status: "ok",
    emergency: reset
  });
}

module.exports = {
  createEmergency,
  resetEmergency
};
