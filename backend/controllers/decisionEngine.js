const { getDistanceInKm } = require("../utils/distanceCalculator");
const { getEtaMinutes } = require("../utils/etaCalculator");

function pickNearestAvailableAmbulance(patientLocation, ambulances) {
  const available = ambulances.filter((ambulance) => ambulance.available);

  if (!available.length) {
    return null;
  }

  const ranked = available
    .map((ambulance) => {
      const distanceKm = getDistanceInKm(patientLocation, ambulance);
      return { ...ambulance, distanceToPatientKm: distanceKm };
    })
    .sort((a, b) => a.distanceToPatientKm - b.distanceToPatientKm);

  return ranked[0];
}

function pickBestHospital(patientLocation, hospitals, trafficZones) {
  const candidates = hospitals.filter((hospital) => hospital.beds > 0 && hospital.icu > 0);

  if (!candidates.length) {
    return null;
  }

  const ranked = candidates
    .map((hospital) => {
      const distanceKm = getDistanceInKm(patientLocation, hospital);
      const etaMinutes = getEtaMinutes(patientLocation, hospital, trafficZones);
      const capacityScore = hospital.beds * 1.2 + hospital.icu * 2;
      const score = etaMinutes - capacityScore;

      return {
        ...hospital,
        distanceFromPatientKm: distanceKm,
        etaFromPatientMinutes: etaMinutes,
        score
      };
    })
    .sort((a, b) => a.score - b.score);

  return ranked[0];
}

function assignEmergency({ patientLocation, ambulances, hospitals, trafficZones }) {
  const ambulance = pickNearestAvailableAmbulance(patientLocation, ambulances);

  if (!ambulance) {
    return {
      success: false,
      reason: "No available ambulance found at this moment."
    };
  }

  const hospital = pickBestHospital(patientLocation, hospitals, trafficZones);

  if (!hospital) {
    return {
      success: false,
      reason: "No hospital with bed and ICU availability found."
    };
  }

  const etaToPatient = getEtaMinutes(
    { lat: ambulance.lat, lng: ambulance.lng },
    patientLocation,
    trafficZones
  );

  const etaToHospital = getEtaMinutes(patientLocation, hospital, trafficZones);

  return {
    success: true,
    ambulance,
    hospital,
    etaToPatient,
    etaToHospital,
    totalEta: etaToPatient + etaToHospital
  };
}

module.exports = {
  assignEmergency
};
