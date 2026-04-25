const ambulances = require("../data/ambulances");
const hospitals = require("../data/hospitals");
const traffic = require("../data/traffic");
const { assignEmergency } = require("./decisionEngine");

let activeEmergency = null;
let emergencyCount = 1;

function toFixedLocation(lat, lng) {
  return {
    lat: Number(Number(lat).toFixed(6)),
    lng: Number(Number(lng).toFixed(6))
  };
}

function lerp(start, end, ratio) {
  return start + (end - start) * ratio;
}

function interpolatePoint(start, end, ratio) {
  return toFixedLocation(lerp(start.lat, end.lat, ratio), lerp(start.lng, end.lng, ratio));
}

function buildResponse(emergency) {
  if (!emergency) {
    return null;
  }

  return {
    emergencyId: emergency.id,
    status: emergency.status,
    statusMessage: emergency.statusMessage,
    patient: emergency.patient,
    ambulance: {
      id: emergency.ambulance.id,
      driverName: emergency.ambulance.driverName,
      lat: emergency.ambulance.lat,
      lng: emergency.ambulance.lng
    },
    hospital: emergency.hospital,
    eta: emergency.eta,
    etaBreakdown: emergency.etaBreakdown,
    timestamps: {
      createdAt: emergency.createdAt,
      acceptedAt: emergency.acceptedAt,
      pickedAt: emergency.pickedAt,
      completedAt: emergency.completedAt
    }
  };
}

function updateEmergencyState() {
  if (!activeEmergency || activeEmergency.status === "reached_hospital") {
    return;
  }

  if (!activeEmergency.acceptedAt) {
    activeEmergency.status = "ambulance_assigned";
    activeEmergency.statusMessage = "Ambulance assigned";
    return;
  }

  const now = Date.now();
  const toPatientSeconds = Math.max(30, activeEmergency.etaBreakdown.toPatient * 8);
  const toHospitalSeconds = Math.max(40, activeEmergency.etaBreakdown.toHospital * 8);

  if (!activeEmergency.pickedAt) {
    const elapsedToPatient = (now - activeEmergency.acceptedAt) / 1000;
    const ratio = Math.min(1, elapsedToPatient / toPatientSeconds);

    const updatedPosition = interpolatePoint(
      activeEmergency.route.ambulanceStart,
      activeEmergency.patient,
      ratio
    );

    activeEmergency.ambulance.lat = updatedPosition.lat;
    activeEmergency.ambulance.lng = updatedPosition.lng;

    if (ratio < 1) {
      activeEmergency.status = "driver_arriving";
      activeEmergency.statusMessage = "Driver arriving";
      activeEmergency.eta = Math.max(1, Math.round((toPatientSeconds - elapsedToPatient) / 8));
      return;
    }

    activeEmergency.pickedAt = now;
    activeEmergency.status = "patient_picked";
    activeEmergency.statusMessage = "Patient picked up";
  }

  const elapsedToHospital = (now - activeEmergency.pickedAt) / 1000;
  const ratioToHospital = Math.min(1, elapsedToHospital / toHospitalSeconds);

  const hospitalPosition = interpolatePoint(
    activeEmergency.patient,
    activeEmergency.hospital,
    ratioToHospital
  );

  activeEmergency.ambulance.lat = hospitalPosition.lat;
  activeEmergency.ambulance.lng = hospitalPosition.lng;

  if (ratioToHospital < 1) {
    activeEmergency.status = "to_hospital";
    activeEmergency.statusMessage = "Patient en route to hospital";
    activeEmergency.eta = Math.max(1, Math.round((toHospitalSeconds - elapsedToHospital) / 8));
    return;
  }

  activeEmergency.status = "reached_hospital";
  activeEmergency.statusMessage = "Patient reached hospital successfully";
  activeEmergency.completedAt = now;
  activeEmergency.eta = 0;

  const sourceAmbulance = ambulances.find((item) => item.id === activeEmergency.ambulance.id);
  if (sourceAmbulance) {
    sourceAmbulance.available = true;
    sourceAmbulance.lat = activeEmergency.hospital.lat;
    sourceAmbulance.lng = activeEmergency.hospital.lng;
  }
}

function createEmergency(req, res) {
  const { lat, lng, patientName } = req.body || {};

  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({
      status: "error",
      message: "lat and lng are required as numbers."
    });
  }

  if (activeEmergency && activeEmergency.status !== "reached_hospital") {
    return res.status(409).json({
      status: "error",
      message: "An active emergency is already in progress.",
      activeEmergency: buildResponse(activeEmergency)
    });
  }

  const patientLocation = toFixedLocation(lat, lng);
  const result = assignEmergency({
    patientLocation,
    ambulances,
    hospitals,
    trafficZones: traffic
  });

  if (!result.success) {
    return res.status(503).json({
      status: "error",
      message: result.reason
    });
  }

  const sourceAmbulance = ambulances.find((item) => item.id === result.ambulance.id);
  sourceAmbulance.available = false;

  activeEmergency = {
    id: `EMG-${String(emergencyCount).padStart(3, "0")}`,
    status: "ambulance_assigned",
    statusMessage: "Ambulance assigned",
    createdAt: Date.now(),
    acceptedAt: null,
    pickedAt: null,
    completedAt: null,
    patient: {
      patientName: patientName || "Anonymous Patient",
      ...patientLocation
    },
    ambulance: {
      id: result.ambulance.id,
      driverName: result.ambulance.driverName,
      lat: result.ambulance.lat,
      lng: result.ambulance.lng
    },
    route: {
      ambulanceStart: {
        lat: result.ambulance.lat,
        lng: result.ambulance.lng
      }
    },
    hospital: {
      id: result.hospital.id,
      name: result.hospital.name,
      beds: result.hospital.beds,
      icu: result.hospital.icu,
      lat: result.hospital.lat,
      lng: result.hospital.lng
    },
    eta: result.totalEta,
    etaBreakdown: {
      toPatient: result.etaToPatient,
      toHospital: result.etaToHospital
    }
  };

  emergencyCount += 1;
  return res.status(201).json(buildResponse(activeEmergency));
}

function getActiveEmergency(_req, res) {
  updateEmergencyState();
  return res.json({
    status: "ok",
    emergency: buildResponse(activeEmergency)
  });
}

function acceptEmergency(req, res) {
  const { id } = req.params;

  if (!activeEmergency || activeEmergency.id !== id) {
    return res.status(404).json({
      status: "error",
      message: "Emergency not found."
    });
  }

  if (!activeEmergency.acceptedAt) {
    activeEmergency.acceptedAt = Date.now();
  }

  updateEmergencyState();
  return res.json({
    status: "ok",
    emergency: buildResponse(activeEmergency)
  });
}

function resetEmergency(_req, res) {
  if (activeEmergency) {
    const sourceAmbulance = ambulances.find((item) => item.id === activeEmergency.ambulance.id);
    if (sourceAmbulance) {
      sourceAmbulance.available = true;
      sourceAmbulance.lat = activeEmergency.route.ambulanceStart.lat;
      sourceAmbulance.lng = activeEmergency.route.ambulanceStart.lng;
    }
  }

  activeEmergency = null;
  return res.json({
    status: "ok",
    message: "Emergency state reset."
  });
}

module.exports = {
  createEmergency,
  getActiveEmergency,
  acceptEmergency,
  resetEmergency
};
