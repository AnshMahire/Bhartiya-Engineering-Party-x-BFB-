const fs = require("fs");
const path = require("path");

const STATE_FILE_PATH = path.join(__dirname, "..", "data", "emergencyState.json");

const EMPTY_STATE = {
  requestId: null,
  emergencyStatus: "idle",
  phase: "idle",
  patient: {
    name: "",
    lat: null,
    lng: null,
    status: "idle"
  },
  ambulance: {
    id: "",
    driverName: "",
    lat: null,
    lng: null,
    status: "idle",
    acceptedAt: null,
    pickedUpAt: null
  },
  hospital: {
    id: "",
    name: "",
    lat: null,
    lng: null,
    beds: 0,
    icu: 0,
    status: "idle",
    confirmed: false
  },
  eta: 0,
  route: {
    ambulanceStart: {
      lat: null,
      lng: null
    },
    patient: {
      lat: null,
      lng: null
    },
    hospital: {
      lat: null,
      lng: null
    }
  },
  updatedAt: null
};

function ensureStateFile() {
  if (!fs.existsSync(STATE_FILE_PATH)) {
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(EMPTY_STATE, null, 2));
    return;
  }

  const raw = fs.readFileSync(STATE_FILE_PATH, "utf-8").trim();
  if (!raw) {
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(EMPTY_STATE, null, 2));
  }
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function readEmergencyState() {
  ensureStateFile();
  const raw = fs.readFileSync(STATE_FILE_PATH, "utf-8");

  try {
    return JSON.parse(raw);
  } catch (_error) {
    const reset = clone(EMPTY_STATE);
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(reset, null, 2));
    return reset;
  }
}

function writeEmergencyState(nextState) {
  const withUpdatedTime = {
    ...nextState,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(withUpdatedTime, null, 2));
  return withUpdatedTime;
}

function resetEmergencyState() {
  const reset = clone(EMPTY_STATE);
  return writeEmergencyState(reset);
}

function getNextRequestId() {
  const state = readEmergencyState();
  if (!state.requestId) {
    return "REQ001";
  }

  const currentNumber = Number(String(state.requestId).replace("REQ", "")) || 0;
  return `REQ${String(currentNumber + 1).padStart(3, "0")}`;
}

module.exports = {
  STATE_FILE_PATH,
  EMPTY_STATE,
  readEmergencyState,
  writeEmergencyState,
  resetEmergencyState,
  getNextRequestId
};
