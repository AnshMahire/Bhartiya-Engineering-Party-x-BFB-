const { readEmergencyState, writeEmergencyState } = require("../utils/emergencyStateStore");

function getHospitalAlert(_req, res) {
  const state = readEmergencyState();

  if (!state.requestId) {
    return res.json({
      status: "idle",
      message: "No incoming patient",
      emergency: state
    });
  }

  return res.json({
    status: "ok",
    emergency: state
  });
}

function confirmHospital(_req, res) {
  const state = readEmergencyState();

  if (!state.requestId) {
    return res.status(404).json({
      status: "error",
      message: "No active request"
    });
  }

  const nextState = {
    ...state,
    hospital: {
      ...state.hospital,
      confirmed: true,
      status: "confirmed"
    }
  };

  const written = writeEmergencyState(nextState);
  return res.json({
    status: "ok",
    emergency: written
  });
}

module.exports = {
  getHospitalAlert,
  confirmHospital
};
