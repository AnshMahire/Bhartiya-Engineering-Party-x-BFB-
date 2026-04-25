const { readEmergencyState, writeEmergencyState } = require("../utils/emergencyStateStore");

function getAmbulanceRequest(_req, res) {
  const state = readEmergencyState();

  if (!state.requestId) {
    return res.json({
      status: "idle",
      message: "No active ambulance request",
      emergency: state
    });
  }

  return res.json({
    status: "ok",
    emergency: state
  });
}

function acceptAmbulanceRequest(_req, res) {
  const state = readEmergencyState();

  if (!state.requestId) {
    return res.status(404).json({
      status: "error",
      message: "No active request"
    });
  }

  if (state.ambulance.status === "accepted" || state.ambulance.status === "arriving_patient") {
    return res.json({
      status: "ok",
      emergency: state
    });
  }

  const nextState = {
    ...state,
    emergencyStatus: "driver_enroute",
    ambulance: {
      ...state.ambulance,
      status: "accepted",
      acceptedAt: new Date().toISOString()
    }
  };

  const written = writeEmergencyState(nextState);
  return res.json({
    status: "ok",
    emergency: written
  });
}

function pickupPatient(_req, res) {
  const state = readEmergencyState();

  if (!state.requestId) {
    return res.status(404).json({
      status: "error",
      message: "No active request"
    });
  }

  if (state.patient.status === "picked") {
    return res.json({
      status: "ok",
      emergency: state
    });
  }

  const nextState = {
    ...state,
    phase: "to_hospital",
    emergencyStatus: "enroute_hospital",
    patient: {
      ...state.patient,
      status: "picked"
    },
    ambulance: {
      ...state.ambulance,
      status: "patient_picked",
      pickedUpAt: new Date().toISOString()
    },
    hospital: {
      ...state.hospital,
      status: state.hospital.confirmed ? "confirmed" : "awaiting_confirmation"
    }
  };

  const written = writeEmergencyState(nextState);
  return res.json({
    status: "ok",
    emergency: written
  });
}

module.exports = {
  getAmbulanceRequest,
  acceptAmbulanceRequest,
  pickupPatient
};
