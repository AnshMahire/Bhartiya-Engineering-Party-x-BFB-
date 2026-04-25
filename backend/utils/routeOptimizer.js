const routeTemplates = require("../data/routes");
const { evaluateRouteTraffic, getRouteDistanceKm } = require("./trafficAI");

function toPoint(value) {
  return {
    lat: Number(Number(value.lat).toFixed(6)),
    lng: Number(Number(value.lng).toFixed(6))
  };
}

function buildRouteCoordinates(template, start, end) {
  const midpoint = {
    lat: (start.lat + end.lat) / 2,
    lng: (start.lng + end.lng) / 2
  };

  const coordinates = (template.coordinates || []).map((step) => {
    if (step.type === "start") {
      return toPoint(start);
    }

    if (step.type === "end") {
      return toPoint(end);
    }

    if (typeof step.lat === "number" && typeof step.lng === "number") {
      return toPoint(step);
    }

    return toPoint({
      lat: midpoint.lat + (step.latOffset || 0),
      lng: midpoint.lng + (step.lngOffset || 0)
    });
  });

  if (!coordinates.length) {
    return [toPoint(start), toPoint(end)];
  }

  if (coordinates[0].lat !== start.lat || coordinates[0].lng !== start.lng) {
    coordinates.unshift(toPoint(start));
  }

  const last = coordinates[coordinates.length - 1];
  if (last.lat !== end.lat || last.lng !== end.lng) {
    coordinates.push(toPoint(end));
  }

  return coordinates;
}

function enrichRoute(template, start, end, trafficZones) {
  const coordinates = buildRouteCoordinates(template, start, end);
  const analysis = evaluateRouteTraffic({ coordinates, trafficZones });

  return {
    id: template.id,
    name: template.name,
    distanceKm: Number(getRouteDistanceKm(coordinates).toFixed(2)),
    coordinates,
    trafficDelayMinutes: analysis.trafficDelayMinutes,
    trafficLevel: analysis.trafficLevel,
    totalMinutes: analysis.totalMinutes,
    impactedZones: analysis.impactedZones
  };
}

function optimizeRoutes({ start, end, trafficZones = [] }) {
  const candidates = routeTemplates.map((template) =>
    enrichRoute(template, start, end, trafficZones)
  );

  const shortestRoute = [...candidates].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  const fastestRoute = [...candidates].sort((a, b) => a.totalMinutes - b.totalMinutes)[0];
  const recommendedRoute = fastestRoute;

  const estimatedTimeSavedMinutes = Math.max(0, shortestRoute.totalMinutes - recommendedRoute.totalMinutes);

  return {
    shortestRoute,
    fastestRoute,
    recommendedRoute,
    estimatedTimeSavedMinutes,
    candidates
  };
}

module.exports = {
  optimizeRoutes
};
