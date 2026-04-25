const EARTH_RADIUS_KM = 6371;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function getDistanceInKm(pointA, pointB) {
  const latDelta = toRadians(pointB.lat - pointA.lat);
  const lngDelta = toRadians(pointB.lng - pointA.lng);
  const latA = toRadians(pointA.lat);
  const latB = toRadians(pointB.lat);

  const haversine =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(latA) * Math.cos(latB) * Math.sin(lngDelta / 2) * Math.sin(lngDelta / 2);

  const arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return EARTH_RADIUS_KM * arc;
}

module.exports = {
  getDistanceInKm
};
