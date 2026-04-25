function formatNumber(value, suffix = "") {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }

  return `${value}${suffix}`;
}

function RouteMetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function RouteBlock({ title, tone, route }) {
  if (!route) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold text-slate-700">{title}</p>
        <p className="mt-1 text-xs text-slate-500">No route data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className={`inline-block h-2 w-2 rounded-full ${tone}`} />
        <p className="text-xs font-semibold text-slate-700">{title}</p>
      </div>
      <div className="space-y-1.5">
        <RouteMetricRow label="Distance" value={formatNumber(route.distanceKm, " km")} />
        <RouteMetricRow label="Traffic Delay" value={formatNumber(route.trafficDelayMinutes, " min")} />
        <RouteMetricRow label="Traffic Level" value={route.trafficLevel || "-"} />
      </div>
    </div>
  );
}

function RouteInsightsCard({ routes }) {
  const shortestRoute = routes?.shortestRoute;
  const recommendedRoute = routes?.recommendedRoute;
  const timeSaved = routes?.estimatedTimeSavedMinutes ?? 0;

  return (
    <div className="grid gap-3 border-t border-slate-100 bg-slate-50 p-4 md:grid-cols-2">
      <RouteBlock title="Shortest Route" tone="bg-red-500" route={shortestRoute} />
      <RouteBlock title="AI Recommended Route" tone="bg-green-500" route={recommendedRoute} />
      <div className="md:col-span-2">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs">
          <span className="text-emerald-700">Estimated time saved:</span>
          <span className="ml-1 font-semibold text-emerald-800">{formatNumber(timeSaved, " min")}</span>
        </div>
      </div>
    </div>
  );
}

export default RouteInsightsCard;
