const { getDistanceInKm } = require("./distanceCalculator");

const AMBULANCE_AVG_SPEED_KMPH = 35;

function getRouteDistanceKm(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return 0;
  }

  let total = 0;

  for (let index = 1; index < coordinates.length; index += 1) {
    total += getDistanceInKm(coordinates[index - 1], coordinates[index]);
  }

  return Number(total.toFixed(3));
}

function getTrafficLevel(delayMinutes) {
  if (delayMinutes >= 8) {
    return "High";
  }

  if (delayMinutes >= 4) {
    return "Moderate";
  }

  return "Low";
}

function evaluateRouteTraffic({ coordinates, trafficZones = [] }) {
  const routeDistanceKm = getRouteDistanceKm(coordinates);
  const baseTravelMinutes = (routeDistanceKm / AMBULANCE_AVG_SPEED_KMPH) * 60;

  const impactedZones = trafficZones.filter((zone) =>
    coordinates.some((point) => {
      const distanceToZone = getDistanceInKm(point, {
        lat: zone.centerLat,
        lng: zone.centerLng
      });
      return distanceToZone <= zone.radiusKm;
    })
  );

  const delayFactor = impactedZones.reduce((value, zone) => value * zone.delayFactor, 1);
  const extraMinutes = impactedZones.reduce((value, zone) => value + zone.extraMinutes, 0);
  const totalDelayMinutes = Math.max(0, baseTravelMinutes * (delayFactor - 1) + extraMinutes);
  const totalMinutes = Math.max(1, Math.round(baseTravelMinutes + totalDelayMinutes));

  return {
    routeDistanceKm,
    baseTravelMinutes: Math.max(1, Math.round(baseTravelMinutes)),
    trafficDelayMinutes: Math.round(totalDelayMinutes),
    totalMinutes,
    trafficLevel: getTrafficLevel(totalDelayMinutes),
    impactedZones: impactedZones.map((zone) => zone.area)
  };
}

module.exports = {
  AMBULANCE_AVG_SPEED_KMPH,
  getRouteDistanceKm,
  evaluateRouteTraffic
};
