const { getDistanceInKm } = require("./distanceCalculator");

const AMBULANCE_AVG_SPEED_KMPH = 35;

function getTrafficImpact(pointA, pointB, trafficZones) {
  let factor = 1;
  let extraMinutes = 0;

  trafficZones.forEach((zone) => {
    const distanceFromA = getDistanceInKm(pointA, { lat: zone.centerLat, lng: zone.centerLng });
    const distanceFromB = getDistanceInKm(pointB, { lat: zone.centerLat, lng: zone.centerLng });
    const crossesZone = distanceFromA <= zone.radiusKm || distanceFromB <= zone.radiusKm;

    if (crossesZone) {
      factor *= zone.delayFactor;
      extraMinutes += zone.extraMinutes;
    }
  });

  return { factor, extraMinutes };
}

function getEtaMinutes(pointA, pointB, trafficZones = []) {
  const distanceKm = getDistanceInKm(pointA, pointB);
  const baseMinutes = (distanceKm / AMBULANCE_AVG_SPEED_KMPH) * 60;
  const { factor, extraMinutes } = getTrafficImpact(pointA, pointB, trafficZones);
  const eta = baseMinutes * factor + extraMinutes;

  return Math.max(1, Math.round(eta));
}

module.exports = {
  getEtaMinutes,
  getTrafficImpact
};
