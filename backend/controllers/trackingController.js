const ambulances = require("../data/ambulances");
const traffic = require("../data/traffic");
const { getDistanceInKm } = require("../utils/distanceCalculator");
const { getEtaMinutes } = require("../utils/etaCalculator");
const { readEmergencyState, writeEmergencyState } = require("../utils/emergencyStateStore");

const UPDATE_INTERVAL_MS = 3000;
const STEP_RATIO = 0.2;
let timer = null;

function interpolate(current, target, ratio) {
  return {
    lat: Number((current.lat + (target.lat - current.lat) * ratio).toFixed(6)),
    lng: Number((current.lng + (target.lng - current.lng) * ratio).toFixed(6))
  };
}

function isNear(pointA, pointB, maxDistanceKm = 0.08) {
  return getDistanceInKm(pointA, pointB) <= maxDistanceKm;
}

function recalculateEta(state) {
  if (!state.requestId) {
    return state;
  }

  if (state.phase === "to_patient") {
    const etaToPatient = getEtaMinutes(
      { lat: state.ambulance.lat, lng: state.ambulance.lng },
      { lat: state.patient.lat, lng: state.patient.lng },
      traffic
    );

    const etaToHospital = getEtaMinutes(
      { lat: state.patient.lat, lng: state.patient.lng },
      { lat: state.hospital.lat, lng: state.hospital.lng },
      traffic
    );

    return {
      ...state,
      eta: etaToPatient + etaToHospital
    };
  }

  if (state.phase === "to_hospital") {
    const etaToHospital = getEtaMinutes(
      { lat: state.ambulance.lat, lng: state.ambulance.lng },
      { lat: state.hospital.lat, lng: state.hospital.lng },
      traffic
    );

    return {
      ...state,
      eta: etaToHospital
    };
  }

  return state;
}

function tickTrackingState() {
  const state = readEmergencyState();

  if (!state.requestId || state.emergencyStatus === "completed" || state.emergencyStatus === "idle") {
    return;
  }

  let nextState = { ...state };

  if (state.phase === "to_patient" && state.ambulance.status !== "assigned") {
    const current = { lat: state.ambulance.lat, lng: state.ambulance.lng };
    const target = { lat: state.patient.lat, lng: state.patient.lng };
    const updatedPoint = interpolate(current, target, STEP_RATIO);

    nextState = {
      ...nextState,
      ambulance: {
        ...nextState.ambulance,
        lat: updatedPoint.lat,
        lng: updatedPoint.lng,
        status: "arriving_patient"
      },
      emergencyStatus: "driver_arriving"
    };

    if (isNear(updatedPoint, target)) {
      nextState = {
        ...nextState,
        ambulance: {
          ...nextState.ambulance,
          lat: target.lat,
          lng: target.lng,
          status: "arrived_patient"
        },
        emergencyStatus: "awaiting_pickup"
      };
    }
  }

  if (state.phase === "to_hospital") {
    const current = { lat: state.ambulance.lat, lng: state.ambulance.lng };
    const target = { lat: state.hospital.lat, lng: state.hospital.lng };
    const updatedPoint = interpolate(current, target, STEP_RATIO);

    nextState = {
      ...nextState,
      ambulance: {
        ...nextState.ambulance,
        lat: updatedPoint.lat,
        lng: updatedPoint.lng,
        status: "enroute_hospital"
      },
      emergencyStatus: "enroute_hospital"
    };

    if (isNear(updatedPoint, target)) {
      const selectedAmbulance = ambulances.find((item) => item.id === state.ambulance.id);
      if (selectedAmbulance) {
        selectedAmbulance.available = true;
        selectedAmbulance.lat = target.lat;
        selectedAmbulance.lng = target.lng;
      }

      nextState = {
        ...nextState,
        eta: 0,
        emergencyStatus: "completed",
        phase: "completed",
        patient: {
          ...nextState.patient,
          status: "reached_hospital"
        },
        ambulance: {
          ...nextState.ambulance,
          lat: target.lat,
          lng: target.lng,
          status: "available"
        },
        hospital: {
          ...nextState.hospital,
          status: nextState.hospital.confirmed ? "patient_received" : "patient_received_unconfirmed"
        }
      };
    }
  }

  nextState = recalculateEta(nextState);
  writeEmergencyState(nextState);
}

function startTrackingSimulation() {
  if (timer) {
    return;
  }

  timer = setInterval(tickTrackingState, UPDATE_INTERVAL_MS);
}

function stopTrackingSimulation() {
  if (!timer) {
    return;
  }

  clearInterval(timer);
  timer = null;
}

function getTracking(_req, res) {
  const state = readEmergencyState();
  return res.json({
    status: "ok",
    emergency: state
  });
}

module.exports = {
  getTracking,
  startTrackingSimulation,
  stopTrackingSimulation
};
